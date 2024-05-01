const router = require('express').Router();
const RecoverPasswordController = require('../controllers/recoverPassword.controller');
const asyncMiddleware = require('../middlewares/async.middleware');
const {
    forgetMyPassword,
    resetMyPassword
} = new RecoverPasswordController();
//Routes
router.post('/forgetPassword', asyncMiddleware(forgetMyPassword));
router.post('/resetPassword/:token', asyncMiddleware(resetMyPassword));

module.exports = router;
