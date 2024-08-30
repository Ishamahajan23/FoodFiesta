const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');

// Create a Payment Intent and store the payment info in the database
router.post('/create-payment-intent', async (req, res) => {
    const { userId, amount, currency } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Amount in the smallest currency unit
            currency: currency,
        });

        const payment = new Payment({
            user: userId,
            amount: amount,
            currency: currency,
            paymentIntentId: paymentIntent.id,
            status: 'Pending'
        });

        await payment.save();

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentId: payment._id
        });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Confirm Payment and update the payment status in the database
router.post('/confirm-payment', async (req, res) => {
    const { paymentIntentId } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);

        let payment = await Payment.findOne({ paymentIntentId });

        if (!payment) {
            return res.status(404).json({ msg: 'Payment not found' });
        }

        if (paymentIntent.status === 'succeeded') {
            payment.status = 'Succeeded';
        } else {
            payment.status = 'Failed';
        }

        await payment.save();

        res.json({ success: payment.status === 'Succeeded', payment });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
