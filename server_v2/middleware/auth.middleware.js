// const jwt = require('jsonwebtoken')
const tokenService = require('../service/token-service')
require('dotenv').config()

module.exports = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next()
  }

  try {
    const token = req.headers.authorization.split(' ')[1] // Bearer TOKEN
    
    if(!token) {
      return res.status(401).json({ message: 'Нет авторизации' })
    }
    
    // const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
    const decoded = await tokenService.validateAccessToken(token)
    if(!decoded) {
      return res.status(401).json({ message: 'Нет авторизации' })
    }
    req.user = decoded
    next()
    
  } catch (error) {
    res.status(401).json({ message: 'Нет авторизации' }) 
  }

}
