const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/sellerAuth');

const Seller = require('../models/sellerModel');

// @route   POST api/auth
// @desc    Auth user
// @access  Public
//checked
router.post('/', (req, res) => {
  const { email, password } = req.body;

  if(!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  Seller.findOne({ email })
    .then(seller => {
      if(!seller) return res.status(400).json({ msg: 'Seller Does not exist' });
      
      bcrypt.compare(password, seller.password)
        .then(isMatch => {
          if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

          jwt.sign(
            { id: seller.id },
            config.get('jwtSecretseller'),
            { expiresIn: 36000000 },
            (err, token) => {
              if(err) throw err;

              res.json({
                token,
                seller: {
                    _id: seller.id,
                    name: seller.name,
                    email: seller.email,
                    contact: seller.contact,
                    address: seller.address
                  }
              });
            })
            console.log('seller.id: ' + seller.id);
        })
    })
});

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/seller', auth, (req, res) => {
  Seller.findById(req.seller.id)
    .select('-password')
    .then(seller => res.json(seller));
});

module.exports = router;
