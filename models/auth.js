const mongoose = require('mongoose');
const path = require('path');
const Schema = mongoose.Schema;

//Create Users Schema

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    phone: {
        type: String,
        required: true,
        min: 11,
        max: 11
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = Users = mongoose.model('users', UserSchema);