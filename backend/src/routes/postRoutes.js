

const express = require('express');
const Post = require('../models/Post');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Utility function to handle try-catch
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Create a Post
router.post('/', authMiddleware, asyncHandler(async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required.' });
    }

    const newPost = new Post({ title, content, author: req.user.id });
    await newPost.save();
    res.status(201).json(newPost);
}));

// Get all Posts
router.get('/', asyncHandler(async (req, res) => {
    const posts = await Post.find().populate('author', 'username');
    res.json(posts);
}));

// Get a single Post by ID
router.get('/:id', asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
}));

// Update a Post
router.put('/:id', authMiddleware, asyncHandler(async (req, res) => {
    const { title, content } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user.id) {
        return res.status(403).json({ message: 'You are not authorized to update this post.' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    await post.save();
    res.json(post);
}));

// Delete a Post
router.delete('/:id', authMiddleware, asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user.id) {
        return res.status(403).json({ message: 'You are not authorized to delete this post.' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
}));

// Like a Post
router.put('/:id/like', authMiddleware, asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user.id;

    if (post.likes.includes(userId)) {
        post.likes.pull(userId);
    } else {
        post.likes.push(userId);
        post.dislikes.pull(userId); // Remove dislike if liked
    }

    await post.save();
    res.json({
        message: 'Like status updated.',
        likesCount: post.likes.length,
        dislikesCount: post.dislikes.length
    });
}));

// Dislike a Post
router.put('/:id/dislike', authMiddleware, asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user.id;

    if (post.dislikes.includes(userId)) {
        post.dislikes.pull(userId);
    } else {
        post.dislikes.push(userId);
        post.likes.pull(userId); // Remove like if disliked
    }

    await post.save();
    res.json({
        message: 'Dislike status updated.',
        likesCount: post.likes.length,
        dislikesCount: post.dislikes.length
    });
}));

// Check like/dislike status
router.get('/:id/status', authMiddleware, asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user.id;
    const liked = post.likes.includes(userId);
    const disliked = post.dislikes.includes(userId);

    res.json({
        liked,
        disliked,
        likesCount: post.likes.length,
        dislikesCount: post.dislikes.length
    });
}));

// Optional: Global error handler middleware for consistent format
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

module.exports = router;

