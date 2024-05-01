class AddCourseApiModel {
    constructor(model) {
        this.lessonName = model.lessonName;
        this.topics = model.topics;
        this.description = model.description;
        this.image = model.image;
        this.category = model.category;
    }
}
module.exports = AddCourseApiModel;
