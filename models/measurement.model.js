const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const measurementScheme = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    state: {
        type: String,
        enum : ['new', 'running', 'error'],
        default: 'new'
    },
    data: [{
        device: {
            type: mongoose.Types.ObjectId,
            ref: "Device"
        },
        time: {
            type: Date
        },
        value: {
            type: Number
        } 
    }],
    devices: [{
        type: mongoose.Types.ObjectId,
        ref: "Device"
    }]
},{ timestamps: true });

const Measurement = mongoose.model('Measurement', measurementScheme);

module.exports = Measurement;