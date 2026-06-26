const router = require('express').Router()

const { Blog, User, ReadingList, Session } = require('../models')

router.post('/', async (req, res) => {
  await Blog.destroy({ where: {}, truncate: true, cascade: true })
  await User.destroy({ where: {}, truncate: true, cascade: true })
  await ReadingList.destroy({ where: {}, truncate: true, cascade: true })
  await Session.destroy({ where: {}, truncate: true, cascade: true })

  res.status(204).end()
})

module.exports = router