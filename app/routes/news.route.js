const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async.middleware');
const NewsController = require('../controllers/newsManagement.controller');
const IdValidator = require('../middlewares/validateObjectId');
const {
    addNews,
    deleteNewsById,
    updateNewsById,
    getAllNews,
    getTopNews,
    getTopArticles,
    getNewsById,
	getByCategory,
	getAllNewsPagination
} = new NewsController();
const { validateObjectId } = new IdValidator();


router.post('/' ,asyncMiddleware(addNews));
router.put('/:id', validateObjectId, asyncMiddleware(updateNewsById));
router.delete('/:id', validateObjectId, asyncMiddleware(deleteNewsById));
router.get('/', asyncMiddleware(getAllNews));
router.get('/list', asyncMiddleware(getAllNewsPagination));
router.get('/topNews', asyncMiddleware(getTopNews));
router.get('/topArticles', asyncMiddleware(getTopArticles));
router.get('/category/:category', asyncMiddleware(getByCategory));
router.get('/:id', validateObjectId, asyncMiddleware(getNewsById));

module.exports = router;
