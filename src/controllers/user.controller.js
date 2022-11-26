const knex = require('../../db/knex')
const UserService = require('../services/user.services')
class UserController {

    async getProfile(req,res) {
        try{
            return res.status(200).json({user: req.user})
        }
        catch (e) {
            return res.status(200).json({error: e.message})
        }
    }

    async getUsersList(req,res) {
        try {
            const order = req.query.order && req.query.order === 'asc' ? 'asc': 'desc'
            const select = ['id', 'name', 'surname', 'login', 'position', 'created_at']

            const { minDateFrom, maxDateTo } = await UserService.minDateFrom('users')

            const fromDate = req.query.fromDate ?? minDateFrom
            const toDate = req.query.toDate ?? maxDateTo

            const users = await knex('users')
                    .select(select)
                    .where('created_at', '>=', fromDate)
                    .where('created_at', '<=', toDate)
                    .orderBy('created_at', order)

            return res.status(200).json({users})

        }
        catch (e) {
            return res.status(200).json({error: e.message})
        }
    }

    async updateProfile(req,res) {
        try{
            const { id } = req.user

            const body = {}

            Object.keys(req.body).forEach(key => {
                if(key !== 'id' && key !== 'password' && key !== 'role') {
                    body[key] = req.body[key]
                }
            })

            if(body.login) {
                const userByLogin = await knex('users').select('id').where('login', body.login)
                if(userByLogin.length !== 0 && userByLogin[0].id !== id) {
                    return res.status(400).json({error: 'User with this login already exist!'})
                }
            }

            await knex('users').where('id', id).update(req.body)

            const users = await knex('users')
                .select('id', 'name', 'surname', 'login', 'position')
                .where('id', id)

            return res.status(200).json({user: users[0]})

        }
        catch (e) {
            return res.status(200).json({error: e.message})
        }
    }

    async deleteProfile(req,res) {
        try {
            const { id } = req.user

            await knex('users').where('id', id).del()

            return res.status(200).json({message: 'Your profile was deleted!'})
        }
        catch (e) {
            return res.status(200).json({error: e.message})
        }
    }

    async getUserById(req,res) {
        try{
            const { user_id } = req.params
            const users = await knex('users')
                .select('id', 'name', 'surname', 'login', 'position')
                .where('id', user_id)

            if(users.length === 0) {
                return res.status(404).json({error: 'User not found'})
            }

            const user = users[0]

            return res.status(200).json({user})

        }
        catch (e) {
            return res.status(200).json({error: e.message})
        }
    }

    async updateUserById(req,res) {
        try{
            const { user_id } = req.params

            const body = {}

            Object.keys(req.body).forEach(key => {
                if(key !== 'id' && key !== 'password' && key !== 'role') {
                    body[key] = req.body[key]
                }
            })

            if(body.login) {
                const userByLogin = await knex('users')
                    .select('id')
                    .where('login', body.login)

                if(userByLogin.length !== 0 && userByLogin[0].id !== user_id) {
                    return res.status(400).json({error: 'User with this login already exist!'})
                }
            }

            const candidates = await knex('users').select('id').where('id', user_id)

            if(candidates.length === 0) {
                return res.status(404).json({error: 'User not found'})
            }

            await knex('users').where('id', user_id).update(req.body)

            const users = await knex('users')
                .select('id', 'name', 'surname', 'login', 'position')
                .where('id', user_id)

            return res.status(200).json({user: users[0]})

        }
        catch (e) {
            return res.status(200).json({error: e.message})
        }
    }

    async deleteUserById(req,res) {
        try {
            const { user_id } = req.params

            const users = await knex('users')
                .select('id')
                .where('id', user_id)

            if(users.length === 0){
                return res.status(400).json({error: 'User not found'})
            }

            await knex('users').where('id', user_id).del()

            return res.status(200).json({message: `User with id ${user_id} was deleted`})
        }
        catch (e) {
            return res.status(200).json({error: e.message})
        }
    }



}

module.exports = new UserController()