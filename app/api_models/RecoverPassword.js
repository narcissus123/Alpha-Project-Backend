// Forget Password Model
class ForgetPasswordModel {
    constructor(body) {
        if (body.email !== undefined) {
            this.email = body.email;
        }

    }
}
// Reset Password Model
class ResetPasswordModel {
    constructor(token, body) {
        this.token = token;

        if (body.password !== undefined) {
            this.password = body.password;
        }
    }
}
module.exports = { ForgetPasswordModel, ResetPasswordModel };