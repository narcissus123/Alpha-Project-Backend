const Student = require('../../../app/database/models/Student');
const AuthService = require('../../../app/services/auth.service');
const ServiceResult = require('../../../app/api_models/ServiceResult');
const ResponseMessage = require('../../../app/api_models/ResponseMessage');
const ResponseMessageType = require('../../../app/api_models/ResponseMessageType');
const StudentService = require('../../../app/services/student.service');

const authService=new AuthService();
const studentService=new StudentService();

jest.mock('../../../app/database/models/Student.js');

//Auth Service Test------------------------------------------------
describe('Auth Service: ', () => {
    describe('Login', () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });
        const students = [
            {
                id: '1',
                fullName: 'John Doe',
                email: 'example@example.com',
                password: '12345678',
                phoneNumber: '09111111111',
                birthDate: '1300/01/01',
                isActive: true,
                role: 'student'
            },
            {
                id: '2',
                fullName: 'John Doe2',
                email: 'example2@example.com',
                password: '12345678',
                phoneNumber: '09111111111',
                birthDate: '1300/01/01',
                isActive: false,
                role: 'student'
            }
        ];

        const loginCredential = {
            email: 'email1',
            password: 'password1'
        };

        it('should return token & student data', async () => {
            Student.findOne = jest.fn().mockReturnValueOnce(students[0]);

            students[0].validatePassword = jest.fn().mockReturnValueOnce(true);
            students[0].generateAuthToken = jest
                .fn()
                .mockReturnValueOnce('studentToken');
            students[0].save = jest.fn().mockReturnValue(Promise.resolve({}));

            const result = await authService.studentLoginWithEmail(
                loginCredential
            );

            expect(result.success).toBeTruthy();
            expect(result.httpMethodCode).toBe(200);
            expect(result.message[0].message).toMatch(/Welcome/);
            expect(result.result).toHaveProperty('token', 'studentToken');
        });

        it('should return invalid username or password when password is wrong', async () => {
            Student.findOne = jest.fn().mockReturnValueOnce(students[0]);
            students[0].validatePassword = jest.fn().mockReturnValueOnce(false);

            const result = await authService.studentLoginWithEmail(
                loginCredential
            );

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(403);
            expect(result.message[0].message).toBe('Invalid Email or Password');
        });

        it('should return Access Denied for disabled student', async () => {
            Student.findOne = jest.fn().mockReturnValueOnce(students[1]);
            students[1].validatePassword = jest.fn().mockReturnValueOnce(true);

            const result = await authService.studentLoginWithEmail(
                loginCredential
            );

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(403);
            expect(result.message[0].message).toBe('Access Denied');
        });

        it('should return invalid username or password when email doesnt exist', async () => {
            Student.findOne = jest.fn().mockReturnValueOnce(null);

            const result = await authService.studentLoginWithEmail(
                loginCredential
            );

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(400);
            expect(result.message[0].message).toBe('Invalid Email or Password');
        });
    });

    describe('Register student', () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });

        const serviceResult = new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: 'Student Data',
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.info,
                    message: 'Email Already Exist'
                })
            ]
        });

        const serviceResult2 = new ServiceResult({
            success: false,
            httpMethodCode: 400,
            result: 'Error',
            message: [
                new ResponseMessage({
                    eventId: 400,
                    type: ResponseMessageType.error,
                    message: 'Email Already Exist'
                })
            ]
        });

        it('should return true service result', async () => {
            studentService.createStudent = jest
                .fn()
                .mockReturnValue(Promise.resolve(serviceResult));
            const result = await authService.registerStudentService('student');

            expect(result.success).toBeTruthy();
            expect(result.httpMethodCode).toBe(200);
        });

        it('should return false service result', async () => {
            jest.resetAllMocks();
            studentService.createStudent = jest
                .fn()
                .mockReturnValue(
                    Promise.resolve(new ServiceResult(serviceResult2))
                );
            const result = await authService.registerStudentService('student');

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(400);
        });
    });
});
