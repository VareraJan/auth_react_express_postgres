const { User } = require('../db/models')

class UserService {

  async activate(activationLink) {
    const user = await User.findOne({ where: {activationLink} })
    if (!user) {
      throw new Error('Неверная ссылка активации')
    }
    const updUser = await User.update({isActivation: true}, {where: { activationLink }})
  }

}

module.exports = new UserService()
