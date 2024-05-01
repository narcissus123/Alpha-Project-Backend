// Forget Password Model
class ContactUsApiModel {
    constructor(body) {
            this.email = body.email;
            this.name = body.name;
            this.text = body.text;
    }
}

module.exports = ContactUsApiModel;