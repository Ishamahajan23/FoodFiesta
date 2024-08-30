const express = require('express');
const dotenv = require('dotenv');
const paymentRoutes = require('./routes/payment');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/payments', paymentRoutes);

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
