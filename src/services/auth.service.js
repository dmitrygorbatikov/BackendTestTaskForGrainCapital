const jwt = require("jsonwebtoken");
const knex = require("../../db/knex");

class AuthService {
    setToken(payload, expiresIn) {
        return jwt.sign(
            payload,
            process.env.JWT_SECRET || 'ADMIN123',
            expiresIn
        )
    }
    async generateToken(res, user_id) {
        const accessToken = this.setToken( {user_id }, {expiresIn: '15m'})

        const refreshToken = this.setToken( {user_id }, {expiresIn: '1d'})

        const candidateRefresh = await knex('refreshToken')
            .where('user_id', user_id)
            .select('id')

        if(candidateRefresh.length === 0) {
            await knex('refreshToken').insert({
                token: refreshToken,
                user_id
            })
        } else {
            await knex('refreshToken')
                .where('user_id', user_id)
                .update({
                    token: refreshToken
                })
        }

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 60 * 60,
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24
        })

        return { accessToken, refreshToken }
    }

    checkAccessToken ({role}) {

        return async (req, res, next) => {
            if (req.method === 'OPTIONS') {
                return next()
            }
            try {
                const token = req.cookies.accessToken
                const jwtSecret = process.env.JWT_SECRET || 'ADMIN123'
                if (!token) {
                    return res.status(401).json({message: 'No authorized'})
                }
                const {user_id} = jwt.verify(token, jwtSecret)

                const candidate = await knex('users')
                    .select('*')
                    .where('id', user_id)
                if (candidate.length === 1 && (role === candidate[0].role || candidate[0].role === 'admin')) {
                    req.user = candidate[0]
                    delete req.user.password
                    next()
                } else {
                    return res.status(400).json({message: 'User not found'})
                }
            } catch (e) {
                return res.status(401).json({message: 'No authorized'})
            }
        }
    }

    async getUserIdFromToken(token){
        const jwtSecret = process.env.JWT_SECRET || 'ADMIN123'

        const {user_id} = jwt.verify(token, jwtSecret)

        return user_id
    }
}

module.exports = new AuthService()