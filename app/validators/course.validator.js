const Joi = require('@hapi/joi');

class AddCourseValidator {
    constructor() {
        this.schema = {
            lessonName: Joi.string().min(3).max(50).required(),
            topics: Joi.array().items(Joi.string()).required(),
            image: Joi.string().required(),
            description: Joi.string().required().min(3).max(2000),
            category: Joi.number().required(),
        };
    }
    addCourseValidator(courseInfo) {
        return Joi.validate(courseInfo, this.schema, { abortEarly: false });
    }
}

module.exports = AddCourseValidator;
