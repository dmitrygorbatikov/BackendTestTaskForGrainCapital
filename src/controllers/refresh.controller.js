const knex = require('../../db/knex')
const jwt = require("jsonwebtoken");
const AuthService = require("../services/auth.service");
class RefreshController {
    async refreshToken(req, res) {
        try{
            const token = req.cookies.refreshToken
            if(!token) {
                return res.status(401).json({message: 'No authorized'})
            }

            const user_id = await AuthService.getUserIdFromToken(token)

            const { accessToken, refreshToken } = await AuthService.generateToken(res, user_id)

            return res.status(200).json({accessToken, refreshToken})
        }
        catch (e) {
            return res.status(400).json({error: e.message})
        }
    }

    async logout(req,res) {
        try{
            const token = req.cookies.refreshToken
            if(!token) {
                return res.status(401).json({message: 'No authorized'})
            }

            const user_id = await AuthService.getUserIdFromToken(token)

            await knex('refreshToken').where('user_id', user_id).del()

            res.clearCookie('accessToken')
            res.clearCookie('refreshToken')

            return res.status(200).json({message: 'User was logged out'})
        }
        catch (e) {
            return res.status(400).json({error: e.message})
        }
    }
}

module.exports = new RefreshController()