const ServiceResult = require('../api_models/ServiceResult');
const ResponseMessage = require('../api_models/ResponseMessage');
const ResponseMessageType = require('../api_models/ResponseMessageType');
const NodeMailer = require('../middlewares/nodemailer');
const Student = require('../database/models/Student');

const nodemailer = new NodeMailer();

class RecoverPasswordService {
    //forgetPassword---------------------------------------------------------
    async forgetPassword(model) {
        //find student with Email
        let student = await Student.findOne({
            email: model['email']
        });
        //check student with given email is exist or not
        if (student) {
            //check student reset password token time is expired or not
            const rstPassEx = new Date(student.resetPasswordExpires);
            if (rstPassEx > Date.now()) {
                return new ServiceResult({
                    success: false,
                    result: 'Error',
                    message: [
                        new ResponseMessage({
                            eventId: 405,
                            type: ResponseMessageType.error,
                            message: 'لینک تغییر رمزعبور به ایمیل شده ارسال شده است!'
                        })
                    ],
                    httpMethodCode: 405
                });
            } else {
                //set reset password token for student
                const token = student.setResetPasswordToken();

                //set reset password token expire time
                student.setResetPasswordExpires();
                await student.save();

                nodemailer.sendEmail(
                    student.email,
                    'رهنمایی تغییر رمز عبور',
                    'بر روی لینک زیر کلیک کنید\n\n\n',
                    `token : ([${token}])`
                );
                //     <a href='http://localhost:3000/api/resetPassword/${token}'>
                //         http://localhost:3000/api/resetPassword/${token}
                //     </a>
                return new ServiceResult({
                    success: true,
                    result: 'Info',
                    message: [
                        new ResponseMessage({
                            eventId: 200,
                            type: ResponseMessageType.info,
                            message: 'لینک تغییر رمز عبور به ایمیل شما ارسال گشت'
                        })
                    ],
                    httpMethodCode: 200
                });
            }
        } else {
            return new ServiceResult({
                success: false,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 501,
                        type: ResponseMessageType.error,
                        message: 'ایمیل وارد شده معتبر نمی باشد'
                    })
                ],
                httpMethodCode: 501
            });
        }
    }

    //resetPassword----------------------------------------------------------
    async resetPassword(model) {
        //find student with given email address
        let student = await Student.findOne({
            resetPasswordToken: model['token'],
            resetPasswordExpires: {
                $gt: Date.now()
            }
        });

        //check for existance of student
        if (student) {
            student.hashPassword(model.password);

            student.resetPasswordToken = null;
            student.resetPasswordExpires = null;
            await student.save();
            nodemailer.sendEmail(
                student.email,
                'رمز عبور با موفقیت تغییر کرد',
                'رمز عبور شما تغییر کرده و اکنون میتوان با استفاده از رمزعبور جدید به حساب خود دسترسی داشته باشین'
            );

            return new ServiceResult({
                success: true,
                result: 'Info',
                message: [
                    new ResponseMessage({
                        eventId: 200,
                        type: ResponseMessageType.info,
                        message: 'رمز عبور با موفقیت تغییر کرد'
                    })
                ],
                httpMethodCode: 200
            });
        } else {
            return new ServiceResult({
                success: false,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 501,
                        type: ResponseMessageType.error,
                        message: 'لینک تغییر ایمیل نادرست است!'
                    })
                ],
                httpMethodCode: 501
            });
        }
    }
}

module.exports = RecoverPasswordService;