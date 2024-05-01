const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async.middleware');
const AuthController = require('../controllers/auth.controller');
const {
    registerStudent,
    loginStudent,
    registerEmployee,
    loginEmployee
} = new AuthController();
router.post('/register', asyncMiddleware(registerStudent));
router.post('/login', asyncMiddleware(loginStudent));
router.post('/employee/register', asyncMiddleware(registerEmployee));
router.post('/employee/login', asyncMiddleware(loginEmployee));

module.exports = router;
