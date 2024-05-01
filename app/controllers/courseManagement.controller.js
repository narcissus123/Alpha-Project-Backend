const CourseService = require('../services/course.service');
const ResponseResult = require('../api_models/ResponseResult');
const CourseValidatore = require('../validators/course.validator');
const ResponseMessage = require('../api_models/ResponseMessage');
const ResponseMessageType = require('../api_models/ResponseMessageType');
const AddCourseApiModel = require('../api_models/course/AddCourseApiModel');
const courseService = new CourseService();
const courseValidatore = new CourseValidatore();

class CourseManagementController {
    //AddCourse----------------------------------------------------------
    async addCourse(req, res) {
        //validate request body (JOI)
        const { error, value } = courseValidatore.addCourseValidator(req.body);
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
            const model = new AddCourseApiModel({ ...value });

            // Send data to auth service
            const result = await courseService.addCourse(model);
            response = new ResponseResult({
                success: result['success'],
                result: result['result'],
                message: result['message'],
            });

            httpMethodCode = result.httpMethodCode;
        }
        res.status(httpMethodCode).send(response);
    }
    //getAllCourse------------------------------------------------------------
    async getAllCourse(req, res) {
        const result = await courseService.getAllCourse();
        // console.log(result);
        console.log(req);
        const response = new ResponseResult({
            success: result['success'],
            result: result['result'],
            message: result['message'],
        });

        const httpMethodCode = result.httpMethodCode;

        res.status(httpMethodCode).send(response);
    }

    //getAllCoursePagination--------------------------------------------------
    async getAllCoursePagination(req, res) {
        const query = req.query;
        const pagenumber = parseInt(query.pagenumber);
        const pagesize = parseInt(query.pagesize);

        let response;
        let httpMethodCode;
        if (!pagenumber || !pagesize) {
            response = new ResponseResult({
                success: false,
                result: 'Error',
                message: 'Page number & page size is required',
            });

            httpMethodCode = 400;
        } else {
            const result = await courseService.getAllCoursePagination(
                pagenumber,
                pagesize
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

    //getCourseById--------------------------------------------------------------
    async getCourseById(req, res) {
        const id = req.params.id;
        const result = await courseService.getCourseById(id);

        const response = new ResponseResult({
            success: result['success'],
            result: result['result'],
            message: result['message'],
        });

        const httpMethodCode = result.httpMethodCode;

        res.status(httpMethodCode).send(response);
    }
    //get Term of Course --------------------------------------------------------------
    async getTermsOfCourse(req, res) {
        const id = req.params.id;
        const result = await courseService.getTermsOfCourse(id);

        const response = new ResponseResult({
            success: result['success'],
            result: result['result'],
            message: result['message'],
        });

        const httpMethodCode = result.httpMethodCode;
        res.status(httpMethodCode).send(response);
    }
    //updateCourseById-----------------------------------------------------------
    async updateCourseById(req, res) {
        const id = req.params.id;

        const { error, value } = courseValidatore.addCourseValidator(req.body);
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
            const model = new AddCourseApiModel({ ...value });
            const result = await courseService.updateCourseById(id, model);
            response = new ResponseResult({
                success: result['success'],
                result: result['result'],
                message: result['message'],
            });

            httpMethodCode = result.httpMethodCode;
        }

        res.status(httpMethodCode).send(response);
    }

    //deleteCourseById-----------------------------------------------------------
    async deleteCourseById(req, res) {
        const id = req.params.id;
        const result = await courseService.deleteCourseById(id);
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
}
module.exports = CourseManagementController;
