const StudentValidator = require('../validators/student.validator');
const EmployeeValidator = require('../validators/employee.validator');
const LoginValidator = require('../validators/login.validator');
const ResponseMessage = require('../api_models/ResponseMessage');
const ResponseMessageType = require('../api_models/ResponseMessageType');
const ResponseResult = require('../api_models/ResponseResult');
const RegisterStudentApiModel = require('../api_models/auth/RegisterStudentApiModel');
const RegisterEmployeeApiModel = require('../api_models/auth/RegisterEmployeeApiModel');
const LoginApiModel = require('../api_models/auth/LoginApiModel');
const AuthService = require('../services/auth.service');

const studentValidator = new StudentValidator();
const authService = new AuthService();
const employeeValidatore = new EmployeeValidator();
const loginValidator = new LoginValidator();

class AuthController {
    //registerStudent----------------------------------------------------------
    async registerStudent(req, res) {
        //validate request body (JOI)
        const { error, value } = studentValidator.studentRegisterValidator(
            req.body
        );

        let response;
        let httpMethodCode;

        if (error) {
            const errors = [];
            error.details.forEach((err) => {
                errors.push(
                    new ResponseMessage({
                        eventId: 400,
                        messageId: 1,
                        type: ResponseMessageType.error,
                        message: err.message,
                    })
                );
            });
            response = new ResponseResult({ success: false, message: errors });
            httpMethodCode = 400;
        } else {
            const model = new RegisterStudentApiModel({ ...value });

            // Send data to auth service
            const result = await authService.registerStudentService(model);
            if (result['success']) {
                result.result.password = '';
            }
            response = new ResponseResult({
                success: result['success'],
                result: result['result'],
                message: result['message'],
            });

            httpMethodCode = result.httpMethodCode;
        }
        res.status(httpMethodCode).send(response);
    }

    //loginStudent----------------------------------------------------------
    async loginStudent(req, res) {
        // validate request body (JOI)
        const { error, value } = loginValidator.validateUserLogin(req.body);

        let response;
        let httpMethodCode;
        let token;
        const errors = [];

        if (error) {
            error.details.forEach((err) => {
                errors.push(
                    new ResponseMessage({
                        eventId: 400,
                        messageId: 1,
                        type: ResponseMessageType.error,
                        message: err.message,
                    })
                );
            });
            response = new ResponseResult({ success: false, message: errors });
            httpMethodCode = 400;
        } else {
            const model = new LoginApiModel({
                ...value,
            });

            //send data to auth service
            const result = await authService.studentLoginWithEmail(model);

            if (!result.success) {
                const msg = new ResponseMessage({
                    eventId: 400,
                    messageId: 1,
                    type: ResponseMessageType.error,
                    message: result.message,
                });
                response = new ResponseResult({ success: false, message: msg });
                httpMethodCode = result.message[0].eventId;
            } else {
                response = new ResponseResult({
                    success: result['success'],
                    result: result['result'],
                    message: result['message'],
                });
                token = result.result['token'];
                httpMethodCode = 200;
            }
        }
        return res
            .header('x-auth-token', token)
            .status(httpMethodCode)
            .send(response);
    }

    //registerEmployee----------------------------------------------------------
    async registerEmployee(req, res) {
        //validate request body (JOI)
        const { error, value } = employeeValidatore.registerEmployeeValidator(
            req.body
        );

        let httpMethodCode;
        let response;

        if (error) {
            const errors = [];
            error.details.forEach((err) => {
                errors.push(
                    new ResponseMessage({
                        eventId: 400,
                        messageId: 1,
                        type: ResponseMessageType.error,
                        message: err.message,
                    })
                );
            });
            response = new ResponseResult({
                success: false,
                message: errors,
            });
            httpMethodCode = 400;
        } else {
            const model = new RegisterEmployeeApiModel({ ...value });
            const role = model.role.toLowerCase();
            if (role === 'admin' || role === 'teacher') {
                // Send data to auth service
                const result = await authService.registerEmployeeService(model);
                if (result['success']) {
                    result.result.password = '';
                }
                response = new ResponseResult({
                    success: result['success'],
                    result: result['result'],
                    message: result['message'],
                });
                httpMethodCode = result.httpMethodCode;
            } else {
                response = new ResponseResult({
                    success: false,
                    result: null,
                    message: {
                        message: 'فقط میتوان دو نقش admin و teahcer ایجاد کرد',
                    },
                });
                httpMethodCode = 400;
            }
        }
        res.status(httpMethodCode).send(response);
    }

    //loginEmployee----------------------------------------------------------
    async loginEmployee(req, res) {
        // validate request body (JOI)
        const { error, value } = loginValidator.validateUserLogin(req.body);

        let response;
        let httpMethodCode;
        let token;
        const errors = [];

        if (error) {
            error.details.forEach((err) => {
                errors.push(
                    new ResponseMessage({
                        eventId: 400,
                        messageId: 1,
                        type: ResponseMessageType.error,
                        message: err.message,
                    })
                );
            });
            response = new ResponseResult({ success: false, message: errors });
            httpMethodCode = 400;
        } else {
            const model = new LoginApiModel({
                ...value,
            });

            //send data to auth service
            const result = await authService.employeeLoginWithEmail(model);

            if (!result.success) {
                const msg = new ResponseMessage({
                    eventId: 400,
                    messageId: 1,
                    type: ResponseMessageType.error,
                    message: result.message,
                });
                response = new ResponseResult({ success: false, message: msg });
                httpMethodCode = result.message[0].eventId;
            } else {
                response = new ResponseResult({
                    success: result['success'],
                    result: result['result'],
                    message: result['message'],
                });
                token = result.result['token'];
                httpMethodCode = 200;
            }
        }
        return res
            .header('x-auth-token', token)
            .status(httpMethodCode)
            .send(response);
    }
}

module.exports = AuthController;
