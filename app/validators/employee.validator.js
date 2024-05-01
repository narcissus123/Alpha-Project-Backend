const Joi = require('@hapi/joi');
const BaseUserValidator = require('./baseUser.validator');
class EmployeeValidatore extends BaseUserValidator {

    registerEmployeeValidator(userInfo) {
        const schema = Joi.object().keys({
            ...this.schema,
            password: Joi.string()
                .min(8)
                .max(32)
                .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
                .required(),
            address: Joi.string()
                .required()
                .min(5)
                .max(255),
            role: Joi.string().required()
        });
        return Joi.validate(userInfo, schema, { abortEarly: false });
    }
    updateEmployeeValidator(userInfo) {
        const schema = Joi.object().keys({
            ...this.schema,
            address: Joi.string()
                .required()
                .min(5)
                .max(255)
        });
        return Joi.validate(userInfo, schema, { abortEarly: false });
    }
}
module.exports = EmployeeValidatore;