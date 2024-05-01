const Student = require('../database/models/Student');
const Employee = require('../database/models/Employee');
const ServiceResult = require('../api_models/ServiceResult');
const ResponseMessage = require('../api_models/ResponseMessage');
const ResponseMessageType = require('../api_models/ResponseMessageType');
const StudentService = require('../services/student.service');
const EmployeeService = require('../services/employee.service');
const StudentApiModel = require('../api_models/user/StudentApiModel');
const EmployeeApiModel = require('../api_models/user/EmployeeApiModel');
const studentService = new StudentService();
const employeeService = new EmployeeService();

class AuthService {
    //registerStudentService---------------------------------------------------------
    async registerStudentService(student) {
        const result = await studentService.createStudent(student);

        if (!result.success) return new ServiceResult(result);

        return result;
    }

    //registerEmployeeService---------------------------------------------------------
    async registerEmployeeService(employee) {
        const result = await employeeService.createEmployee(employee);

        if (!result.success) return new ServiceResult(result);

        return result;
    }

    //studentLoginWithEmail----------------------------------------------------------
    async studentLoginWithEmail({ email, password }) {
        //get student by email
        const student = await Student.findOne({ email });

        // check if student with given Email exist
        if (!student) {
            return new ServiceResult({
                success: false,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 400,
                        type: ResponseMessageType.error,
                        message: 'ایمیل یا رمزعبور نادرست است!'
                    })
                ],
                httpMethodCode: 400
            });
        }

        //check student is activated or not
        if (!student.isActive) {
            return new ServiceResult({
                success: false,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 403,
                        type: ResponseMessageType.error,
                        message: 'دسترسی شما مسدود است!'
                    })
                ],
                httpMethodCode: 403
            });
        }

        const validPassword = await student.validatePassword(password);

        // check password validation
        if (!validPassword) {
            return new ServiceResult({
                success: false,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 403,
                        type: ResponseMessageType.error,
                        message: 'ایمیل یا رمزعبور نادرست است!'
                    })
                ],
                httpMethodCode: 403
            });
        }

        //generate Auth token in student model
        const jwtToken = await student.generateAuthToken();
        const studentModel = new StudentApiModel(student);

        const data = {
            studentModel,
            jwtToken
        };
        return new ServiceResult({
            success: true,
            result: data,
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.success,
                    message: `خوش آمدید ${student.fullName}`
                })
            ],
            httpMethodCode: 200
        });
    }

    //employeeLoginWithEmail----------------------------------------------------------
    async employeeLoginWithEmail({ email, password }) {
        //get student by email
        const employee = await Employee.findOne({ email });

        // check if student with given Email exist
        if (!employee) {
            return new ServiceResult({
                success: false,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 400,
                        type: ResponseMessageType.error,
                        message: 'ایمیل یا رمزعبور اشتباه است!'
                    })
                ],
                httpMethodCode: 400
            });
        }

        //check student is activated or not
        if (!employee.isActive) {
            return new ServiceResult({
                success: false,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 403,
                        type: ResponseMessageType.error,
                        message: 'دسترسی شما مسدود است!'
                    })
                ],
                httpMethodCode: 403
            });
        }

        const validPassword = await employee.validatePassword(password);

        // check password validation
        if (!validPassword) {
            return new ServiceResult({
                success: false,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 403,
                        type: ResponseMessageType.error,
                        message: 'ایمیل یا رمزعبور اشتباه است!'
                    })
                ],
                httpMethodCode: 403
            });
        }

        //generate Auth token in student model
        const jwtToken = await employee.generateAuthToken();
        const employeeModel = new EmployeeApiModel(employee);
        const employeeData = {
            employeeModel,
            jwtToken
        };
        return new ServiceResult({
            success: true,
            result: employeeData,
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.success,
                    message: `خوش آمدید ${employee.fullName}`
                })
            ],
            httpMethodCode: 200
        });
    }
}
module.exports = AuthService;
