const { Router } = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const { User } = require('../db/models') 
const router = Router()
const uuid = require('uuid')
const mailService = require('../service/mail-service')
const tokenService = require('../service/token-service')
const userService = require('../service/user-service')
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
      const candidate = await User.findOne({where: { email }})
      if(candidate) {
        return res.status(400).json({ message: 'Такой пользователь уже существует!' })
      }
      const hashedPassword = await bcrypt.hashSync(password, 7)
      const activationLink = uuid.v4()
      const user = await User.create({ email, password: hashedPassword, activationLink })
      await mailService.sendActivationMail(email, `${process.env.API_URL}/api/auth/activate/${activationLink}`)
      const tokens = tokenService.generateTokens({
        email: user.email,
        id: user.id,
        isActivation: user.isActivation
      })
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
      const tokens = tokenService.generateTokens({
        email: user.email,
        id: user.id,
        isActivation: user.isActivation
      })
      await tokenService.saveToken( user.id, tokens.refreshToken)


      // const token = jwt.sign(
      //   { userId: user.id },
      //   process.env.JWT_SECRET,
      //   { expiresIn: '1h' }
      // )

      // res.json({ token, userId: user.id })
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

// /api/auth/logout

router.post('/logout', async (req, res) => {
  try {

    const {refreshToken} = req.cookies
    const token = await userService.logout(refreshToken) 
    res.clearCookie('refreshToken')
    return res.json(token)

  } catch (error) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// /api/auth/activate/kalsdi
router.get('/activate/:link', async (req,res) => {
  try {
    const activationLink = req.params.link
    await userService.activate(activationLink)
    return res.redirect(process.env.CLIENT_URL)

  } catch (error) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// /api/auth/refresh
router.get('/refresh', async (req,res) => {
  try {
    const {refreshToken} = req.cookies

    if(!refreshToken) {
      return res.status(401).json({ message: 'Нет авторизации' })
    }
    const userData = await userService.refresh( refreshToken )

    if (userData === 'authError') {
      return res.status(401).json({ message: 'Нет авторизации' })
    }

    res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
    res.status(201).json(userData)

  } catch (error) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

module.exports = router
