// routes/posts.js

const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const Post = require('../models/Post');

// POST (Create data)
router.post('/', verifyToken, async (req, res) => {
    const postData = new Post({
        title: req.body.title,
        topics: req.body.topics,
        timestamp: new Date(),
        body: req.body.body,
        expirationTime: req.body.expirationTime,
        status: 'Live',
        owner: req.body.owner,
        likes: 0,
        dislikes: 0,
        comments: []
    });

    try {
        const savedPost = await postData.save();
        res.json(savedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET 1 (Read all)
router.get('/', verifyToken, async (req, res) => {
    try {
        const getPosts = await Post.find().limit(10);
        res.json(getPosts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET 2 (Read by ID)
router.get('/:postId', verifyToken, async (req, res) => {
    try {
        const getPostById = await Post.findById(req.params.postId);
        res.json(getPostById);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH (Update)
router.patch('/:postId', verifyToken, async (req, res) => {
    try {
        const updatePostById = await Post.updateOne(
            { _id: req.params.postId },
            {
                $set: {
                    title: req.body.title,
                    topics: req.body.topics,
                    body: req.body.body,
                    expirationTime: req.body.expirationTime,
                    owner: req.body.owner
                }
            }
        );
        res.json(updatePostById);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE (Delete)
router.delete('/:postId', verifyToken, async (req, res) => {
    try {
        const deletePostById = await Post.deleteOne({ _id: req.params.postId });
        res.json(deletePostById);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new comment to a specific post
router.post('/:postId/comments', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.comments.push(req.body.comment);
        const updatedPost = await post.save();
        res.status(201).json(updatedPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET comments for a specific post
router.get('/:postId/comments', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comments = post.comments;
        res.json({ comments });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});




module.exports = router;


