// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { registerValidation, loginValidation } = require('../validations/validation');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registration route
router.post('/register', async (req, res) => {
    try {
        // Validation 1 to check user input
        const { error } = registerValidation(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });

        // Validation 2 to check if user exists
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) return res.status(400).send({ message: 'User already exists' });

        // Create a hashed representation of the password
        const salt = await bcryptjs.genSalt(10); // Increased salt rounds for security
        const hashedPassword = await bcryptjs.hash(req.body.password, salt);

        // Create a new user
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        // Save the new user
        const savedUser = await user.save();

        // Create and assign a token
        const token = jwt.sign({ _id: savedUser._id }, process.env.TOKEN_SECRET);
        res.header('auth-token', token).send({ token });
    } catch (err) {
        console.error('Error during user registration:', err);
        res.status(500).send({ message: 'An error occurred during registration' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        // Validation 1 to check user input
        const { error } = loginValidation(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });

        // Validation 2 to check if user exists
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send({ message: 'User does not exist' });

        // Validation 3 to check user password
        const passwordValidation = await bcryptjs.compare(req.body.password, user.password);
        if (!passwordValidation) return res.status(400).send({ message: 'Password is wrong' });

        // Generate an auth-token
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
        res.header('auth-token', token).send({ token });
    } catch (err) {
        console.error('Error during user login:', err);
        res.status(500).send({ message: 'An error occurred during login' });
    }
});

module.exports = router;
