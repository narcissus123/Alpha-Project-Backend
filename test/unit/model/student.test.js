const Student = require('../../../app/database/models/Student');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
jest.mock('config');
const crypto = require('crypto');
const config = require('config');

//Test Suit---------------------------------------------------------
describe('Studet model methods', () => {
    it('Generate student auth token - Should return a valid jwt', () => {
        const payload = {
            _id: mongoose.Types.ObjectId().toHexString(),
            role: 'student'
        };
        config.get = jest.fn().mockReturnValue('jwtPrivateKey');
        const student = new Student(payload);
        const token = student.generateAuthToken();
        const decoded = jwt.verify(token, config.get());
        expect(decoded).toMatchObject(payload);
    });

    it('Generate reset password token Expire - should return bigger date', () => {
        const student = new Student();
        student.setResetPasswordExpires();
        const time = student.resetPasswordExpires;
        const date = Date.now();

        // const now = date.getHours();
        expect(time > date).toBeTruthy();
        expect(time > date + 3600000).toBeFalsy();
    });

    it('Generate reset password token - should return valid token', () => {
        const student = new Student();
        const resetPasswordToken = student.setResetPasswordToken();
        expect(resetPasswordToken).toHaveLength(60);
    });

    it('Validate Password - should be true', () => {
        function hashPassword(password) {
            const salt = crypto.randomBytes(16).toString('hex');
            const passwordhash = crypto
                .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
                .toString('hex');
            return { salt, passwordhash };
        }

        const password = '1234567';
        const result = hashPassword(password);
        const student = new Student({
            salt: result.salt,
            password: result.passwordhash
        });
        const isValid = student.validatePassword(password);
        expect(isValid).toBeTruthy();
    });
});
