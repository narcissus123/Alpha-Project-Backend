class RegisterApiModel {
    constructor(model) {
        this.fullName = model.fullName;
        this.email = model.email;
        this.password = model.password;
        this.phoneNumber = model.phoneNumber;
        this.birthDate = model.birthDate;
        this.nationalId = model.nationalId;
        this.profile = model.profile;
    }
}
module.exports = RegisterApiModel;
