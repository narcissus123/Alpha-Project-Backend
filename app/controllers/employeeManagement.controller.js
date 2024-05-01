const ResponseResult = require('../api_models/ResponseResult');
const ResponseMessage = require('../api_models/ResponseMessage');
const ResponseMessageType = require('../api_models/ResponseMessageType');
const RegisterEmployeeApiModel = require('../api_models/auth/RegisterEmployeeApiModel');
const EmployeeValidator = require('../validators/employee.validator');
const EmployeeService = require('../services/employee.service');

const employeeValidator = new EmployeeValidator();
const employeeService = new EmployeeService();
class EmployeeManagementController {
    //getAllEmployees------------------------------------------------------------------
    async getAllEmployees(req, res) {
        const result = await employeeService.getAllEmployeesService();

        const response = new ResponseResult({
            success: result['success'],
            result: result['result'],
            message: result['message'],
        });

        const httpMethodCode = result.httpMethodCode;

        res.status(httpMethodCode).send(response);
    }

    //getAllEmployeesPageinaton---------------------------------------------------------
    async getAllEmployeesPageination(req, res) {
        console.log('ssssss');
        const query = req.query;
        const pageNumber = parseInt(query.pagenumber);
        const pageSize = parseInt(query.pagesize);

        let response;
        let httpMethodCode;

        if (!pageNumber || !pageSize) {
            response = new ResponseResult({
                success: false,
                result: 'Error',
                message: 'Page number & page size is required',
            });

            httpMethodCode = 400;
        } else {
            const result =
                await employeeService.getAllEmployeesPageinationService(
                    pageNumber,
                    pageSize
                );

            response = new ResponseResult({
                success: result['success'],
                result: result['result'],
                message: result['message'],
            });

            httpMethodCode = result.httpMethodCode;
        }

        res.status(httpMethodCode).send(response);
    }

    async getAllTeachersPageination(req, res) {
        const query = req.query;
        const pageNumber = parseInt(query.pagenumber);
        const pageSize = parseInt(query.pagesize);

        let response;
        let httpMethodCode;

        if (!pageNumber || !pageSize) {
            response = new ResponseResult({
                success: false,
                result: 'Error',
                message: 'Page number & page size is required',
            });

            httpMethodCode = 400;
        } else {
            const result =
                await employeeService.getAllTeacherPageinationService(
                    pageNumber,
                    pageSize
                );

            response = new ResponseResult({
                success: result['success'],
                result: result['result'],
                message: result['message'],
            });

            httpMethodCode = result.httpMethodCode;
        }

        res.status(httpMethodCode).send(response);
    }
    //getEmployeeById-----------------------------------------------------------------
    async getEmployeeById(req, res) {
        const id = req.params.id;
        const result = await employeeService.getEmployeeByIdService(id);

        const response = new ResponseResult({
            success: result['success'],
            result: result['result'],
            message: result['message'],
        });

        const httpMethodCode = result.httpMethodCode;

        res.status(httpMethodCode).send(response);
    }

    //updateEmployeeById--------------------------------------------------------------
    async updateEmployeeById(req, res) {
        const id = req.params.id;
        const { error, value } = employeeValidator.updateEmployeeValidator(
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
            const model = new RegisterEmployeeApiModel({ ...value });

            const result = await employeeService.updateEmployeeByIdService(
                id,
                model
            );
            response = new ResponseResult({
                success: result['success'],
                result: result['result'],
                message: result['message'],
            });

            httpMethodCode = result.httpMethodCode;
        }
        res.status(httpMethodCode).send(response);
    }

    //deactiveEmployeeById------------------------------------------------------------
    async deactiveEmployeeById(req, res) {
        const id = req.params.id;
        const result = await employeeService.deactiveEmployeeByIdService(id);

        const response = new ResponseResult({
            success: result['success'],
            result: result['result'],
            message: result['message'],
        });

        const httpMethodCode = result.httpMethodCode;

        res.status(httpMethodCode).send(response);
    }

    //activeEmployeeById--------------------------------------------------------------
    async activeEmployeeById(req, res) {
        const id = req.params.id;
        const result = await employeeService.activeEmployeeByIdService(id);

        const response = new ResponseResult({
            success: result['success'],
            result: result['result'],
            message: result['message'],
        });

        const httpMethodCode = result.httpMethodCode;

        res.status(httpMethodCode).send(response);
    }

    //deleteEmployeeById--------------------------------------------------------------
    async deleteEmployeeById(req, res) {
        const id = req.params.id;
        const result = await employeeService.deleteEmployeeByIdService(id);
        let response;
        let httpMethodCode;
        response = new ResponseResult({
            success: result['success'],
            result: result['result'],
            message: result['message'],
        });

        httpMethodCode = result.httpMethodCode;

        res.status(httpMethodCode).send(response);
    }

    //findAllTeachers-----------------------------------------------------------------
    async findAllTeachers(req, res) {
        const result = await employeeService.findAllTeachers();

        const response = new ResponseResult({
            success: result['success'],
            result: result['result'],
            message: result['message'],
        });

        const httpMethodCode = result.httpMethodCode;

        res.status(httpMethodCode).send(response);
    }

    async findLastTeachers(req, res) {
        const result = await employeeService.findLastTeachers();

        const response = new ResponseResult({
            success: result['success'],
            result: result['result'],
            message: result['message'],
        });

        const httpMethodCode = result.httpMethodCode;

        res.status(httpMethodCode).send(response);
    }
}
module.exports = EmployeeManagementController;
