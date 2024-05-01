const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// create user schema
const TermLikeSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    courseId: {
        type: String,
        required: true,
    },
    like: {
        type: Boolean,
        required: true,
    },
    createDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('CourseLike', TermLikeSchema);
