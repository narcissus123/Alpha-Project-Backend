class NewsApiModel {
    constructor(model) {
        this.title = model.title;
        this.text = model.text;
        this.category = model.category;
        this.image = model.image;
    }
}
module.exports = NewsApiModel;