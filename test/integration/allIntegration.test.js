const request = require('supertest');
const Student = require('../../app/database/models/Student');

let server;

describe('Integration Tests', () => {
    //
    //SetUp---------------------------------------
    beforeEach(() => {
        jest.resetAllMocks();
        server = require('../../app/server');
    });
    afterEach(async () => {
        await server.close();
        await Student.deleteMany({});
    });

    //Define Variables----------------------------
    const validStudent = {
        fullName: 'John Doe',
        email: 'example@example.com',
        password: '12345678',
        phoneNumber: '09222222222',
        birthDate: '1357/01/26'
    };
    const invalidStudent = {
        fullName: 'John Doe',
        email: 'example@@example.com',
        password: '12345678',
        phoneNumber: '09222222222',
        birthDate: '1357/01/26'
    };
    const validLogin = {
        email: 'example@example.com',
        password: '12345678'
    };
    const invalidLogin = {
        email: 'invalid@@email.com',
        password: '2023'
    };
    const invalidEmailFormat = { email: 'example.com' };
    const validEmailFormat = {
        email: 'example@example.com'
    };
    const invalidToken = 'invalid-token';
    const invalidPassword = { password: '1234' };
    let validToken = new Student().setResetPasswordToken();
    const validPassword = { password: '123456789' };

    //Define Functions----------------------------
    const loginStudent = async function(login) {
        return await request(server)
            .post('/api/auth/login')
            .send(login);
    };
    const registerStudent = async function(student) {
        return await request(server)
            .post('/api/auth/register')
            .send(student);
    };
    const forgetPassword = async function(email) {
        return await request(server)
            .post('/api/forgetPassword')
            .send(email);
    };
    const resetPassword = async function(token, newPassword) {
        return await request(server)
            .post('/api/resetPassword/' + token)
            .send(newPassword);
    };

    //AUTH INTEGRATION TESTS====================================================================
    describe('Auth', () => {
        //
        //register---------------------------------------------------
        describe('Register', () => {
            it('should return res=400 validation error', async () => {
                const res = await registerStudent(invalidStudent);
                expect(res.status).toBe(400);
            });

            it('should return res=200 ok response - save with success', async () => {
                const res = await registerStudent(validStudent);
                const result = res.body.result;
                expect(res.status).toBe(200);
                expect(result.fullName).toBe('John Doe');
                expect(result.email).toBe('example@example.com');
                expect(result.phoneNumber).toBe('09222222222');
                expect(result.birthDate).toBe('1357/01/26');

                const message = res.body.message[0][0]['message'];
                expect(message).toMatch(/Welcome/);
            });

            it('should return res=401 if student is exist', async () => {
                await registerStudent(validStudent);

                const res = await registerStudent(validStudent);

                const message = res.body.message[0][0]['message'];
                expect(res.status).toBe(401);
                expect(message).toBe('Email Already Exist');
            });
        });

        //login------------------------------------------------------
        describe('Login', () => {
            it('should return res=400 validation error', async () => {
                const res = await loginStudent(invalidLogin);
                expect(res.status).toBe(400);
            });

            it('should return res=400 Invalid Email or Password', async () => {
                const res = await loginStudent(validLogin);

                const message = res.body.message.message[0]['message'];
                expect(res.status).toBe(400);
                expect(message).toBe('Invalid Email or Password');
            });

            it('should return res=403 Access Denied', async () => {
                await registerStudent(validStudent);
                await Student.findOneAndUpdate(
                    {
                        email: 'example@example.com'
                    },
                    { isActive: false },
                    { useFindAndModify: false }
                );
                const res = await loginStudent(validLogin);
                const message = res.body.message.message[0]['message'];
                expect(res.status).toBe(403);
                expect(message).toBe('Access Denied');
            });

            it('should return res=403 Invalid Email or Password', async () => {
                await registerStudent(validStudent);
                const invalidPassword = {
                    email: 'example@example.com',
                    password: 'invalidpassword'
                };
                const res = await loginStudent(invalidPassword);
                const message = res.body.message.message[0]['message'];
                expect(res.status).toBe(403);
                expect(message).toBe('Invalid Email or Password');
            });

            it('should return res=200 welcome message generate token', async () => {
                await registerStudent(validStudent);
                const res = await loginStudent(validLogin);
                const token = res.header['x-student-token'];
                const message = res.body.message[0][0]['message'];
                expect(token).not.toBe(null);
                expect(res.status).toBe(200);
                expect(message).toMatch(/Welcome/);
            });

            it('should return res=500 throw Async Error', async () => {
                const authService = require('../../app/services/auth.service');
                authService.studentLoginWithEmail = jest
                    .fn()
                    .mockRejectedValue(
                        new Error('throw Error for LOGIN ERROR HANDLING ...')
                    );

                await registerStudent(validStudent);

                const res = await loginStudent(validLogin);
                const message = res.text;
                expect(res.status).toBe(500);
                expect(message).toMatch('something failed . . .');
            });
        });
    });

    //PASSWORD RECOVERY INTEGRATION TESTS=======================================================
    describe('Password recovery', () => {
        //
        //forget password--------------------------------------------
        describe('Forget password', () => {
            it('should return res=400 validation error', async () => {
                const res = await forgetPassword(invalidEmailFormat);
                expect(res.status).toBe(400);
            });

            it('should return res=501 Student with given email does not exist', async () => {
                const res = await forgetPassword(validEmailFormat);
                const message = res.body.message[0][0]['message'];
                expect(res.status).toBe(501);
                expect(message).toBe('Student with given email does not exist');
            });

            it('should return res=405 Reset password link already sent to your email address', async () => {
                await registerStudent(validStudent);
                await Student.findOneAndUpdate(
                    {
                        email: 'example@example.com'
                    },
                    { resetPasswordExpires: Date.now() + 3600000 },
                    { useFindAndModify: false }
                );
                const res = await forgetPassword(validEmailFormat);
                const message = res.body.message[0][0]['message'];
                expect(res.status).toBe(405);
                expect(message).toBe(
                    'Reset password link already sent to your email address'
                );
            });

            it('should return res=200 Reset password link sent to your email address', async () => {
                await registerStudent(validStudent);
                const res = await forgetPassword(validEmailFormat);
                const message = res.body.message[0][0]['message'];
                expect(res.status).toBe(200);
                expect(message).toBe(
                    'Reset password link sent to your email address'
                );
            });
        });

        //reset password---------------------------------------------
        describe('Reset password', () => {
            it('should return res=400 Token validation error', async () => {
                const res = await resetPassword(invalidToken, validPassword);
                expect(res.status).toBe(400);
            });

            it('should return res=400 Password validation error', async () => {
                const res = await resetPassword(validToken, invalidPassword);
                expect(res.status).toBe(400);
            });

            it('should return res=501 Invalid Token for expired token', async () => {
                const res = await resetPassword(validToken, validPassword);
                const message = res.body.message[0][0]['message'];
                expect(res.status).toBe(501);
                expect(message).toBe('Invalid Token');
            });

            it('should return res=200 New password set successfully', async () => {
                await registerStudent(validStudent);
                validToken = new Student().setResetPasswordToken();
                await Student.findOneAndUpdate(
                    {
                        email: 'example@example.com'
                    },
                    {
                        resetPasswordToken: validToken,
                        resetPasswordExpires: Date.now() + 3600000
                    },
                    { useFindAndModify: false }
                );
                const res = await resetPassword(validToken, validPassword);
                const message = res.body.message[0][0]['message'];
                expect(res.status).toBe(200);
                expect(message).toBe('New password set successfully');
            });
        });
    });
});
