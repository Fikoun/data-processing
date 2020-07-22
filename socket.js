const path = require('path');
const io = require('socket.io');

// ADD: choice option and default value
class SocketController {
    constructor() {
        this.server = io.listen(8000)
        this.clients = new Map();

        this.server.on("connection", (socket) => {
            console.info(`\n\nClient connected id > ${socket.id}`);

            socket.onData = () => { };
            this.handleClient(socket)
            
            socket.on("settings", (settings) => {
                
                // SCRAP this logic !
                socket.callbacks = new Map();
                socket.addCallback = function (callback, once=true) {
                    this.callbacks.set(callback, {once}) 
                }
                socket.handleCallbacks = function (eventData) {
                    this.callbacks.forEach(({once}, callback) => {
                        console.log([callback, eventData]);
                        callback(eventData)
        
                        if (once)
                            this.callbacks.delete(callback)
                    })
                }

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



    handleClient(client) {
        client.on('data', (data) => {
            // console.log(data);
            // console.log(client.onData);
            
            // client.handleCallbacks(data);
            client.onData(data);
        });
    }

}

module.exports = new SocketController();