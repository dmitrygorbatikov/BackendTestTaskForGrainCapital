const { Router } = require('express')
const router = Router()
const refreshController = require('../controllers/refresh.controller')

router.post('/refresh', refreshController.refreshToken)
router.post('/logout', refreshController.logout)

module.exports = router
