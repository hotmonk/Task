const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/vendorAuth');

const Vendor = require('../models/vendorModel');

// @route   POST api/auth
// @desc    Auth user
// @access  Public
router.post('/', (req, res) => {
  const { email, password } = req.body;

  if(!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  // Check for existing user
  Vendor.findOne({ email })
    .then(vendor => {
      if(!vendor) return res.status(400).json({ msg: 'Vendor Does not exist' });

      // Validate password
      bcrypt.compare(password, vendor.password)
        .then(isMatch => {
          if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

          jwt.sign(
            { id: vendor.id },
            config.get('jwtSecretvendor'),
            { expiresIn: 3600 },
            (err, token) => {
              if(err) throw err;
              res.json({
                token,
                vendor: {
                    id: vendor.id,
                    name: vendor.name,
                    email: vendor.email,
                    contact: vendor.contact,
                    address: vendor.address
                }
              });
            });
            console.log(vendor.id);
        })
    })
});

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/vendor', auth, (req, res) => {
  Vendor.findById(req.vendor.id)
    .select('-password')
    .then(vendor => res.json(vendor));
});

module.exports = router;
