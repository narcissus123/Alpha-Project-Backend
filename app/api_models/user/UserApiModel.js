class UserApiModel {
    constructor(model) {
        this._id = model._id;
        this.fullName = model.fullName;
        this.email = model.email;
        this.phoneNumber = model.phoneNumber;
        this.birthDate = model.birthDate;
        this.role = model.role;
        this.isActive = model.isActive;
        this.nationalId = model.nationalId;
        this.registerDate = model.registerDate;
        this.profile = model.profile;
    }
}
module.exports = UserApiModel;
