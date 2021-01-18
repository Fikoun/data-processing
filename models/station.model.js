const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stationScheme = new Schema({
    name: String,
    socketId: String,
    status: {
        type: String,
        enum: ['offline', 'waiting', 'online', 'error'],
        required: true,
    }
},{ timestamps: true });

const Station = mongoose.model('Station', stationScheme);

module.exports = Station;