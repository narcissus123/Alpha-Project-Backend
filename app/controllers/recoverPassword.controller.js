const ResponseMessage = require('../api_models/ResponseMessage');
const ResponseMessageType = require('../api_models/ResponseMessageType');
const ResponseResult = require('../api_models/ResponseResult');
const RecoverPasswordValidator = require('../validators/recover-password.validator');
const RecoverPasswordService = require('../services/recoverPassword.service');
const {
    ResetPasswordModel,
    ForgetPasswordModel
} = require('../api_models/RecoverPassword');
const recoverPasswordValidator = new RecoverPasswordValidator();
const recoverPasswordService = new RecoverPasswordService();
class RecoverPasswordController {

    // forget password-------------------------------------------------------
    async forgetMyPassword(req, res) {
        const model = new ForgetPasswordModel(req.body);

        //validate request body (JOI)
        const {
            error,
            value
        } = recoverPasswordValidator.forgetPasswordValidators(model);

        let response;
        let httpMethodCode;

        if (error) {
            const errors = [];
            error.details.forEach(err => {
                errors.push(
                    new ResponseMessage({
                        eventId: 400,
                        messageId: 1,
                        type: ResponseMessageType.error,
                        message: err.message
                    })
                );
            });
            response = new ResponseResult({
                success: false,
                message: errors
            });
            httpMethodCode = 400;
        } else {
            //send data to resetPassword service
            const result = await recoverPasswordService.forgetPassword(value);

            response = new ResponseResult({
                success: result['success'],
                result: result['result'],
                message: result['message']
            });
            httpMethodCode = result.httpMethodCode;
        }
        res.status(httpMethodCode).send(response);
    }

    //reset password---------------------------------------------------------
    async resetMyPassword(req, res) {
        const {
            token
        } = req.params;
        const model = new ResetPasswordModel(token, req.body);

        //validate request body(JOI)
        const {
            error,
            value
        } = recoverPasswordValidator.resetPasswordValidators(model);

        let response;
        let httpMethodCode;

        if (error) {
            const errors = [];
            error.details.forEach(err => {
                errors.push(
                    new ResponseMessage({
                        eventId: 400,
                        messageId: 1,
                        type: ResponseMessageType.error,
                        message: err.message
                    })
                );
            });
            response = new ResponseResult({
                success: false,
                message: errors
            });
            httpMethodCode = 400;
        } else {
            //send data to resetPassword service
            const result = await recoverPasswordService.resetPassword(value);
            response = new ResponseResult({
                success: result['success'],
                result: result['result'],
                message: result['message']
            });
            httpMethodCode = result.httpMethodCode;
        }
        res.status(httpMethodCode).send(response);
    }
}
module.exports = RecoverPasswordController;