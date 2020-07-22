const socket = require("./socket");
const config = require('./config');

// File create in dir name... :) (or filename?)

config.loadConfig([
    {
        type: 'text',
        name: 'host',
        message: 'Host IP',
        default: 'localhost'
    }, {
        type: 'number',
        name: 'port',
        message: 'Port number',
        default: '8000'
    }
]).then(() => socket.connect());