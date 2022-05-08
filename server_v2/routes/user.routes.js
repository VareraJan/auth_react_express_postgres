const { Router } = require('express')
const { User } = require('../db/models') 
const auth = require('../middleware/auth.middleware')
const router = Router()

router.get('/', auth, async (req, res) => {
  try {

    const id  = req.user.id
    const response = await User.findOne({where: {id}, raw: true})
    res.json(response)
    
  } catch (error) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

module.exports = router
