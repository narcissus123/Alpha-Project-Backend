// contactUsController
const ResponseResult = require('../api_models/ResponseResult');
const ContactUsService = require('../services/contact-us.service');
const ContactUsApiModel = require('../api_models/contact-us-api.model');
const contactUsService = new ContactUsService();
class ContactUsController {
    // send message-------------------------------------------------------
    async sendMessage(req, res) {
        const model = new ContactUsApiModel(req.body);

        let response;
        let httpMethodCode;

        const result = await contactUsService.sendMessage(model);

        response = new ResponseResult({
            success: result['success'],
            result: result['result'],
            message: result['message'],
        });
        httpMethodCode = result.httpMethodCode;
        res.status(httpMethodCode).send(response);
    }
}

module.exports = ContactUsController;
