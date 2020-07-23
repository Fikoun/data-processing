const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stationScheme = new Schema({
    name: String,
    socketId: String,
    status: {
        type: String,
        enum: ['offline', 'waiting', 'online', 'error'],
        required: true,
    },
    devices: [
        {
            name: String,
            baudRate: {
                type: Number,
                default: 9600
            },
            port: {
                type: String,
                required: true
            },
            commands: [{
                name: String,
                command: String,
            }]
        }
    ]
},{ timestamps: true });

const Station = mongoose.model('Station', stationScheme);

module.exports = Station;