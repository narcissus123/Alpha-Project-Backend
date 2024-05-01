const Student = require('../../../app/database/models/Student');
const PasswordRecoveryService = require('../../../app/services/recoverPassword.service');
const passwordRecoveryService = new PasswordRecoveryService();
describe('Recover Password', () => {
    describe('Forget Password', () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });

        const student = {
            resetPasswordExpires: Date.now() - 3600000,
            email: 'example@example.com'
        };
        const student2 = {
            resetPasswordExpires: Date.now() + 3600000,
            email: 'example@example.com'
        };

        it('should return Student with given email does not exist', async () => {
            Student.findOne = jest.fn().mockReturnValue(Promise.resolve(null));

            const result = await passwordRecoveryService.forgetPassword('arg');

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(501);
            expect(result.message[0].message).toBe(
                'Student with given email does not exist'
            );
        });

        it('Should return Reset password link sent to your email address', async () => {
            Student.findOne = jest
                .fn()
                .mockReturnValue(Promise.resolve(student));
            student.setResetPasswordToken = jest
                .fn()
                .mockReturnValueOnce('resetPasswordToken');
            student.setResetPasswordExpires = jest
                .fn()
                .mockReturnValueOnce('setResetPassExpire');
            student.save = jest.fn().mockReturnValue(Promise.resolve({}));

            const result = await passwordRecoveryService.forgetPassword('');

            expect(result.success).toBeTruthy();
            expect(result.httpMethodCode).toBe(200);
            expect(result.message[0].message).toBe(
                'Reset password link sent to your email address'
            );
        });

        it('should return Reset password link already sent to your email address', async () => {
            Student.findOne = jest
                .fn()
                .mockReturnValue(Promise.resolve(student2));

            const result = await passwordRecoveryService.forgetPassword('');

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(405);
            expect(result.message[0].message).toBe(
                'Reset password link already sent to your email address'
            );
        });
    });

    describe('Reset Password', () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });

        const student = {
            email: 'example@example.com'
        };

        it('should return New password set successfully', async () => {
            Student.findOne = jest
                .fn()
                .mockReturnValue(Promise.resolve(student));
            student.hashPassword = jest
                .fn()
                .mockReturnValueOnce('hashedPassword');
            student.save = jest.fn().mockReturnValue(Promise.resolve({}));

            const result = await passwordRecoveryService.resetPassword('');

            expect(result.success).toBeTruthy();
            expect(result.httpMethodCode).toBe(200);
            expect(result.message[0].message).toBe(
                'New password set successfully'
            );
        });

        it('should return Invalid Token', async () => {
            Student.findOne = jest.fn().mockReturnValue(Promise.resolve(null));

            const result = await passwordRecoveryService.resetPassword('');

            expect(result.success).toBeFalsy();
            expect(result.httpMethodCode).toBe(501);
            expect(result.message[0].message).toBe('Invalid Token');
        });
    });
});
