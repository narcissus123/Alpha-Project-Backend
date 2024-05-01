const mongoose = require('mongoose');
const { UserSchema } = require('./User');
const SchemaMethod = require('./schemaMethods');
var ObjectId = mongoose.Schema.Types.ObjectId;

// create user schema
const StudentSchema = new mongoose.Schema(UserSchema);

StudentSchema.add({
    courses: [
        {
            _id: ObjectId,
            title: String,
            cost: Number,
            endDate: String,
            startDate: String,
            teacher: {
                fullName: String,
                email: String,
                _id: ObjectId,
            },
            lesson: {
                _id: ObjectId,
                lessonName: String,
                topics: [String],
                description: String,
                image: String,
            },
        },
    ],
});

const {
    generateAuthToken,
    setResetPasswordExpires,
    setResetPasswordToken,
    validatePassword,
    hashPassword,
} = new SchemaMethod();

StudentSchema.methods.generateAuthToken = generateAuthToken;

StudentSchema.methods.setResetPasswordExpires = setResetPasswordExpires;

StudentSchema.methods.setResetPasswordToken = setResetPasswordToken;

StudentSchema.methods.validatePassword = validatePassword;

StudentSchema.methods.hashPassword = hashPassword;

const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;
