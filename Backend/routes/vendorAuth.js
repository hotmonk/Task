const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const vendorAuth = require('../middleware/vendorAuth');

const Vendor = require('../models/vendorModel');


/*
  @route : `POST` `/vendor/login`
  @desc  : login to the website as vendor
  @response format: {
      body: {
          // Contains data or errors
      }
  }
  @status codes:
      200:OK
      400:Bad Request
      401:Unauthorized
      404:Not Found
      500:Internal Server Error
*/
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
                    _id: vendor.id,
                    name: vendor.name,
                    email: vendor.email,
                    contact: vendor.contact,
                    address: vendor.address,
                    selection_id:vendor.selection_id
                }
              });
            });
        })
    })
});

/*
  @route : `GET` `/vendor/login/vendor`
  @desc  : get vendor data of the current vendor
  @response format: {
      body: {
          // Contains data or errors
      }
  }
  @status codes:
      200:OK
      400:Bad Request
      401:Unauthorized
      404:Not Found
      500:Internal Server Error
*/
router.get('/vendor', vendorAuth, (req, res) => {
  Vendor.findById(req.vendor.id)
    .select('-password')
    .then(vendor => res.json(vendor));
});

module.exports = router;
