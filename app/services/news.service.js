const ServiceResult = require('../api_models/ServiceResult');
const ResponseMessage = require('../api_models/ResponseMessage');
const ResponseMessageType = require('../api_models/ResponseMessageType');
const { News } = require('../database/models/news');

class NewsService {
    //create news---------------------------------------------------------
    async addNews(news) {
        let newsData = new News({ ...news });
        newsData = await newsData.save();
        return new ServiceResult({
            success: true,
            result: newsData,
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.info,
                    message: 'خبر اضافه شد',
                }),
            ],
            httpMethodCode: 200,
        });
    }

    //getAllNews---------------------------------------------------------
    async getAllNews() {
        const newsList = await News.find();
        if (newsList.length === 0) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'خبری یافت نشد',
                    }),
                ],
            });
        }

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: newsList,
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.success,
                    message: 'success get',
                }),
            ],
        });
    }

    //getTopNews---------------------------------------------------------
    async getTopNews() {
        const newsList = await News.find({ category: 'news' }).limit(5);
        if (newsList.length === 0) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'خبری یافت نشد',
                    }),
                ],
            });
        }

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: newsList,
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.success,
                    message: 'success get',
                }),
            ],
        });
    }

    //getTopArticles---------------------------------------------------------
    async getTopArticles() {
        const newsList = await News.find({ category: 'article' }).limit(5);
        if (newsList.length === 0) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'خبری یافت نشد',
                    }),
                ],
            });
        }

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: newsList,
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.success,
                    message: 'success get',
                }),
            ],
        });
    }

    //getAllNewsListForPagination----------------------------------------
    async getAllNewsPagination(pageNumber, pageSize, category) {
        const newsList = await News.find(category ? { category: category } : {})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({
                _id: -1,
            });

        if (newsList.length === 0) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'خبری یافت نشد',
                    }),
                ],
            });
        }

        const count = await News.countDocuments();

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: { newsList, count },
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.success,
                    message: 'success get',
                }),
            ],
        });
    }

    //getByCategory.....................................................
    async getByCategory(category) {
        const newsList = await News.find({ category: category }).sort({
            _id: -1,
        });
        if (newsList.length === 0) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'خبری یافت مطلبی',
                    }),
                ],
            });
        }

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: newsList,
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.success,
                    message: 'success get',
                }),
            ],
        });
    }

    //getNewsById---------------------------------------------------------
    async getNewsById(id) {
        const news = await News.findById(id);

        if (!news) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'خبری یافت نشد',
                    }),
                ],
            });
        }

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: news,
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.success,
                    message: 'success get',
                }),
            ],
        });
    }

    //update news By Id -----------------------------------------------
    async updateNewsById(id, model) {
        const news = await News.findById(id);

        if (!news) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: 'خبری یافت نشد',
                    }),
                ],
            });
        }

        news.title = model.title;
        news.category = model.category;
        news.text = model.text;
        news.image = model.image;

        const result = await news.save();

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: result,
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.success,
                    message: ' بروز شد',
                }),
            ],
        });
    }

    //delete news ById -----------------------------------------------
    async deleteNewsById(id) {
        const result = await News.findByIdAndRemove(id);

        if (!result) {
            return new ServiceResult({
                success: false,
                httpMethodCode: 404,
                result: 'Error',
                message: [
                    new ResponseMessage({
                        eventId: 404,
                        type: ResponseMessageType.error,
                        message: ' خبری یافت نشد',
                    }),
                ],
            });
        }

        return new ServiceResult({
            success: true,
            httpMethodCode: 200,
            result: result,
            message: [
                new ResponseMessage({
                    eventId: 200,
                    type: ResponseMessageType.success,
                    message: 'خبر  حذف شد',
                }),
            ],
        });
    }
}

module.exports = NewsService;
