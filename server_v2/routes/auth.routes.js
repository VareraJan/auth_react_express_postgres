const { Router } = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const { User } = require('../db/models') 
const router = Router()
const uuid = require('uuid')
const mailService = require('../service/mail-service')
const tokenService = require('../service/token-service')
require('dotenv').config()

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
      console.log('==============', req.body);
      const candidate = await User.findOne({where: { email }})
      if(candidate) {
        return res.status(400).json({ message: 'Такой пользователь уже существует!' })
      }
      console.log('uuuuuuuuuuuuuuuuuuuuuuuuuuuuuu');
      const hashedPassword = await bcrypt.hashSync(password, 7)
      console.log('hhhhhhhhhhhhhhhhhhhh');
      const activationLink = uuid.v4()
      console.log('------------UUID----------', activationLink);
      const user = await User.create({ email, password: hashedPassword, activationLink })
      console.log('USER CREQTE++++++++++++++++++++++++++ TO MAIL');
      await mailService.sendActivationMail(email, `${process.env.API_URL}/api/auth/activation/${activationLink}`)
      const tokens = tokenService.generateTokens({
        email: user.email,
        id: user.id,
        isActivation: user.isActivation
      })
      console.log('CANCEL MAIL ------');
      await tokenService.saveToken( user.id, tokens.refreshToken)

      res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
      res.status(201).json({
        ...tokens, 
        user: {
          email: user.email,
          id: user.id,
          isActivation: user.isActivation
        }
      })

    } catch (error) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

// /api/auth/login
router.post(
  '/login', 
  [
    check('email', 'Введите корректный email').normalizeEmail().isEmail(),
    check('password', 'Введите пароль').exists()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if(!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при входе в систему'
        })
      }

      const { email, password } = req.body
      const user = await User.findOne({ where: { email }, raw: true })
      if (!user){
        return res.status(400).json({ message: 'Пользователь не найден' })
      }

      isMatch = await bcrypt.compare(password, user.password)

      if(!isMatch) {
        return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' })
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      )

      res.json({ token, userId: user.id })


    } catch (error) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
})

// /api/auth/logout

router.post('/logout', async (req, res) => {
  try {
    


  } catch (error) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// /api/auth/activation/kalsdi
router.get('/activate/:id', async (req,res) => {
  try {
    


  } catch (error) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// /api/auth/refresh
router.get('/refresh', async (req,res) => {
  try {
    


  } catch (error) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

module.exports = router
