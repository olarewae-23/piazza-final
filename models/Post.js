

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    topics: [{
        type: String,
        enum: ['Politics', 'Health', 'Sport', 'Tech'],
        required: true,
    }],
    timestamp: {
        type: Date,
        default: Date.now,
    },
    body: {
        type: String,
        required: true,
    },
    expirationTime: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                // Check if the value is a valid date
                return !isNaN(value);
            },
            message: 'Invalid date format for expirationTime',
        },
    },
    status: {
        type: String,
        enum: ['Live', 'Expired'],
        default: 'Live',
    },
    owner: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default: 0,
    },
    comments: [{
        type: String,
    }],
});

module.exports = mongoose.model('Post', postSchema);
