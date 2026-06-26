const router = require('express').Router()
const { Op } = require('sequelize')

const { Blog } = require('../models')
const { User } = require('../models')
const { tokenExtractor } = require('../middleware/token')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) {
    return res.status(404).end()
  }
  next()
}

router.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${req.query.search}%` } }, 
      { author: { [Op.iLike]: `%${req.query.search}%` } }
    ]
  }

  const blogs = await Blog.findAll({
    order: [
      ['likes', 'DESC']
    ],
    include: {
      model: User
    },
    where
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body)
    return res.json(blog)
  } catch(error) {
    next(error)
  }
})

router.delete('/:id', tokenExtractor, blogFinder, async (req, res, next) => {
  try {
    await req.blog.destroy()
    return res.status(204).end()
  } catch (error) {
    next(error)
  }
})

router.put('/:id', blogFinder, async( req, res, next) => {
  try {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } catch(error) {
    next(error)
  }
})

module.exports = router
