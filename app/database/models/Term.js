const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 3,
        maxlength: 50,
        required: true,
        trim: true,
    },
    cost: {
        type: Number,
        min: 0,
        required: true,
        trim: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    capacity: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
    },
    teacher: {
        fullName: String,
        email: String,
        _id: ObjectId,
        profile: String,
    },
    students: [
        {
            _id: ObjectId,
            fullName: String,
            email: String,
            profile: String,
        },
    ],
    lesson: {
        _id: ObjectId,
        lessonName: String,
        topics: [String],
        description: String,
        image: String,
    },
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
