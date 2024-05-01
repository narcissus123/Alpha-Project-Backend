const router = require('express').Router();
const ContactUsController = require('../controllers/contact-us.controller');
const asyncMiddleware = require('../middlewares/async.middleware');
const { sendMessage } = new ContactUsController();
//Routes
router.post('/contactUs', asyncMiddleware(sendMessage));

module.exports = router;
