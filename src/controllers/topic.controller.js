const knex = require('../../db/knex')
const UserService = require("../services/user.services");
class TopicController {

    async createTopic(req,res) {
        try{
            const { id } = req.user
            const { title, text, description } = req.body

            await knex('topics').insert({
                title,
                text,
                description,
                user_id: id
            })

            const topics = await knex('topics')
                .select('*')
                .where('user_id', id)
                .orderBy('id', 'desc')
                .limit(1)

            const topic = topics[0]

            return res.status(201).json({topic})

        }
        catch (e) {
            return res.status(400).json({error: e.message})
        }
    }

    async getTopicsList(req,res){
        try{
            const { id } = req.user
            const order = req.query.order && req.query.order === 'asc' ? 'asc': 'desc'

            const { minDateFrom, maxDateTo } = await UserService.minDateFrom('topics')

            const fromDate = req.query.fromDate ?? minDateFrom
            const toDate = req.query.toDate ?? maxDateTo

            const topics = await knex('topics')
                .select('*')
                .where('user_id', id)
                .where('created_at', '>=', fromDate)
                .where('created_at', '<=', toDate)
                .orderBy('created_at', order)

            return res.status(200).json({topics})

        }
        catch (e) {
            return res.status(400).json({error: e.message})
        }
    }
    async getTopicsListByUserId(req,res){
        try {
            const { user_id } = req.params

            const users = await knex('users')
                .select('id')
                .where('id', user_id)
            if (users.length === 0) {
                return res.status(404).json({error: 'User not found'})
            }

            const order = req.query.order && req.query.order === 'asc' ? 'asc': 'desc'

            const { minDateFrom, maxDateTo } = await UserService.minDateFrom('topics')

            const fromDate = req.query.fromDate ?? minDateFrom
            const toDate = req.query.toDate ?? maxDateTo

            const topics = await knex('topics')
                .select('*')
                .where('user_id', user_id)
                .where('created_at', '>=', fromDate)
                .where('created_at', '<=', toDate)
                .orderBy('created_at', order)
            return res.status(200).json({topics})

        }
        catch (e) {
            return res.status(400).json({error: e.message})
        }
    }
    async getTopicItem(req,res){
        try{
            const { topic_id } = req.params

            const topics = await knex('topics')
                .select('*')
                .where('id', topic_id)

            if(topics.length === 0) {
                return res.status(404).json({error: 'Topic not found'})
            }

            const topic = topics[0]

            return res.status(200).json({topic})
        }
        catch (e) {
            return res.status(400).json({error: e.message})
        }
    }
    async updateTopicItem(req,res){
        try{
            const { role, id } = req.user
            const { topic_id } = req.params

            const candidates = await knex('topics')
                .select('id')
                .where('id', topic_id)

            if(candidates.length === 0){
                return res.status(404).json({error: 'Topic not found'})
            }

            if(role !== 'admin' && candidates[0].user_id !== id) {
                return res.status(400).json({error: "Not enough rights"})
            }

            const body = {}

            Object.keys(req.body).forEach(key => {
                if(key !== 'id' && key !== 'user_id' && key !== 'created_at') {
                    body[key] = req.body[key]
                }
            })

            await knex('topics').where('id', topic_id).update(body)

            const topics = await knex('topics')
                .select('*')
                .where('id', topic_id)

            const topic = topics[0]

            return res.status(200).json({topic})

        }
        catch (e) {
            return res.status(400).json({error: e.message})
        }
    }
    async deleteTopicItem(req,res){
        try{
            const { role, id } = req.user
            const { topic_id } = req.params

            const topics = await knex('topics')
                .select('*')
                .where('id', topic_id)

            if(topics.length === 0) {
                return res.status(404).json({error: 'Topic not found'})
            }

            if(role !== 'admin' && topics[0].user_id !== id) {
                return res.status(400).json({error: "Not enough rights"})
            }

            await knex('topics').where('id', topic_id).del()

            return res.status(200).json({message: `Topic with id ${topic_id} was deleted!`})

        }
        catch (e) {
            return res.status(400).json({error: e.message})
        }
    }


}

module.exports = new TopicController()