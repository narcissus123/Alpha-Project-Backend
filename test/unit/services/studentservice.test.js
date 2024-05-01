const Student = require('../../../app/database/models/Student');
const StudentService = require('../../../app/services/student.service');
const studentService = new StudentService();
jest.mock('../../../app/database/models/Student.js');

describe('Create student', () => {
    const studentInfo = {
        fullName: 'John Doe',
        email: 'example@example.com',
        password: '12345678',
        phoneNumber: '09222222222',
        birthDate: '1357/01/26'
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should return welcome message when student created successfully', async () => {
        Student.findOne = jest.fn().mockReturnValueOnce(null);
        Student.hashPassword = jest.fn().mockReturnValueOnce('hashedpass');

        const result = await studentService.createStudent(studentInfo);

        expect(result.success).toBeTruthy();
        expect(result.httpMethodCode).toBe(200);
        expect(result.message[0].message).toMatch(/Welcome/);
    });

    it('should return Email Already Exist when email is exist', async () => {
        Student.findOne = jest.fn().mockReturnValueOnce(true);

        const result = await studentService.createStudent(studentInfo);

        expect(result.success).toBeFalsy();
        expect(result.httpMethodCode).toBe(401);
        expect(result.message[0].message).toBe('Email Already Exist');
    });
});
