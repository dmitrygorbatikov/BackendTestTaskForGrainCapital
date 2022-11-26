const knex = require("../../db/knex");
const bcrypt = require('bcryptjs')
const AuthService = require("../services/auth.service");

class AuthController {
    async register(req,res) {
        try{
            const {
                login,
                name,
                surname,
                password,
                position,
                department_id
            } = req.body

            const candidate = await knex('users')
                .select('id')
                .where('login', login)

            if(candidate.length === 1) {
                return res.status(400).json({error: "User already exist"})
            }

            const departments = await knex('departments')
                .select('id')
                .where('id', department_id)

            if(departments.length === 0) {
                return res.status(400).json({error: 'Department does not exist'})
            }

            const hashedPassword = await bcrypt.hash(password, 12)

            await knex('users').insert({
                login,
                name,
                surname,
                password: hashedPassword,
                role: 'user',
                position,
                department_id
            })

            const users = await knex('users').select('id').where('login', login)

            const { accessToken, refreshToken } = await AuthService.generateToken(res, users[0].id)

            return res.status(201).json({accessToken, refreshToken})
        }
        catch (e) {
            return res.status(400).json({error: e.message})
        }
    }

    async login(req,res) {
        try {
            const { login, password } = req.body

            const users = await knex('users').select('*').where('login', login)
            if(users.length === 0) {
                return res.status(400).json({error: "User not found"})
            }

            const user = users[0]

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch){
                return res.status(400).json({error: "Incorrect password, please try again"})
            }

            const { accessToken, refreshToken } = await AuthService.generateToken(res, users[0].id)

            return res.status(200).json({accessToken, refreshToken})
        }
        catch (e) {
            return res.status(400).json({error: e.message})
        }
    }
}

module.exports = new AuthController()