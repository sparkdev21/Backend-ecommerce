require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
//process stripe payment
const processPayment = async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "usd",
    metadata: {
      integration_check: "accept_a_payment",
    },
  });
  res.json({ success: true, client_secret: paymentIntent.client_secret });
};

//send stripe api key
const sendStripeAPI = async (req, res) => {
  res.json({ stripeAPIkey: process.env.STRIPE_API_KEY });
};

module.exports = {
  processPayment,
  sendStripeAPI,
};
