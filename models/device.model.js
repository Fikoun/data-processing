const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deviceScheme = new Schema({
    name: {
        type: String,
        required: true
    },
    port: {
        type: String,
        required: true
    },
    baudRate: {
        type: Number,
        default: 9600
    },
    station: {
        type: mongoose.Types.ObjectId,
        ref: "Station"
    },
    connections: [
    //     {
    //     type: mongoose.Types.ObjectId,
    //     ref: "Connection",
    //     status: Boolean
    // }
]
},{ timestamps: true });

const Device = mongoose.model('Device', deviceScheme);

module.exports = Device;