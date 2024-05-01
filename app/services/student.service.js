const ServiceResult = require('../api_models/ServiceResult');
const ResponseMessage = require('../api_models/ResponseMessage');
const ResponseMessageType = require('../api_models/ResponseMessageType');
const Student = require('../database/models/Student');

class StudentService {
    //createStudent---------------------------------------------------------
    async createStudent(student) {
        const { email, password, nationalId } = student;
        const result = await Student.findOne({ email });
        const res = await Student.findOne({ nationalId });
        if (!result && !res) {
            let studentData = new Student({
                fullName: student.fullName,
                email: student.email,
                password: password,
                birthDate: student.birthDate,
                phoneNumber: student.phoneNumber,
                nationalId: student.nationalId,
                profile: student.profile ? student.profile : '',
            });

            studentData.hashPassword(password);
            studentData = await studentData.save();

            return new ServiceResult({
                success: true,
                result: studentData,
                message: [
                    new ResponseMessage({
                        eventId: 200,
                        type: ResponseMessageType.info,
                        message: `ثبت نام شما با موفقیت انجام شد ${student.fullName}`,
                    }),
                ],
                httpMethodCode: 200,
            });
        } else {
            const data = new ServiceResult({
                success: false,
                httpMethodCode: 401,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 401,
                        type: ResponseMessageType.error,
                        message: 'ایمیل یا کدملی در سیستم موجود است',
                    }),
                ],
            });

            return data;
        }
    }

    //getAllStudents---------------------------------------------------------
    async getAllStudentsService() {
        const students = await Student.find({ salt: { $ne: '' } });
        if (students.length === 0) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'دانشجویی یافت نشد',
                    }),
                ],
            });
        }

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: students,
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.success,
                    message: 'success get',
                }),
            ],
        });
    }

    //getAllStudentsListForPagination----------------------------------------
    async getAllStudentsPaginationService(pageNumber, pageSize) {
        const students = await Student.find({ salt: { $ne: '' } })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({
                createDate: 1,
            });

        if (students.length === 0) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'دانشجویی یافت نشد',
                    }),
                ],
            });
        }

        const count = await Student.find({ salt: { $ne: '' } });

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: { students, count: count.length },
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.success,
                    message: 'success get',
                }),
            ],
        });
    }

    //getStudentByIdService--------------------------------------------------
    async getStudentByIdService(id) {
        const student = await Student.findById(id);

        if (!student) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'دانشجو یافت نشد',
                    }),
                ],
            });
        }

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: student,
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.success,
                    message: 'success get',
                }),
            ],
        });
    }

    //updateStudentByIdService-----------------------------------------------
    async updateStudentByIdService(id, model) {
        const student = await Student.findById(id);

        if (!student) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'دانشجو یافت نشد',
                    }),
                ],
            });
        }

        student.fullName = model.fullName;
        student.email = model.email;
        student.birthDate = model.birthDate;
        student.phoneNumber = model.phoneNumber;
        student.nationalId = model.nationalId;
        student.profile = model.profile;

        const result = await student.save();

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: result,
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.success,
                    message: 'اطلاعات دانشجو بروزرسانی شد',
                }),
            ],
        });
    }

    //deleteStudentByIdService-----------------------------------------------
    async deleteStudentByIdService(id) {
        const result = await Student.findById(id);

        if (!result) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'دانشجو یافت نشد',
                    }),
                ],
            });
        }

        let currentTime = new Date();
        currentTime = currentTime.getTime();
        const email = result.email;

        const student = await Student.findByIdAndUpdate(id, {
            $set: {
                email: `${email}+${currentTime}`,
                password: '',
                salt: '',
                resetPasswordToken: '',
                resetPasswordExpires: '',
            },
        });

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: student,
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.success,
                    message: 'دانشجو حذف گردید',
                }),
            ],
        });
    }

    //deactiveStudentByIdService---------------------------------------------
    async deactiveStudentByIdService(id) {
        const student = await Student.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!student) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'دانشجو یافت نشد',
                    }),
                ],
            });
        }

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: student,
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.success,
                    message: 'حساب کاربری دانشجو غیرفعال شد',
                }),
            ],
        });
    }

    //activeStudentByIdService-----------------------------------------------
    async activeStudentByIdService(id) {
        const student = await Student.findByIdAndUpdate(
            id,
            { isActive: true },
            { new: true }
        );

        if (!student) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'دانشجو یافت نشد',
                    }),
                ],
            });
        }

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: student,
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.success,
                    message: 'حساب کاربری دانشجو فعال شد',
                }),
            ],
        });
    }
}

module.exports = StudentService;
