const {Router} = require('express')
const router = Router()

const departmentsController = require('../controllers/department.controller')
const adminMiddleware = require('../middleware/admin.middleware')
const userMiddleware = require('../middleware/user.middleware')

router.post('/', adminMiddleware, departmentsController.createDepartment)
router.get('/list', userMiddleware, departmentsController.getDepartments)
router.get('/admin', adminMiddleware, departmentsController.getDepartmentsByAdmin)
router.get('/list/:department_id', userMiddleware, departmentsController.getDepartmentById)
router.delete('/:department_id', adminMiddleware, departmentsController.deleteDepartment)

module.exports = router