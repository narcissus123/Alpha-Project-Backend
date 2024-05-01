const Joi = require('@hapi/joi');
class LoginValidator {

    validateUserLogin(user) {
        const schema = {
            email: Joi.string()
                .email()
                .min(5)
                .max(255)
                .required(),
            password: Joi.string()
                .required()
                .min(5)
                .max(32)
        };
        return Joi.validate(user, schema, { abortEarly: false });
    };
}
module.exports = LoginValidator;