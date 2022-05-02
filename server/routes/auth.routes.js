const { Router } = require('express')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const { User } = require('../db/models') 
const router = Router()

// /api/auth/register
router.post(
  '/register', 
  [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля 6 символов')
      .isLength({ min: 6 })
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректные данные при регистрации'
      })
    }

    const {email, password} = req.body
    const candidate = await User.findOne({where: { email }})

    if(candidate) {
      return res.status(400).json({ message: 'Такой пользователь уже существует!' })
    }

    const hashedPassword = await bcrypt(password, 12)
    const user = User.create({ email, password: hashedPassword })

    res.status(201).json({ message: 'Пользователь создан' })

  } catch (error) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// /api/auth/login
router.post('/login', async (req, res) => {
  
})

module.exports = router
