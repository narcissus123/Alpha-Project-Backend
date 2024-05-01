const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var CommentSchema = new Schema({
    postId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: false,
    },
    createDate: {
        type: Date,
        default: Date.now,
    },
    verified: {
        type: Boolean,
        required: false,
        default: false,
    },
});

module.exports = mongoose.model('Comment', CommentSchema);
