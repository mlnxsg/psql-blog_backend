const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const Session = require('../models/session')
const User = require('../models/user')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)

      const session = await Session.findOne({ where: { token: authorization.substring(7) } })
      if (!session) {
        return res.status(401).json({ error: 'session expired' })
      }

      const user = await User.findByPk(session.userId)
      if (user.disabled) {
        return res.status(401).json({ error: 'user has been disabled' })
      }
    } catch(error) {
      return res.status(401).json({ error: 'invalid token'})
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = { tokenExtractor }