const AuthController = require('../../../app/controllers/auth.controller');
const ServiceResult = require('../../../app/api_models/ServiceResult');
const AuthService = require('../../../app/services/auth.service');
const httpMocks = require('node-mocks-http');
const { registerStudent, loginStudent } = new AuthController();
const authService=new AuthService();

describe('Auth controller:', () => {

    const serviceResult = new ServiceResult({
        success: true,
        httpMethodCode: 200,
        messages: 'messages',
        result: { result: { result: { password: '' } } }
    });

    const serviceResult2 = new ServiceResult({
        success: true,
        httpMethodCode: 200,
        messages: 'messages',
        result: { result: { token: 'test' } }
    });

    beforeEach(() => {
        jest.resetAllMocks();
        authService.registerStudentService = jest
            .fn()
            .mockReturnValue(Promise.resolve(serviceResult));

        authService.studentLoginWithEmail = jest
            .fn()
            .mockReturnValue(Promise.resolve(serviceResult2));
    });

    describe('Register Method -', () => {
        const invalidStudent = {
            fullName: 'John Doe',
            email: 'exampleexample.com',
            password: '12345678',
            phoneNumber: '09111111111',
            birthDate: '1357/01/26'
        };

        const validStudent = {
            fullName: 'John Doe',
            email: 'example@example.com',
            password: '12345678',
            phoneNumber: '09111111111',
            birthDate: '1357/01/26'
        };

        it(' should return validation error.', () => {
            const { req, res } = httpMocks.createMocks({
                body: invalidStudent
            });
            registerStudent(req, res);
            const result = res._getData();
            expect(res.statusCode).toBe(400);
            expect(result.success).toBeFalsy();
        });

        it(' should return result.', async () => {
            const { req, res } = httpMocks.createMocks({ body: validStudent });
            await registerStudent(req, res);
            const result = res._getData();

            expect(res.statusCode).toBe(serviceResult.httpMethodCode);
            expect(result.success).toBe(serviceResult.success);
            expect(result.messages).toBe(serviceResult.messages);
        });
    });

    describe('Login Method - ', () => {
        const invalidlogininfo = {
            email: 'exampleexample',
            password: '123456'
        };

        const validlogininfo = {
            email: 'example@example.com',
            password: '123456789'
        };

        it('should return result.', async () => {
            const { req, res } = httpMocks.createMocks({
                body: validlogininfo
            });

            await loginStudent(req, res);
            const result = res._getData();

            expect(res.statusCode).toBe(serviceResult.httpMethodCode);
            expect(result.success).toBe(serviceResult.success);
            expect(result.messages).toBe(serviceResult.messages);
        });

        it('should return validation error', () => {
            const { req, res } = httpMocks.createMocks({
                body: invalidlogininfo
            });
            loginStudent(req, res);
            const result = res._getData();
            expect(res.statusCode).toBe(400);
            expect(result.success).toBeFalsy();
        });
    });
});
