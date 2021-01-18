const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connectionScheme = new Schema({
    name: {
        type: String
    },
    command: {
        type: String,
    },
    type: {
        type: String,
        enum: ['I', 'O']
    },
    custom: {
        encoding: String,
        prefix: String,
        suffix: String,
        checksum: Boolean,
    },
},{ timestamps: true });

const Connection = mongoose.model('Connection', connectionScheme);

module.exports = Connection;