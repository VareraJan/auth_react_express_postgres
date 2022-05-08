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

  async validateAccessToken(token) {
    try {
      console.log('TOKEN --------> ', token);
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
      console.log('TOKEN userData--------> ', userData);

      return userData;
    } catch (error) {
      return null
    }
  }

  async validateRefreshToken(token) {
    try {

      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
      
      return userData;
    } catch (error) {
      return null
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

  async removeToken(refreshToken) {
    const tokenData = await Token.destroy({ where: {
      refreshToken
    } })
    return tokenData
  }

  async findToken(refreshToken) {
    const tokenData = await Token.findOne({ where: {
      refreshToken
    } })
    return tokenData
  }

}

module.exports = new TokenService()
