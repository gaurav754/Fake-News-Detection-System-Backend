const router = require('express').Router()
const jwt = require('jsonwebtoken')
const Post = require('../models/Post')
const User = require('../models/User')
const { sendFakeNewsAlert } = require('../utils/mailer')

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Unauthorized' })
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
}

router.get('/', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 })
  res.json(posts)
})

router.post('/', auth, async (req, res) => {
  try {
    const { title, description, source } = req.body
    if (!title || !description) return res.status(400).json({ message: 'Title and description required' })
    const post = await Post.create({ title, description, source, postedBy: req.user.name })
    res.status(201).json(post)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

router.patch('/:id/upvote', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ message: 'Post not found' })
    if (post.upvotedBy.includes(req.user.id))
      return res.status(400).json({ message: 'Already upvoted' })
    post.upvotes += 1
    post.upvotedBy.push(req.user.id)
    await post.save()

    if (post.upvotes === 1) {
      const users = await User.find({}, 'email')
      const emails = users.map(u => u.email)
      sendFakeNewsAlert(emails, post).catch(console.error)
    }

    res.json(post)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

router.patch('/:id/downvote', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ message: 'Post not found' })
    if (post.downvotedBy.includes(req.user.id))
      return res.status(400).json({ message: 'Already downvoted' })
    post.downvotes += 1
    post.downvotedBy.push(req.user.id)
    await post.save()
    res.json(post)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
