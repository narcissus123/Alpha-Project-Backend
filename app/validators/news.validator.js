const Joi = require('@hapi/joi');

class NewsValidator {

    constructor() {
        this.schema = {
            title: Joi.string()
                .min(5)
                .max(300)
                .required(),
            category: Joi.string()
                .required(),
            image: Joi.string()
                .required(),
            text: Joi.string()
                .required(),
        };
    }
    newsValidator(newsData) {

        return Joi.validate(newsData, this.schema, { abortEarly: false });
    }
}

module.exports = NewsValidator;