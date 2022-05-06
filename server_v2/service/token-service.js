const jwt = require('jsonwebtoken')
const { Token } = require('../db/models')
require('dotenv').config()

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15m'})
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
    return {
      accessToken,
      refreshToken
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await Token.findOne({ where: { user_id: userId } })
    if (tokenData) {
      const token = await Token.update({refreshToken}, {where: {user_id: userId}})
      return token
    }
    const token = await Token.create({user_id: userId, refreshToken})
    return token
  }

}

module.exports = new TokenService()
