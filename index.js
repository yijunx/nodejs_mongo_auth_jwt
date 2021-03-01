const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config();
// Import routes
const authRoute = require('./routes/auth');
const postsRoute = require('./routes/posts');

// Connect to db
mongoose.connect(
    process.env.DB_CONNECT,
    { useUnifiedTopology: true, useNewUrlParser: true },
    () => console.log('connected to db')
);

// parse body middleware
app.use(express.json());
// Route middleware
app.use('/api/user', authRoute);
app.use('/api/posts', postsRoute)

// Listen!
app.listen(3000, () => console.log('server up and running'));

