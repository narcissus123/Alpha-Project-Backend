const UserApiModel = require('./UserApiModel');
class EmployeeApiModel extends UserApiModel {
    constructor(model) {
        super(model);
        this.address = model.address;

    };
}
module.exports = EmployeeApiModel;