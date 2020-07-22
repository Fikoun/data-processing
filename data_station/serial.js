const SerialPort = require("serialport");

class DeviceController {

    constructor() {
        this.connections = [];
    }

    async openSerial({ port, baudRate = 9600 }) {
        let connection = {
            open: false,
            value: 0,
            port: SerialPort(port, { baudRate, autoOpen: false })
        }

        connection.port.on('close', function (err) {
            if (err)
                console.error(err);
            this.open = false;
        }.bind(connection))

        connection.port.open(function (err) {
            if (err)
                console.error(err);

            this.open = true;
        }.bind(connection));

        this.connections.push(connection);
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
}

module.exports = new DeviceController();