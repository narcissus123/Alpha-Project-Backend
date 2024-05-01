const express = require('express');
const auth = require('../routes/auth.route');
const student = require('../routes/studentManagement.route');
const recoverPassword = require('../routes/recoverPassword.route');
const employee = require('../routes/employeemanagement.route');
const term = require('../routes/term.route');
const upload = require('../routes/file-upload.route');
const course = require('../routes/courseManagement.route');
const news = require('../routes/news.route');
const contactUs = require('../routes/contact-us.route');
const comment = require('../routes/comment.route');
const error = require('../middlewares/error.middleware');
const termLike = require('../routes/termLike.route');
const category = require('../routes/category.route');

module.exports = function (app) {
    app.use(
        express.urlencoded({
            extended: true,
        })
    );
    app.use(express.json());
    app.use('/api/auth', auth);
    app.use('/api', recoverPassword);
    app.use('/api/student', student);
    app.use('/api/employee', employee);
    app.use('/api/lesson', course);
    app.use('/api/course', term);
    app.use('/api', contactUs);
    app.use('/api/news', news);
    app.use('/api/comments', comment);
    app.use('/api/upload', upload);
    app.use('/api/course', termLike);
    app.use('/api/category', category);
    //error handler
    app.use(error);
};
