const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async.middleware');
const IdValidator = require('../middlewares/validateObjectId');
const CheckAuth = require('../middlewares/checkAuth.middleware');
const EmployeeManagementController = require('../controllers/employeeManagement.controller');
const {
    getAllEmployees,
    getAllEmployeesPageination,
    getEmployeeById,
    updateEmployeeById,
    deactiveEmployeeById,
    activeEmployeeById,
    getAllTeachersPageination,
    deleteEmployeeById,
    findAllTeachers,
    findLastTeachers,
} = new EmployeeManagementController();
const { authAdmin, authUser: authEmployee } = new CheckAuth();
const { validateObjectId } = new IdValidator();

router.get('/getall', authAdmin, asyncMiddleware(getAllEmployees));
router.get('/getallteachers', asyncMiddleware(findAllTeachers));
router.get('/getlastteachers', asyncMiddleware(findLastTeachers));
router.get('/list', authAdmin, asyncMiddleware(getAllEmployeesPageination));
router.get(
    '/getTeachers/list',
    authAdmin,
    asyncMiddleware(getAllTeachersPageination)
);
router.get(
    '/:id',
    validateObjectId,
    authEmployee,
    asyncMiddleware(getEmployeeById)
);
router.put(
    '/:id',
    validateObjectId,
    authEmployee,
    asyncMiddleware(updateEmployeeById)
);
router.put(
    '/deactive/:id',
    validateObjectId,
    authAdmin,
    asyncMiddleware(deactiveEmployeeById)
);
router.put(
    '/active/:id',
    validateObjectId,
    authAdmin,
    asyncMiddleware(activeEmployeeById)
);
router.delete(
    '/:id',
    validateObjectId,
    authAdmin,
    asyncMiddleware(deleteEmployeeById)
);

module.exports = router;
