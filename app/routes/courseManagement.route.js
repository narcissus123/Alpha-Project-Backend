const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async.middleware');
const CourseController = require('../controllers/courseManagement.controller');
const IdValidator = require('../middlewares/validateObjectId');
const {
    addCourse,
    deleteCourseById,
    updateCourseById,
    getAllCourse,
    getAllCoursePagination,
    getTermsOfCourse,
    getCourseById,
} = new CourseController();
const { validateObjectId } = new IdValidator();

router.post('/add', asyncMiddleware(addCourse));
router.put('/:id', validateObjectId, asyncMiddleware(updateCourseById));
router.delete('/:id', validateObjectId, asyncMiddleware(deleteCourseById));
router.get('/', asyncMiddleware(getAllCourse));
router.get('/list', asyncMiddleware(getAllCoursePagination));
router.get('/course/:id', validateObjectId, asyncMiddleware(getTermsOfCourse));
router.get('/:id', validateObjectId, asyncMiddleware(getCourseById));

module.exports = router;
