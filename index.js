const express = require('express');
const mongoose = require('mongoose');
const { router: authRoutes, auth } = require('./routes/auth');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Protected Route Example
app.get('/api/protected', auth, (req, res) => {
    res.send('This is a protected route');
});

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`));
    })
    .catch(err => console.error(err));
