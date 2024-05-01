const Joi = require('@hapi/joi');

class BaseUserValidator {
    constructor() {
        this.schema = {
            fullName: Joi.string().min(2).max(50).required(),
            phoneNumber: Joi.string()
                .regex(/^[0-9]*$/)
                .min(10)
                .max(15)
                .required(),
            birthDate: Joi.string().required(),
            email: Joi.string().min(5).max(255).email().required(),
            nationalId: Joi.string()
                .required()
                .regex(/^\d{10}$/),
            profile: Joi.string().optional(),
        };
    }
}
module.exports = BaseUserValidator;
