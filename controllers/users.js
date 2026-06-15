const router = require('express').Router()

const { User } = require('../models')
const { Blog } = require('../models')

router.post('/', async(req, res, next) => {
  try {
    const { username, name } = req.body
    const user = await User.create({ username, name })
    res.json(user)
  } catch(error) {
    next(error)
  } 
})

router.get('/', async(req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog
    }
  })
  res.json(users)
})

router.put('/:username', async(req, res, next) => {
  try {
    const user = await User.findOne({ where: { username: req.params.username } })
    if (user) {
      user.username = req.body.username
      await user.save()
      res.json(user)
    } else {
      res.status(404).end()
    }
  } catch(error) {
    next(error)
  }
})

module.exports = router