const mongoose = require('mongoose');
// var ObjectId = mongoose.Schema.Types.ObjectId;
const NewsSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 5,
        maxlength: 300,
        required: true,
        trim: true,
    },

    category: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
});

const News = mongoose.model('news', NewsSchema);

module.exports = { News, NewsSchema };
