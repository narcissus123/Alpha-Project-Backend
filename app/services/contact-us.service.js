const ServiceResult = require('../api_models/ServiceResult');
const ResponseMessage = require('../api_models/ResponseMessage');
const ResponseMessageType = require('../api_models/ResponseMessageType');
const NodeMailer = require('../middlewares/nodemailer');

const nodemailer = new NodeMailer();

class ContactUsService {
    //contactUs---------------------------------------------------------
    async sendMessage(model) {
        const text =
            'نام:\n' +
            model.name +
            '\n\nایمیل:\n' +
            model.email +
            '\n\nمتن:\n' +
            model.text;

        nodemailer.sendEmail(
            'masg1377@gmail.com',
            'پیام ارسال شده از سوی کاربران',
            text
        );

        return new ServiceResult({
            success: true,
            result: 'Info',
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.info,
                    message: 'پیام شما ارسال شد',
                }),
            ],
            httpMethodCode: 200,
        });
    }
}

module.exports = ContactUsService;
