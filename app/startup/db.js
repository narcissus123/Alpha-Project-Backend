const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function() {
    const dbConfig = config.get('database');

    mongoose
        .connect(dbConfig, {
            useCreateIndex: true,
            useNewUrlParser: true
        })
        .then(() => winston.info(`Connected to ${dbConfig} ...`))
        .catch((err) => {
            console.log({
                err
            });
        });
};