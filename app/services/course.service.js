const ServiceResult = require('../api_models/ServiceResult');
const ResponseMessage = require('../api_models/ResponseMessage');
const ResponseMessageType = require('../api_models/ResponseMessageType');
const { Lesson } = require('../database/models/Course');

class CourseService {
    //create Course---------------------------------------------------------
    async addCourse(course) {
        const categories = [
            {
                id: 1,
                name: 'فیزیک',
            },
            {
                id: 2,
                name: 'ریاضی',
            },
            {
                id: 3,
                name: 'شیمی',
            },
            {
                id: 4,
                name: 'کامپیوتر',
            },
            {
                id: 5,
                name: 'صنعت',
            },
            {
                id: 6,
                name: 'معماری',
            },
            {
                id: 7,
                name: 'برق',
            },
            {
                id: 8,
                name: 'بازار سهام',
            },
        ];

        let courseData = new Lesson({ ...course });
        const exist = categories.some((a) => a.id === course.category);
        if (!exist) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 400,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'دسته بندی درس را درست وارد کنید!',
                    }),
                ],
            });
        }
        courseData = await courseData.save();
        return new ServiceResult({
            success: true,
            result: courseData,
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.info,
                    message: 'درس اضافه شد',
                }),
            ],
            httpMethodCode: 200,
        });
    }

    //getAllCourses---------------------------------------------------------
    async getAllCourse() {
        try {
            const courses = await Lesson.find();
            if (courses.length === 0) {
                return new ServiceResult({
                    success: false,
                    httpMethodCode: 404,
                    result: 'Error',
                    message: [
                        new ResponseMessage({
                            eventId: 404,
                            type: ResponseMessageType.error,
                            message: 'درسی یافت نشد',
                        }),
                    ],
                });
            }

            return new ServiceResult({
                success: true,
                httpMethodCode: 200,
                result: courses,
                message: [
                    new ResponseMessage({
                        eventId: 200,
                        type: ResponseMessageType.success,
                        message: 'با موفقیت دریافت شد',
                    }),
                ],
            });
        } catch (e) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'درسی یافت نشد',
                    }),
                ],
            });
        }
    }

    //get All Courses List For Pagination----------------------------------------
    async getAllCoursePagination(pageNumber, pageSize) {
        const courses = await Lesson.find()
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({
                createDate: 1,
            });

        if (courses.length === 0) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'درسی یافت نشد',
                    }),
                ],
            });
        }

        const count = await Lesson.countDocuments();

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: { lessons: courses, count },
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.success,
                    message: 'با موفقیت دریافت شد',
                }),
            ],
        });
    }

    //getCourseByIdService--------------------------------------------------
    async getCourseById(id) {
        const course = await Lesson.findById(id);

        if (!course) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'درسی یافت نشد',
                    }),
                ],
            });
        }

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: course,
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.success,
                    message: 'با موفقیت دریافت شد',
                }),
            ],
        });
    }
    //get Term Of Course--------------------------------------------------
    async getTermsOfCourse(id) {
        const course = await Lesson.findById(id);

        if (!course) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'درسی یافت نشد',
                    }),
                ],
            });
        }

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: course.terms,
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.success,
                    message: 'با موفقیت دریافت شد',
                }),
            ],
        });
    }
    //update Course By Id -----------------------------------------------
    async updateCourseById(id, model) {
        const categories = [
            {
                id: 1,
                name: 'فیزیک',
            },
            {
                id: 2,
                name: 'ریاضی',
            },
            {
                id: 3,
                name: 'شیمی',
            },
            {
                id: 4,
                name: 'کامپیوتر',
            },
            {
                id: 5,
                name: 'صنعت',
            },
            {
                id: 6,
                name: 'معماری',
            },
            {
                id: 7,
                name: 'برق',
            },
            {
                id: 8,
                name: 'بازار سهام',
            },
        ];

        const course = await Lesson.findOne({ _id: id });

        if (!course) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'درسی یافت نشد',
                    }),
                ],
            });
        }

        const exist = categories.some((a) => a.id === course.category);
        if (!exist) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 400,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'دسته بندی درس را درست وارد کنید!',
                    }),
                ],
            });
        }
        course.lessonName = model.lessonName;
        course.topics = model.topics;
        course.description = model.description;
        course.image = model.image;
        course.category = model.category;

        const result = await course.save();

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: result,
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.success,
                    message: 'درس بروز شد',
                }),
            ],
        });
    }

    //delete course ById -----------------------------------------------
    async deleteCourseById(id) {
        const result = await Lesson.findByIdAndRemove(id);

        if (!result) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'درسی یافت نشد',
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
                    message: 'درس حذف شد',
                }),
            ],
        });
    }
}

module.exports = CourseService;
