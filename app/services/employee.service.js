const Employee = require('../database/models/Employee');
const ServiceResult = require('../api_models/ServiceResult');
const ResponseMessage = require('../api_models/ResponseMessage');
const ResponseMessageType = require('../api_models/ResponseMessageType');

class EmployeeService {
    //createEmployee----------------------------------------------------------
    async createEmployee(employee) {
        const { email, password, nationalId } = employee;
        const result = await Employee.findOne({ email });
        const res = await Employee.findOne({ nationalId });

        if (!result && !res) {
            let employeeData = new Employee({
                fullName: employee.fullName,
                email: employee.email,
                password: employee.password,
                birthDate: employee.birthDate,
                phoneNumber: employee.phoneNumber,
                role: employee.role,
                address: employee.address,
                nationalId: employee.nationalId,
                profile: employee.profile ? employee.profile : '',
            });

            employeeData.hashPassword(password);
            employeeData = await employeeData.save();

            return new ServiceResult({
                success: true,
                result: employeeData,
                httpMethodCode: 200,
                message: [
                    new ResponseMessage({
                        eventId: 200,
                        type: ResponseMessageType.info,
                        message: `خوش آمدید ${employee.fullName}`,
                    }),
                ],
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

    //getAllEmployeesService--------------------------------------------------
    async getAllEmployeesService() {
        const employees = await Employee.find({ salt: { $ne: '' } });

        if (employees.length === 0) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'کارمندی یافت نشد',
                    }),
                ],
            });
        }
        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: employees,
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.error,
                    message: 'success get',
                }),
            ],
        });
    }

    //getAllEmployeesListForPagination-----------------------------------------
    async getAllEmployeesPageinationService(pageNumber, pageSize) {
        let employees = await Employee.find({ salt: { $ne: '' } })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({
                createDate: 1,
            });

        // return;

        if (employees.length === 0) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'کارمندی یافت نشد',
                    }),
                ],
            });
        }

        const count = await Employee.find({
            salt: { $ne: '' },
        });

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: { employees, count: count.length },
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.success,
                    message: 'success get',
                }),
            ],
        });
    }

    async getAllTeacherPageinationService(pageNumber, pageSize) {
        let employees = await Employee.find({
            salt: { $ne: '' },
            role: 'teacher',
        })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({
                createDate: 1,
            });

        console.log(employees);
        // return;

        if (employees.length === 0) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'کارمندی یافت نشد',
                    }),
                ],
            });
        }

        const count = await Employee.find({
            salt: { $ne: '' },
            role: 'teacher',
        });

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: { employees, count: count.length },
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.success,
                    message: 'success get',
                }),
            ],
        });
    }

    //getAllEmployeesByIdService-----------------------------------------------
    async getEmployeeByIdService(id) {
        const employee = await Employee.findById(id);

        if (!employee || employee.length === 0) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'کارمند یافت نشد',
                    }),
                ],
            });
        }

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: employee,
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.error,
                    message: 'success get',
                }),
            ],
        });
    }

    //updateEmployeeByIdService------------------------------------------------
    async updateEmployeeByIdService(id, model) {
        const employee = await Employee.findById(id);

        if (!employee) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'کارمند یافت نشد',
                    }),
                ],
            });
        }

        employee.fullName = model.fullName;
        employee.email = model.email;
        employee.birthDate = model.birthDate;
        employee.phoneNumber = model.phoneNumber;
        employee.nationalId = model.nationalId;
        employee.address = model.address;
        if (model.profile) employee.profile = model.profile;

        const result = await employee.save();

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: result,
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.error,
                    message: 'اطلاعات کارمند بروز شد',
                }),
            ],
        });
    }

    //deactiveEmployeeByIdService----------------------------------------------
    async deactiveEmployeeByIdService(id) {
        const employee = await Employee.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!employee) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'کارمند یافت نشد',
                    }),
                ],
            });
        }

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: 'Success',
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.error,
                    message: 'کارمند غیرفعال شد',
                }),
            ],
        });
    }
    //activeEmployeeByIdService------------------------------------------------
    async activeEmployeeByIdService(id) {
        const employee = await Employee.findByIdAndUpdate(
            id,
            { isActive: true },
            { new: true }
        );

        if (!employee) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'کارمند یافت نشد',
                    }),
                ],
            });
        }

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: 'Success',
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.error,
                    message: 'حساب کاربری کارمند مورد نظر فعال شد',
                }),
            ],
        });
    }

    //deleteEmployeeByIdService------------------------------------------------
    async deleteEmployeeByIdService(id) {
        const result = await Employee.findById(id);

        if (!result) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'No Employee Found',
                    }),
                ],
            });
        }

        let currentTime = new Date();
        currentTime = currentTime.getTime();
        const email = result.email;

        const employee = await Employee.findByIdAndUpdate(id, {
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
            result: employee,
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.success,
                    message: 'Employee deleted successfully',
                }),
            ],
        });
    }

    //findAllTeachers----------------------------------------------------------
    async findAllTeachers() {
        const teachers = await Employee.find({
            role: 'teacher',
            salt: { $ne: '' },
        });

        if (teachers.length === 0) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'استادی یافت نشد',
                    }),
                ],
            });
        }

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: teachers,
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.success,
                    message: 'با موفقیت دریافت شد',
                }),
            ],
        });
    }

    //find last 6 Teachers----------------------------------------------------------
    async findLastTeachers() {
        // const teachers = await Employee.find({
        //     role: 'teacher',
        //     salt: { $ne: '' },
        // });

        const teacher = [
            {
                image: 'https://s4.uupload.ir/files/bahrololoomi_a3c4.jpg',
                name: 'دکتر سید محمدحسین بحرالعلومی',
                _id: 1,
                email: 'bahrololoomi@gmail.com',
                discription: 'دکتری هوش مصنوعی, شاه شاهان',
            },
            {
                image: 'https://s4.uupload.ir/files/heidar_h14i.jpg',
                name: 'مهندس حیدر صفری',
                _id: 2,
                email: 'heidar@gmail.com',
                discription: 'فول استک دولوپر',
            },

            {
                image: 'teacher',
                name: 'مهندس محمدحسین خلیل پور',
                _id: 4,
                email: 'khalilpour@gmail.com',
                discription: 'سنیور ری اکت نیتیو',
            },
            {
                image: 'https://s4.uupload.ir/files/salar_jpwd.jpg',
                name: 'مهندس سالار نیلی',
                _id: 5,
                email: 'salar@gmail.com',
                discription:
                    'Senior menior duper  super asp.net core developer',
            },
            {
                image: 'https://s4.uupload.ir/files/mohsen_w6gt.jpg',
                name: 'مهندس محسن اسفندیاری',
                _id: 6,
                email: 'mohsen@gmail.com',
                discription: 'چنیور فرانت اند',
            },
        ];

        // if (teachers.length === 0) {
        //     return new ServiceResult({
        //         success: false,
        //         httpMethodCode: 404,
        //         result: 'Error',
        //         message: [
        //             new ResponseMessage({
        //                 eventId: 404,
        //                 type: ResponseMessageType.error,
        //                 message: 'استادی یافت نشد',
        //             }),
        //         ],
        //     });
        // }
        // console.log(teachers);
        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: teacher, //teachers.slice(Math.max(teachers.length - 6, 0)),
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.success,
                    message: 'با موفقیت دریافت شد',
                }),
            ],
        });
    }
}
module.exports = EmployeeService;
