const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
// create user schema
const LessonSchema = new mongoose.Schema({
    lessonName: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true,
    },
    topics: {
        type: [String],
        required: true,
    },
    description: {
        type: String,
        minlength: 3,
        maxlength: 2000,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    createDate: {
        type: Date,
        default: Date.now,
    },
    category: {
        type: Number,
        required: true,
    },
    courses: [
        {
            _id: ObjectId,
            title: String,
            cost: Number,
            endDate: String,
            startDate: String,
        },
    ],
});

const Lesson = mongoose.model('Lesson', LessonSchema);

module.exports = { Lesson, LessonSchema };
