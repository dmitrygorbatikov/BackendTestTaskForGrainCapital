const {Router} = require('express')
const router = Router()

const userController = require('../controllers/user.controller')
const adminMiddleware = require('../middleware/admin.middleware')
const userMiddleware = require('../middleware/user.middleware')

router.get('/', userMiddleware, userController.getProfile)
router.get('/list', adminMiddleware, userController.getUsersList)
router.get('/:user_id', adminMiddleware, userController.getUserById)
router.put('/', userMiddleware, userController.updateProfile)
router.put('/:user_id', adminMiddleware, userController.updateUserById)
router.delete('/', userMiddleware, userController.deleteProfile)
router.delete('/:user_id', adminMiddleware, userController.deleteUserById)

module.exports = router