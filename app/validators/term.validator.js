const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

class TermValidator {
    validateTerm(term) {
        const schema = Joi.object().keys({
            title: Joi.string().min(3).max(50).required(),
            cost: Joi.number().min(0).required(),
            endDate: Joi.date().required(),
            startDate: Joi.date().required(),
            capacity: Joi.number().min(0).max(100).required(),
            teacher: Joi.objectId().required(),
            lesson: Joi.objectId().required(),
        });

        return Joi.validate(term, schema, { abortEarly: false });
    }

    validateAssignStudentToTerm(model) {
        const schema = Joi.object().keys({
            courseId: Joi.objectId().required(),
        });

        return Joi.validate(model, schema, { abortEarly: false });
    }
}

module.exports = TermValidator;
