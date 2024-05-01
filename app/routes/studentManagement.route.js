const router = require('express').Router();
const StudentManagementController = require('../controllers/studentManagement.controller');
const asyncMiddleware = require('../middlewares/async.middleware');
const IdValidator = require('../middlewares/validateObjectId');
const CheckAuth = require('../middlewares/checkAuth.middleware');
const {
    getAllStudents,
    getAllStudentsPagination,
    getStudentById,
    updateStudentById,
    deleteStudentById,
    deactiveStudentById,
    activeStudentById
} = new StudentManagementController();

const { authAdmin, authUser: authStudent } = new CheckAuth();
const {validateObjectId}=new IdValidator();

router.get('/getall', authAdmin, asyncMiddleware(getAllStudents));
router.get('/list', authAdmin, asyncMiddleware(getAllStudentsPagination));
router.get(
    '/:id',
    validateObjectId,
    authStudent,
    asyncMiddleware(getStudentById)
);
router.put(
    '/:id',
    validateObjectId,
    authStudent,
    asyncMiddleware(updateStudentById)
);
router.delete(
    '/:id',
    validateObjectId,
    authAdmin,
    asyncMiddleware(deleteStudentById)
);
router.put(
    '/deactive/:id',
    validateObjectId,
    authAdmin,
    asyncMiddleware(deactiveStudentById)
);
router.put(
    '/active/:id',
    validateObjectId,
    authAdmin,
    asyncMiddleware(activeStudentById)
);

module.exports = router;
