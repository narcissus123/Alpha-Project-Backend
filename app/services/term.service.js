const Term = require('../database/models/Term');
const Student = require('../database/models/Student');
const ServiceResult = require('../api_models/ServiceResult');
const ResponseMessage = require('../api_models/ResponseMessage');
const ResponseMessageType = require('../api_models/ResponseMessageType');
const EmployeeService = require('./employee.service');
const CourseService = require('./course.service');
const StudentApiModel = require('../api_models/user/StudentApiModel');

const employeeService = new EmployeeService();
const courseService = new CourseService();

class TermServices {
    //createTerm------------------------------------------------------------
    async createTermService(term) {
        const result = await employeeService.getEmployeeByIdService(
            term.teacher
        );

        const result2 = await courseService.getCourseById(term.lesson);

        let teacher = result.result;
        let course = result2.result;

        if (result.result.role !== 'teacher') {
            return new ServiceResult({
                success: false,
                result: null,
                message: [
                    new ResponseMessage({
                        eventId: 400,
                        type: ResponseMessageType.error,
                        message: 'لطفا فیلد استاد را درست وارد کنید',
                    }),
                ],
                httpMethodCode: 400,
            });
        }

        if (!result2.success) {
            return new ServiceResult({
                success: false,
                result: null,
                message: [
                    new ResponseMessage({
                        eventId: 400,
                        type: ResponseMessageType.error,
                        message: 'لطفا فیلد درس را درست وارد کنید',
                    }),
                ],
                httpMethodCode: 400,
            });
        }

        let termModel = new Term({
            title: term.title,
            cost: term.cost,
            endDate: term.endDate,
            startDate: term.startDate,
            capacity: term.capacity,
            teacher: teacher,
            lesson: course,
        });

        course.courses.push(termModel);
        await course.save();

        await termModel.save(function (err, data) {
            termModel = data;
        });

        teacher.courses.push(termModel);
        await teacher.save();

        return new ServiceResult({
            success: true,
            result: termModel,
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.info,
                    message: `دوره "${term.title}" با موفقیت ایجاد گردید`,
                }),
            ],
            httpMethodCode: 200,
        });
    }

    //getAllTerms-----------------------------------------------------------
    async getAllTermsService() {
        const terms = await Term.find();
        if (terms.length === 0) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'دوره ای یافت نشد',
                    }),
                ],
            });
        }

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: terms,
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.success,
                    message: 'با موفقیت دریافت گردید',
                }),
            ],
        });
    }

    //get All Term List For Pagination----------------------------------------
    async getAllTermPagination(pageNumber, pageSize) {
        const terms = await Term.find()
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({
                startDate: 1,
            });

        if (terms.length === 0) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'دوره ای یافت نشد',
                    }),
                ],
            });
        }

        const count = await Term.countDocuments();

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: { courses: terms, count },
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.success,
                    message: 'با موفقیت دریافت شد',
                }),
            ],
        });
    }

    //getTermById-----------------------------------------------------------
    async getTermByIdService(id) {
        const term = await Term.findById(id);

        if (!term) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'دوره ای یافت نشد',
                    }),
                ],
            });
        }

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: term,
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.success,
                    message: 'با موفقیت دریافت شد',
                }),
            ],
        });
    }

    //updateTermById--------------------------------------------------------
    async updateTermByIdService(id, model) {
        const term = await Term.findById(id);

        if (!term) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'دوره ای یافت نشد',
                    }),
                ],
            });
        }

        const result = await employeeService.getEmployeeByIdService(
            model.teacher
        );

        const result2 = await courseService.getCourseById(model.lesson);

        let teacher = result.result;
        let course = result2.result;

        term.title = model.title;
        term.cost = model.cost;
        term.endDate = model.endDate;
        term.startDate = model.startDate;
        term.capacity = model.capacity;
        term.teacher = teacher;
        term.lesson = course;

        const res = await term.save();

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: res,
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.success,
                    message: 'دوره با موفقیت بروز شد',
                }),
            ],
        });
    }

    //deleteTermById--------------------------------------------------------
    async deleteTermByIdService(id) {
        const result = await Term.findByIdAndRemove(id);

        if (!result) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'دوره ای یافت نشد',
                    }),
                ],
            });
        }

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: result,
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.success,
                    message: 'با موفقیت حذف گردید',
                }),
            ],
        });
    }

    //addStudentToTerm------------------------------------------------------
    async addStudentToTerm(termId, studentId) {
        let term = await Term.findById(termId);
        if (!term) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'دوره ای با آیدی داده شده یافت نشد',
                    }),
                ],
            });
        }
        //check term capacity
        if (term.capacity <= 0) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'ظرفیت دوره تکمیل است',
                    }),
                ],
            });
        }

        let student = await Student.findById(studentId);
        if (!student) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'دانشجویی با آیدی داده شده یافت نشد',
                    }),
                ],
            });
        }

        //find student in term and check if he/she registered to term or not
        const stuId = term.students.find(function (obj) {
            return obj['_id'] == studentId;
        });
        if (stuId) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'دانشجو قبلا به دوره اضافه شده',
                    }),
                ],
            });
        }

        //add term to student doc and add student to term document
        student.courses.push(term);
        term.students.push(student);
        term.capacity -= 1;

        term = await term.save();
        student = await student.save();

        const studentModel = new StudentApiModel(student);

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: { course: term, studentModel },
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.success,
                    message: `دانشجو ${student.fullName} به دوره ${term.title} اضافه شد`,
                }),
            ],
        });
    }

    //removeStudentFromTerm-------------------------------------------------
    async removeStudentFromTerm(termId, studentId) {
        let term = await Term.findById(termId);
        if (!term) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'دوره ای با آیدی داده شده یافت نشد',
                    }),
                ],
            });
        }

        let student = await Student.findById(studentId);
        if (!student) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'دانشجویی با آیدی داده شده یافت نشد',
                    }),
                ],
            });
        }

        //find index of student and term objects in array
        const stuIndex = term.students.findIndex((stu) => stu.id === studentId);
        const trmIndex = student.courses.findIndex((trm) => trm.id === termId);

        if (stuIndex === -1 && trmIndex === -1) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message:
                            'دانشجویی با آیدی داده شده در این دوره یافت نشد',
                    }),
                ],
            });
        }

        // remove student term object from array
        if (stuIndex != -1) term.students.splice(stuIndex, 1);
        if (trmIndex != -1) student.courses.splice(trmIndex, 1);

        term.capacity += 1;

        await student.save();
        await term.save();

        const studentModel = new StudentApiModel(student);

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: { course: term, studentModel },
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.success,
                    message: `دانشجو ${student.fullName} از دوره ${term.title} حذف شد`,
                }),
            ],
        });
    }
}
module.exports = TermServices;
