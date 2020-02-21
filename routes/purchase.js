const express = require("express");
const router = express.Router();
const passport = require("passport");
require("../config/passport")(passport);

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
const stripe = require('stripe')(stripeSecretKey);


router.post('/', function(req, res) {

  const newCharge = {
    amount: 23500,
    currency: "usd",
    source: req.body.token_from_stripe, // obtained with Stripe.js on the client side
    description: req.body.specialNote,
    receipt_email: req.body.email,
    shipping: {
      name: req.body.name,
      address: {
        line1: req.body.address.street,
        city: req.body.address.city,
        state: req.body.address.state,
        postal_code: req.body.address.zip,
        country: 'US'
      }
    }
  };

  // Call the stripe objects helper functions to trigger a new charge
  stripe.charges.create(newCharge, function(err, charge) {
    // send response
    if (err){
      console.error(err);
      res.json({ error: err, charge: false });
    } else {
      // send response with charge data
      res.json({ error: false, charge: charge });
    }
  });

});

// Route to get the data for a charge filtered by the charge's id
router.get('/:id', function(req, res){
  stripe.charges.retrieve(req.params.id, function(err, charge) {
    if (err){
      res.json({ error: err, charge: false });
    } else {
      res.json({ error: false, charge: charge });
    }
  });
});

module.exports = router;
