const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')
const Session = require('../models/session')

router.post('/', async(req, res, next) => {
  try {
    const body = req.body
    const user = await User.findOne({ where: { username: body.username } })
    const passwordCorrect = !!user

    if (!user) {
      return res.status(400).json({
        error: 'invalid username or password'
      })
    }

    if (user.disabled) {
      return res.status(400).json({
        error: 'user has been disabled'
      })
    }

    const userForToken = {
      username: user.username,
      id: user.id
    }

    const token = jwt.sign(userForToken, SECRET)
    await Session.create({ token, userId: user.id })

    res.status(200).send({ token, username: user.username, name: user.name })
  } catch(error) {
    next(error)
  }
})

module.exports = router