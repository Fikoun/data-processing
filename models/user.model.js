const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userScheme = new Schema({
    name: {
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    permission: {
        type: String,
        enum : ['reqistered', 'user', 'admin'],
        default: 'registered'
    },
},{ timestamps: true });

const User = mongoose.model('User', userScheme);

module.exports = User;