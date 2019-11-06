const express =require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

var Seller = require('../models/sellerModel.js');
var Item = require('../models/itemModel.js');
var Sub_cat=require('../models/sub_catModel');
const sellerAuth = require('../middleware/sellerAuth.js');
var Vendor=require('../models/vendorModel.js');

function distance(lat1, lon1, lat2, lon2) {
  var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p))/2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

router.get('/:id/viewItem',sellerAuth,function(req,res){
    Seller.findById(req.params.id).populate({ 
      path: 'items',
      populate: [{
        path: 'cat_id',
        model: 'Cat'
      },{
        path:'sub_cat_id',
        model:'Sub_cat'
      }]
  })
  .exec(function(err, response) {
    if(err)
    {
        console.log(err);
    } 
    else 
    {
      var filtered=response.items.filter((item)=>{
          return (item.status==='INBID');
      });
      res.json(filtered);
    }
  });
  });
  
  ///checked
  router.get('/:id/viewSelledItem',sellerAuth,function(req,res){
      Seller.findById(req.params.id).populate({ 
        path: 'items',
        populate: [{
          path: 'cat_id',
          model: 'Cat'
        },{
          path:'sub_cat_id',
          model:'Sub_cat'
        },{
          path:'transaction_id',
          model:'Transaction'
        }]
    })
    .exec(function(err, response) {
      if(err)
      {
          console.log(err);
      } 
      else 
      {
        var filtered=response.items.filter((item)=>{
            return (item.status!=='INBID');
        });
        res.json(filtered);
      }
    });
  });

  ///save rating by a seller for vendor
  router.post('/:id/saveRating',sellerAuth,function(req,res){
    Transaction.findById(req.body.transaction_id,function(err,transaction){
      if(err){
        console.log("transaction finding failed",err);
      }else{
        transaction.rating=req.body.rating;
        transaction.save(function(err2,savedTransaction){
          if(err2){
            console.log(err2);
          }else{
            Item.findById(savedTransaction.item,function(err3,item){
                if(err3){
                  console.log(err3);
                }else{
                  item.status='DONE';
                  item.save(function(err4){
                    if(err4){
                      console.log(err4);
                    }else{
                      res.json({
                        msg:"ratings saved successfully"
                      })
                    }
                  });
                }
            })
          }
        })
      }
      
    })
});
  
  ///checked
  router.post('/signUp', function(req, res) {
    const { name, email, contact, address, password } = req.body;
  
    // Simple validation
    if(!name || !email || !contact || !address || !password) 
    {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }
  
    // Check for existing user
    Seller.findOne({ email })
      .then(seller => {
        if(seller) return res.status(400).json({ msg: 'Seller with the given email already exists' });
  
        const newSeller = new Seller({
          name,
          email,
          contact,
          address,
          password
        });
  
        // Create salt & hash
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newSeller.password, salt, (err, hash) => {
            if(err) throw err;
            newSeller.password = hash;
            newSeller.save()
              .then(seller => {
                console.log(seller);
                jwt.sign(
                  { id: seller.id },
                  config.get('jwtSecretseller'),
                  { expiresIn: 3600 },
                  (err, token) => {
                    if(err){
                      console.log(err);
                      throw err;
                    } 
                    res.json({
                      token,
                      seller: {
                        id: seller.id,
                        name: seller.name,
                        email: seller.email,
                        contact: seller.contact,
                        address: seller.address
                      }
                    });
                  }
                )
              })
              .catch(err=>{
                res.status(400).json({ msg: 'seller signup failed' });
              })
          })
        })
      })
  });  
  
  //seller profile
  //checked
  router.get('/:id', sellerAuth, function(req, res){
    Seller.findById(req.params.id).populate("items").exec(function(err, foundSeller){
      if(err)
      {
        console.log(err);
      }
      else
      {
        res.json(foundSeller);
      }
    })
  })
  
  function compareit(a,b){

  }
  //upload new item by customer
  ///checked
  router.post('/:id/items',sellerAuth, function(req, res){
    let newItem = new Item(req.body);
    newItem['cust_id']=req.params.id;
    newItem['status']="INBID";
    newItem.save()
        .then(Item => {
          Seller.findById(req.params.id,function(err,response){
            response.items.push(Item._id),
            response.save()
              .then(seller=>{
                // Sub_cat.findById(req.body.sub_cat_id).populate({
                //   path:'selectionHandle_id',
                //   populate:{
                //     path:'vendor_id'
                //   }
                // }).exec(function(err2,subcats){
                //   if(err2){
                //     console.log(err2);
                //   }else{
                //     var arr=subcats.selectionHandle_id;
                //     arr=arr.filter(handle=>{
                //       return distance(seller.latitude,seller.longitude,handle.vendor_id.latitude,handle.vendor_id.longitude)<5;
                //     })
                //     arr.sort((a,b)=>{
                //       if(a.price>b.price){
                //         return -1;
                //       }else if(a.price<b.price){
                //         return 1;
                //       }
                //       return 0;
                //     })
                //     console.log(arr);
                //   }
                // })
                res.status(200).json({newItem: 'Item added successfully by Customer'});            })
              .catch(err=>{
                console.log(err)
                res.status(400).send('adding new item failed');
              })
          })
        })
        .catch(err => {
          res.status(400).send('adding new item failed');
        })
  });

  
module.exports = router;