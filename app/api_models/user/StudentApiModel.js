const UserApiModel=require('./UserApiModel');
class StudentApiModel extends UserApiModel{
    constructor(model){
        super(model);
    }
}
module.exports=StudentApiModel;