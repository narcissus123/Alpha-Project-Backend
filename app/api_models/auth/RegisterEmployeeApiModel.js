const RegisterApiModel = require('./RegisterApiModel');

class RegisterEmployeeApiModel extends RegisterApiModel {
    constructor({
        fullName,
        email,
        password,
        phoneNumber,
        birthDate,
        address,
        nationalId,
        role,
        profile,
    }) {
        super({
            fullName,
            email,
            password,
            phoneNumber,
            birthDate,
            nationalId,
            profile,
        });

        this.address = address;
        this.role = role;
    }
}

module.exports = RegisterEmployeeApiModel;
