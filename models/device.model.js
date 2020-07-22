const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deviceScheme = new Schema({
    port: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    commands: [{
        name: String,
        command: String
    }]
},{ timestamps: true });

const Device = mongoose.model('Device', deviceScheme);

module.exports = Device;