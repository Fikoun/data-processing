const SerialPort = require("serialport");

class DeviceController {
    constructor() {
        this.connections = [];
    }

    async openSerial({ port, baudRate = 9600 , openCallback}) {
        let connection = {
            open: false,
            value: 0,
            port: SerialPort(port, { baudRate, autoOpen: false }),
            listeners: new Map(),
            listener: function (listener, once=true) {
                this.listeners.set(listener, once)
            }
        }

        connection.port.on('close', function (err) {
            if (err)
                console.error(err);
            this.open = false;
        }.bind(connection))

        connection.port.open( (err) => { 
            if (err)
                console.error(err);
            
            connection.open = true;

            connection.port.on('data', (data) => { // READLINE stream?!
                console.log({data})
                connection.listeners.forEach((once, callback) => {
                    callback(data.toString())
                    if (once)
                        connection.listeners.delete(callback);
                })
            })

            openCallback(connection)
        });

        this.connections.push(connection);
        return connection;
        // console.log(connection);
    }

    async list() {
        return this.connections;
    }

    async listPorts(filterUSB = false) {
        let ports = await SerialPort.list();

        if (filterUSB)
            ports = ports.filter((port) => (port.path.includes('usb') || (port.path.includes('COM'))))

        return (ports.map((port, key) => ({ name: `Serial-${key + 1}`, path: port.path })))
    }

    async command({path, command, baudRate}, callback) {
        const runCommand = () => {
            let serialConn = this.connections.find (c => c.port.path==path )
            
            console.log({conns: this.connections})
            
            serialConn.listener( function (data) {
                console.log({data})
                if (data.toString()) {
                    callback(data.toString())
                }
            })
            serialConn.port.write(command+"\r")
        }

        
        // If not in connections.. try to connect
        let serialConn = this.connections.find (c => c.port.path==path )

        console.log({conns: this.connections})
        
        if (!serialConn) {
             this.openSerial({port: path, baudRate, openCallback: runCommand})
        } else 
            runCommand()  
    }
}

module.exports = new DeviceController();