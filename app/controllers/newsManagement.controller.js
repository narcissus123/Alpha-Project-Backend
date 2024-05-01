const NewsService = require('../services/news.service');
const ResponseResult = require('../api_models/ResponseResult');
const NewsValidator = require('../validators/news.validator');
const ResponseMessage = require('../api_models/ResponseMessage');
const ResponseMessageType = require('../api_models/ResponseMessageType');
const NewsApiModel = require('../api_models/news/news-api.model');
const newsService = new NewsService();
const newsValidator = new NewsValidator();

class NewsManagementController {
    async addNews(req, res) {
        //validate request body (JOI)
        const { error, value } = newsValidator.newsValidator(req.body);

        let response;
        let httpMethodCode;

        if (error) {
            const errors = [];
            error.details.forEach((err) => {
                errors.push(
                    new ResponseMessage({
                        eventId: 400,
                        messageId: 1,
                        type: ResponseMessageType.error,
                        message: err.message,
                    })
                );
            });
            response = new ResponseResult({ success: false, message: errors });
            httpMethodCode = 400;
        } else {
            const model = new NewsApiModel({ ...value });
            const category = model.category.toLowerCase();
            if (category === 'news' || category === 'article') {
                // Send data to auth service
                const result = await newsService.addNews(model);
                response = new ResponseResult({
                    success: result['success'],
                    result: result['result'],
                    message: result['message'],
                });

                httpMethodCode = result.httpMethodCode;
            } else {
                response = new ResponseResult({
                    success: false,
                    result: null,
                    message: {
                        message:
                            'تنها میتوان دو دسته بندی news و article ایجاد نمود',
                    },
                });

                httpMethodCode = 400;
            }
        }
        res.status(httpMethodCode).send(response);
    }

    async getAllNews(req, res) {
        const result = await newsService.getAllNews();

        const response = new ResponseResult({
            success: result['success'],
            result: result['result'],
            message: result['message'],
        });

        const httpMethodCode = result.httpMethodCode;

        res.status(httpMethodCode).send(response);
    }

    async getNewsById(req, res) {
        const id = req.params.id;
        const result = await newsService.getNewsById(id);

        const response = new ResponseResult({
            success: result['success'],
            result: result['result'],
            message: result['message'],
        });

        const httpMethodCode = result.httpMethodCode;

        res.status(httpMethodCode).send(response);
    }

    async getByCategory(req, res) {
        const category = req.params.category;
        const result = await newsService.getByCategory(category);

        const response = new ResponseResult({
            success: result['success'],
            result: result['result'],
            message: result['message'],
        });

        const httpMethodCode = result.httpMethodCode;

        res.status(httpMethodCode).send(response);
    }

    //getAllNewsPagination--------------------------------------------------
    async getAllNewsPagination(req, res) {
        const query = req.query;
        const pagenumber = parseInt(query.pagenumber);
        const pagesize = parseInt(query.pagesize);
        const category = query.category;

        console.log(category);

        let response;
        let httpMethodCode;
        if (!pagenumber || !pagesize) {
            response = new ResponseResult({
                success: false,
                result: 'Error',
                message: 'شماره و اندازه صفحه وجود ندارد',
            });

            httpMethodCode = 400;
        } else {
            const result = await newsService.getAllNewsPagination(
                pagenumber,
                pagesize,
                category
            );

            response = new ResponseResult({
                success: result['success'],
                result: result['result'],
                message: result['message'],
            });

            httpMethodCode = result.httpMethodCode;
        }

        res.status(httpMethodCode).send(response);
    }

    async getTopArticles(req, res) {
        const result = await newsService.getTopArticles();

        const response = new ResponseResult({
            success: result['success'],
            result: result['result'],
            message: result['message'],
        });

        const httpMethodCode = result.httpMethodCode;

        res.status(httpMethodCode).send(response);
    }

    async getTopNews(req, res) {
        const result = await newsService.getTopNews();

        const response = new ResponseResult({
            success: result['success'],
            result: result['result'],
            message: result['message'],
        });

        const httpMethodCode = result.httpMethodCode;

        res.status(httpMethodCode).send(response);
    }

    async updateNewsById(req, res) {
        const id = req.params.id;
        const { error, value } = newsValidator.newsValidator(req.body);
        let response;
        let httpMethodCode;

        if (error) {
            const errors = [];
            error.details.forEach((err) => {
                errors.push(
                    new ResponseMessage({
                        eventId: 400,
                        messageId: 1,
                        type: ResponseMessageType.error,
                        message: err.message,
                    })
                );
            });

            response = new ResponseResult({ success: false, message: errors });
            httpMethodCode = 400;
        } else {
            const model = new NewsApiModel({ ...value });

            const result = await newsService.updateNewsById(id, model);

            response = new ResponseResult({
                success: result['success'],
                result: result['result'],
                message: result['message'],
            });

            httpMethodCode = result.httpMethodCode;
        }

        res.status(httpMethodCode).send(response);
    }

    async deleteNewsById(req, res) {
        const id = req.params.id;
        const result = await newsService.deleteNewsById(id);
        let response;
        let httpMethodCode;
        response = new ResponseResult({
            success: result['success'],
            result: result['result'],
            message: result['message'],
        });

        httpMethodCode = result.httpMethodCode;

        res.status(httpMethodCode).send(response);
    }
}

module.exports = NewsManagementController;
