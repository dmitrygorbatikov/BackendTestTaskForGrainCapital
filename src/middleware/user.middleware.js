const AuthService = require('../services/auth.service')

module.exports = AuthService.checkAccessToken({role: 'user'})