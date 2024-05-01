const ServiceResult = require('../../../app/api_models/ServiceResult');
jest.mock('../../../app/services/recoverPassword.service.js');
const RecoverPasswordService = require('../../../app/services/recoverPassword.service');
const httpMocks = require('node-mocks-http');
const recoverPasswordService = new RecoverPasswordService();

describe('Controller Password Recovery', () => {
    let serviceResult;
    let RecoverPasswordController;
    let passwrodResetController;
    beforeAll(() => {
        jest.resetAllMocks();
        serviceResult = new ServiceResult({
            success: true,
            httpMethodCode: 200,
            messages: 'messages'
        });

        recoverPasswordService.forgetPassword = jest
            .fn()
            .mockReturnValue(Promise.resolve(serviceResult));

        recoverPasswordService.resetPassword = jest
            .fn()
            .mockReturnValue(Promise.resolve(serviceResult));

        RecoverPasswordController = require('../../../app/controllers/recoverPassword.controller');
        passwrodResetController = new RecoverPasswordController();
    });

    describe('Forget password', () => {
        it('should return validation errors.', async () => {
            const { req, res } = httpMocks.createMocks({});
            await passwrodResetController.forgetMyPassword(req, res);
            const result = res._getData();
            expect(res.statusCode).toBe(400);
            expect(result.success).toBeFalsy();
        });

        it('should return service result.', async () => {
            const { req, res } = httpMocks.createMocks({
                body: {
                    email: 'example@example.com'
                }
            });
            await passwrodResetController.forgetMyPassword(req, res);
            const result = res._getData();
            expect(res.statusCode).toBe(serviceResult.httpMethodCode);
            expect(result.success).toBe(serviceResult.success);
            expect(result.messages).toBe(serviceResult.messages);
        });
    });

    describe('Reset password', () => {
        it('should return service result.', async () => {
            const { req, res } = httpMocks.createMocks({
                body: {
                    password: '123456789',
                    passwordConfirmed: '123456789'
                },
                params: {
                    token:
                        '5c3c5dd7f8248e0cd31f5c3c5dd7f8248e0cd31f5c3c5dd7f8248e0cd31f'
                }
            });
            await passwrodResetController.resetMyPassword(req, res);
            const result = res._getData();
            expect(res.statusCode).toBe(200);
            expect(result.success).toBe(serviceResult.success);
            expect(result.messages).toBe(serviceResult.messages);
        });

        it('should return validation errors.', async () => {
            const { req, res } = httpMocks.createMocks({});
            await passwrodResetController.resetMyPassword(req, res);
            const result = res._getData();
            expect(res.statusCode).toBe(400);
            expect(result.success).toBeFalsy();
        });
    });
});
