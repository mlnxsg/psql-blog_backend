const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')

router.post('/', async(req, res, next) => {
  try {
    const body = req.body
    const user = await User.findOne({ where: { username: body.username } })
    const passwordCorrect = body.password === 'secret'

    if (!user && ! passwordCorrect) {
      return res.status(400).json({
        error: 'invalid username or password'
      })
    }

    const userForToken = {
      username: user.username,
      id: user.id
    }

    const token = jwt.sign(userForToken, SECRET)

    res.status(200).send({ token, username: user.username, name: user.name })
  } catch(error) {
    next(error)
  }
})

module.exports = router