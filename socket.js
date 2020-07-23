const path = require('path');
const io = require('socket.io');

// ADD: choice option and default value
class SocketController {
    constructor() {
        this.server = io.listen(8000)
        this.clients = new Map();

        this.server.on("connection", (socket) => {
            console.info(`\n\nClient connected id > ${socket.id}`);
            
            socket.on("settings", (settings) => {

                this.clients.set(socket, settings);
                
                console.info(`\n\nClient saved > ${JSON.stringify(settings)}`);
            });

            socket.on("disconnect", () => {
                this.clients.delete(socket);
                console.info(`Client offline id > ${socket.id}`);
            });

            // socket.emit('open', {port: '/dev/tty.usbserial-0001'})
        });

    }


}

module.exports = new SocketController();