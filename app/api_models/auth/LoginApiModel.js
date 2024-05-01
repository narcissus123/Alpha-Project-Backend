const LoginResApiModel = require('./LoginResApiModel');

class LoginStudentApiModel extends LoginResApiModel {
    constructor({ email, password, token }) {
        super(token);
        this.email = email;
        this.password = password;
    }
}

module.exports = LoginStudentApiModel;
