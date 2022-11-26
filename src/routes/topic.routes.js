const {Router} = require('express')
const router = Router()

const topicController = require('../controllers/topic.controller')
const userMiddleware = require('../middleware/user.middleware')

router.post('/', userMiddleware, topicController.createTopic)

router.get('/list', userMiddleware, topicController.getTopicsList)
router.get('/list/:user_id', userMiddleware, topicController.getTopicsListByUserId)
router.get('/item/:topic_id', userMiddleware, topicController.getTopicItem)

router.put('/item/:topic_id', userMiddleware, topicController.updateTopicItem)

router.delete('/item/:topic_id', userMiddleware, topicController.deleteTopicItem)

module.exports = router