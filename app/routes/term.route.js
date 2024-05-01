const router = require('express').Router();
const TermManagementController = require('../controllers/termManagement.controller');
const asyncMiddleware = require('../middlewares/async.middleware');
const CheckAuth = require('../middlewares/checkAuth.middleware');
const IdValidator = require('../middlewares/validateObjectId');

const {
    getAllTerms,
    getTermById,
    updateTermById,
    deleteTermById,
    createTerm,
    addStudentToTerm,
    removeStudentFromTerm,
    getAllTermPagination,
} = new TermManagementController();
const { validateObjectId } = new IdValidator();
const { authAdmin, authUser: authStudent } = new CheckAuth();

//ROUTES-----------------------------------------------------------------------
router.get('/list', asyncMiddleware(getAllTermPagination));
router.get('/getall', asyncMiddleware(getAllTerms));
router.get('/:id', validateObjectId, asyncMiddleware(getTermById));
router.put(
    '/:id',
    validateObjectId,
    authAdmin,
    asyncMiddleware(updateTermById)
);
router.post('/', authAdmin, asyncMiddleware(createTerm));
router.delete(
    '/:id',
    validateObjectId,
    authAdmin,
    asyncMiddleware(deleteTermById)
);
router.post(
    '/addStudentToCourse/:id',
    validateObjectId,
    authStudent,
    asyncMiddleware(addStudentToTerm)
);

router.post(
    '/removeStudentFromCourse/:id',
    validateObjectId,
    authStudent,
    asyncMiddleware(removeStudentFromTerm)
);

module.exports = router;
