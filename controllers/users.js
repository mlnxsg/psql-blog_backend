const router = require('express').Router()

const { User, ReadingList } = require('../models')
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

router.get('/:id', async (req, res) => {
  const where = {}

  if (req.query.read !== undefined) {
    where.read = req.query.read === 'true'
  }

  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
    include: {
      model: Blog,
      as: 'readings',
      attributes: { exclude: ['createdAt', 'updatedAt', 'userId'] },
      through: {
        attributes: ['id', 'read'],
        as: 'reading_list',
        where
      }
    }
  })
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
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