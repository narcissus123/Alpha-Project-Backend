const Joi = require('@hapi/joi');
const BaseUserValidator = require('./baseUser.validator');
class StudentValidator extends BaseUserValidator {
    constructor(){
        super();
    }
    studentRegisterValidator(userInfo) {

        const schema = Joi.object().keys({
            ...this.schema,
            password: Joi.string()
                .min(8)
                .max(32)
                .required(),
        });
        return Joi.validate(userInfo, schema, { abortEarly: false });
    }

    studentUpdateValidator(userInfo) {

        return Joi.validate(userInfo, this.schema, { abortEarly: false });
    }
}
module.exports = StudentValidator;