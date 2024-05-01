const mongoose = require('mongoose');
const { UserSchema } = require('./User');
const SchemaMethod = require('./schemaMethods');
var ObjectId = mongoose.Schema.Types.ObjectId;
// create employee schema
const EmployeeSchema = new mongoose.Schema(UserSchema);
EmployeeSchema.add({
    address: {
        type: String,
        trim: true,
        required: true,
        minlength: 5,
        maxlength: 255,
    },
    courses: [
        {
            _id: ObjectId,
            title: String,
            endDate: String,
            startDate: String,
            cost: Number,
            capacity: Number,
            lesson: {
                _id: ObjectId,
                lessonName: String,
                topics: Array,
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

EmployeeSchema.methods.generateAuthToken = generateAuthToken;

EmployeeSchema.methods.setResetPasswordExpires = setResetPasswordExpires;

EmployeeSchema.methods.setResetPasswordToken = setResetPasswordToken;

EmployeeSchema.methods.validatePassword = validatePassword;

EmployeeSchema.methods.hashPassword = hashPassword;

const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;
