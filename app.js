const express = require('express');
const app = express();

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');

app.use(bodyParser.json());

const verifyToken = require('./middleware/verifyToken');

const postsRoute = require('./routes/posts');

app.use('/api/posts', verifyToken, postsRoute);

const authRoute = require('./routes/auth');

app.use('/api/user', authRoute);

mongoose.connect(process.env.DB_CONNECTOR).then(() => {
    console.log('Your MongoDB connector is on...');
});

app.listen(3006, () => {
    console.log('Server is running on port 3004');
});
