const router = require('express').Router()

const { ReadingList, Blog, User } = require('../models')
const { tokenExtractor } = require('../middleware/token')

router.post('/', async (req, res, next) => {
  try {
    const { blogId, userId } = req.body

    const blog = await Blog.findByPk(blogId)
    const user = await User.findByPk(userId)
    const existing = await ReadingList.findOne({ where: { blogId, userId } })
    if (!blog) {
      return res.status(404).json({ error: `Blog with id ${blogId} not found` })
    }
    if (!user) {
      return res.status(404).json({ error: `User with id ${userId} not found` })
    }
    if (existing) {
      return res.status(400).json({ error: 'Blog already in reading list' })
    }

    const readingListItem = await ReadingList.create({ blogId, userId })
    res.status(201).json({
      id: readingListItem.id,
      blog_id: readingListItem.blogId,
      user_id: readingListItem.userId,
      read: readingListItem.read
    })
  } catch (error) {
    next(error)
  }
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const readingListItem = await ReadingList.findByPk(req.params.id)

    if (!readingListItem) {
      return res.status(404).json({ error: 'Reading list item not found' })
    }

    if (readingListItem.userId !== req.decodedToken.id) {
      return res.status(401).json({ error: 'No permission to modify this item' })
    }

    readingListItem.read = req.body.read
    await readingListItem.save()

    res.json(readingListItem)
  } catch (error) {
    next(error)
  }
})

module.exports = router