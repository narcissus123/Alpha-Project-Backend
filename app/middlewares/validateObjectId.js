const mongoose = require('mongoose');
const ResposeResult = require('../api_models/ResponseResult');

class IdValidator {
    validateObjectId(req, res, next) {
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            next();
        } else {
            const response = new ResposeResult({
                success: false,
                result: 'Error',
                message: 'آیدی نا معتبر، دوباره امتحان کنید',
            });
            const httpMethodCode = 400;
            res.status(httpMethodCode).send(response);
        }
    }
}
module.exports = IdValidator;
