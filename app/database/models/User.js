const mongoose = require('mongoose');

// create user schema
const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        minlength: 5,
        maxlength: 255,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        minlength: 5,
        maxlength: 1024,
        required: true,
        trim: true,
    },
    salt: {
        type: String,
        required: true,
        maxlength: 32,
    },
    phoneNumber: {
        type: String,
        minlength: 10,
        maxlength: 15,
        required: true,
        trim: true,
    },
    birthDate: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        default: 'student',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    registerDate: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
    nationalId: {
        type: String,
        match: /^\d{10}$/,
        required: true,
        unique: true,
        trim: true,
    },
    profile: {
        type: String,
    },
});

const User = mongoose.model('User', UserSchema);

module.exports = { User, UserSchema };
