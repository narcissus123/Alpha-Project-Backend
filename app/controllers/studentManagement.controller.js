const StudentService = require('../services/student.service');
const ResponseResult = require('../api_models/ResponseResult');
const StudentValidator = require('../validators/student.validator');
const ResponseMessage = require('../api_models/ResponseMessage');
const ResponseMessageType = require('../api_models/ResponseMessageType');
const RegisterStudentApiModel = require('../api_models/auth/RegisterStudentApiModel');

const studentService = new StudentService();
const studentValidator = new StudentValidator();

class StudentManagementController {

    //getAllStudents------------------------------------------------------------
    async getAllStudents(req, res) {
        const result = await studentService.getAllStudentsService();

        const response = new ResponseResult({
            success: result['success'],
            result: result['result'],
            message: result['message']
        });

        const httpMethodCode = result.httpMethodCode;

        res.status(httpMethodCode).send(response);
    }

    //getAllStudentsPagination--------------------------------------------------
    async getAllStudentsPagination(req, res) {
        const query = req.query;
        const pagenumber = parseInt(query.pagenumber);
        const pagesize = parseInt(query.pagesize);

        let response;
        let httpMethodCode;
        if (!pagenumber || !pagesize) {
            response = new ResponseResult({
                success: false,
                result: 'Error',
                message: 'Page number & page size is required'
            });

            httpMethodCode = 400;
        } else {
            const result = await studentService.getAllStudentsPaginationService(
                pagenumber,
                pagesize
            );

            response = new ResponseResult({
                success: result['success'],
                result: result['result'],
                message: result['message']
            });

            httpMethodCode = result.httpMethodCode;
        }

        res.status(httpMethodCode).send(response);
    }

    //getStudentById--------------------------------------------------------------
    async getStudentById(req, res) {
        const id = req.params.id;
        const result = await studentService.getStudentByIdService(id);

        const response = new ResponseResult({
            success: result['success'],
            result: result['result'],
            message: result['message']
        });

        const httpMethodCode = result.httpMethodCode;

        res.status(httpMethodCode).send(response);
    }

    //updateStudentById-----------------------------------------------------------
    async updateStudentById(req, res) {
        const id = req.params.id;
        const { error, value } = studentValidator.studentUpdateValidator(req.body);
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

            response = new ResponseResult({ success: false, message: errors });
            httpMethodCode = 400;
        } else {
            const model = new RegisterStudentApiModel({ ...value });

            const result = await studentService.updateStudentByIdService(id, model);

            response = new ResponseResult({
                success: result['success'],
                result: result['result'],
                message: result['message']
            });

            httpMethodCode = result.httpMethodCode;
        }

        res.status(httpMethodCode).send(response);
    }

    //deleteStudentById-----------------------------------------------------------
    async deleteStudentById(req, res) {
        const id = req.params.id;
        const result = await studentService.deleteStudentByIdService(id);
        let response;
        let httpMethodCode;
        response = new ResponseResult({
            success: result['success'],
            result: result['result'],
            message: result['message']
        });

        httpMethodCode = result.httpMethodCode;

        res.status(httpMethodCode).send(response);
    }

    //deactiveStudentById---------------------------------------------------------
    async deactiveStudentById(req, res) {
        const id = req.params.id;
        const result = await studentService.deactiveStudentByIdService(id);
        let response;
        let httpMethodCode;
        response = new ResponseResult({
            success: result['success'],
            result: result['result'],
            message: result['message']
        });

        httpMethodCode = result.httpMethodCode;

        res.status(httpMethodCode).send(response);
    }

    //activeStudentById-----------------------------------------------------------
    async activeStudentById(req, res) {
        const id = req.params.id;
        const result = await studentService.activeStudentByIdService(id);
        let response;
        let httpMethodCode;
        response = new ResponseResult({
            success: result['success'],
            result: result['result'],
            message: result['message']
        });

        httpMethodCode = result.httpMethodCode;

        res.status(httpMethodCode).send(response);
    }
}
module.exports = StudentManagementController;
