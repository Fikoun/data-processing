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
        time: {
            type: Date
        },
        value: {
            type: Number
        } 
    }],
    device: mongoose.Types.ObjectId
},{ timestamps: true });

const Measurement = mongoose.model('Measurement', measurementScheme);

module.exports = Measurement;