const { User } = require('../db/models')
const tokenService = require('./token-service')

class UserService {

  async activate(activationLink) {
    const user = await User.findOne({ where: {activationLink} })
    if (!user) {
      throw new Error('Неверная ссылка активации')
    }
    await User.update({isActivation: true}, {where: { activationLink }})
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken)
    return token
  }

  async refresh(refreshToken) {
    const userData = await tokenService.validateRefreshToken(refreshToken)

    const tokenFromDb = await tokenService.findToken(refreshToken)
    
    if (!userData || !tokenFromDb) {
      return 'authError'
    }

    const user = await User.findOne({ where: {id: userData.id} })

    const tokens = tokenService.generateTokens({
      email: user.email,
      id: user.id,
      isActivation: user.isActivation
    })
    await tokenService.saveToken( user.id, tokens.refreshToken)

    return {
      ...tokens, 
      user: {
        email: user.email,
        id: user.id,
        isActivation: user.isActivation
      }
    }
    
  }

}

module.exports = new UserService()
