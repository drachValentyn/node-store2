const express = require("express");
const router = express.Router();
const passport = require("passport");
require("../config/passport")(passport);

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const stripe = require('stripe')(stripeSecretKey);

router.post('/', function(req, res) {

  const newCharge = {
    amount: req.body.amount,
    currency: "usd",
    source: req.body.source.id,
    receipt_email: req.body.email,
    shipping: {
      name: req.body.name,
      address: {
        line1: req.body.address.street,
        city: req.body.address.city,
      }
    }
  };

  stripe.charges.create(newCharge, function(err, charge) {
    if (err){
      console.error(err);
      res.json({ error: err, charge: false });
    } else {
      res.json({ error: false, charge: charge });
    }
  });

});

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
