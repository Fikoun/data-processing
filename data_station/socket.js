const io = require("socket.io-client");
const DeviceController = require("./serial");
const config = require('./config');
const ora = require('ora');

class SocketController {

    connect() {
        this.client = io.connect(`http://${config.get('host')}:${config.get('port')}`); /////////////////
        this.checkConnection();
    }

    checkConnection() {
        const connect_spinner = ora("Connecting ...").start();
        const timeout = 5000;
        const interval = 500;
        let connecting = true;

        const loop = async (i) => {
            if (!connecting) {
                connect_spinner.stop();
                console.log("\nTry correcting connection variables.");
                
                await config.ask('host')
                await config.ask('port')

                connect_spinner.start("Connecting ...")
                connecting = true;
                return loop(0);
            }

            if (!this.client.connected && i < timeout / interval)
                return setTimeout(() => loop(i+1), interval)
            else if (this.client.connected) {
                connecting = false;
                connect_spinner.succeed(`Connected to ${config.get('host')}:${config.get('port')}`);
            }
            else if (i >= timeout / interval) {
                connect_spinner.fail(`Timeout: Unable to connect to ${config.get('host')}:${config.get('port')}`);
                console.log();

                setTimeout(() => {
                    if (connecting) {
                        process.openStdin().addListener("data", function (d) {
                            connecting = false;
                        });
                        connect_spinner.start("Connecting ... press <enter>  to stop")
                        loop(0);
                    }
                }, 2000);
                return;
            }
        };

        this.client.on("connect", (msg, err) => {
            connect_spinner.succeed();
            this.client.emit('settings', config.data);
        });

        this.client.on("disconnect", (msg, err) => {
            connect_spinner.warn("Disconnected!");
            setTimeout(() => {
                connect_spinner.start("Reconnecting ...")
                connecting = true;
                loop(0);
            }, 2000);
        });



        this.handleServer();

        connecting = true;
        loop(0);
    }

    handleServer() { // port-path, device-variable
        
        this.client.on('open', (port) => {
            console.log(port)
            DeviceController.openSerial({port});
        });

        this.client.on('command', (settings) => {
            DeviceController.command(settings, (data) => {
                console.log(`${settings.path} (${settings.command}) => ${data.split('\r')[0]}`);
                this.client.emit('response', {...settings, data: data.split('\r')[0]})
            });
        });

        this.client.on('list', () => this.client.emit('message', DeviceController.list()));

        this.client.on('listPorts', () => {
            DeviceController.listPorts().then((list) => this.client.emit('listPorts', list))
        });
    }

}

module.exports = new SocketController();