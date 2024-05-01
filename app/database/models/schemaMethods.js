const jwt = require('jsonwebtoken');
const config = require('config');
const crypto = require('crypto');

class SchemaMethod {
    //generate auth token
    generateAuthToken() {
        const token = jwt.sign(
            { _id: this._id, role: this.role },
            config.get('jwtPrivateKey')
        );
        return token;
    }

    //set reset password token
    setResetPasswordToken() {
        return (this.resetPasswordToken = crypto.randomBytes(30).toString('hex'));
    }

    //set token expire date
    setResetPasswordExpires() {
        this.resetPasswordExpires = Date.now() + 3600000;
    }

    //validate password
    validatePassword(password) {
        const passwordHash = crypto
            .pbkdf2Sync(password, this.salt, 100000, 64, 'sha512')
            .toString('hex');
        return this.password === passwordHash;
    }

    //hash password
    hashPassword(password) {
        this.salt = crypto.randomBytes(16).toString('hex');
        this.password = crypto
            .pbkdf2Sync(password, this.salt, 100000, 64, 'sha512')
            .toString('hex');
    }
}

module.exports = SchemaMethod;