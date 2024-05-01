const Joi = require('@hapi/joi');

class RecoverPasswordValidator {

    //forgetPassword------------------------------------------
    forgetPasswordValidators(model) {
        const schema = Joi.object().keys({
            email: Joi.string()
            .min(5)
            .max(255)
            .email()
            .required()
        });
    
        return Joi.validate(model, schema, { abortEarly: false });
    }
    //resetPassword--------------------------------------------
    resetPasswordValidators(model) {
        const schema = Joi.object().keys({
            token: Joi.string()
                .regex(/^[a-fA-F0-9]{60}$/)
                .required(),
            password: Joi.string()
                .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
                .min(8)
                .required()
                .max(32)
        });
    
        return Joi.validate(model, schema, { abortEarly: false });
    }
}

module.exports = RecoverPasswordValidator;
