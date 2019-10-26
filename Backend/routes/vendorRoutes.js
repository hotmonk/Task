const express =require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

var Vendor = require('../models/vendorModel.js');
var Item = require('../models/itemModel.js');
var Transaction = require('../models/transactionModel.js');
var Cat = require('../models/catModel.js');
var Sub_cat = require('../models/sub_catModel.js');
var Cat_request = require('../models/cat_requestModel.js');
const vendorAuth = require('../middleware/vendorAuth.js');

///VENDOR ROUTES
///checked
router.post('/signUp', function(req, res) {
    const { name, email, contact, address, password } = req.body;
  
    if(!name || !email || !contact || !address || !password) 
    {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }
  
    // Check for existing user
    //checked
    Vendor.findOne({ email })
      .then(vendor => {
        if(vendor) return res.status(400).json({ msg: 'Vendor with the given email already exists' });
  
        const newVendor = new Vendor({
          name,
          email,
          contact,
          address,
          password
        });
  
        // Create salt & hash
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newVendor.password, salt, (err, hash) => {
            if(err) throw err;
            newVendor.password = hash;
            newVendor.save()
              .then(vendor => {
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
                  }
                )
              });
          })
        })
      })
  });  

  ///unchecked
  router.post('/:id/addselections',vendorAuth,function(req,res){
    Vendor.findById(req.params.id,function(err,vendor){
      if(err){
        console.log("vendor finding process failed");
      }else{
        if(vendor.selection_id){
          Selection.findById(vendor.selection_id,function(err,selectionList){
            if(err){
              console.log("finding of selection failed");
            }else{
                if(req.body.intake&&req.body.intake.length){
                  var saturated=req.body.intake.map(request=>{
                      if(!(selectionList.intake.includes(request.subcat_id))){
                          selectionList.intake.push(request.subcat_id);
                          Sub_cat.findById(request.subcat_id,function(err,subcategory){
                            if(err){
                              console.log(err);
                            }else{
                              subcategory.selection_data.push(request);
                              subcategory.save(function(err,savedsub){
                                if(err){
                                  console.log(err);
                                }else{
                                  return "added subcategory to selection "+savedsub.name ;
                                }
                              });
                            }
                          })
                      }
                  });
                  selectionList.save(function(err,final){
                    if(err){
                      console.log(err);
                    }else{
                      res.json({
                        msg:"added selected subcat to list",
                        items:final
                      })
                    }
                  })
                }
            }
          })
        }else{
          var selection=new Selection({
            vendor_id:vendor._id
          });
          selection.save(function(err,selectionList){
            if(err){
              console.log(err);
            }else{
              vendor.selection_id=selectionList._id;
              vendor.save(function(err,vendor2){
                if(req.body.intake&&req.body.intake.length){
                  var saturated=req.body.intake.map(request=>{
                        selectionList.intake.push(request.subcat_id);
                        Sub_cat.findById(request.subcat_id,function(err,subcategory){
                          if(err){
                            console.log(err);
                          }else{
                            subcategory.selection_data.push(request);
                            subcategory.save(function(err,savedsub){
                              if(err){
                                console.log(err);
                              }else{
                                return "added subcategory to selection "+savedsub.name ;
                              }
                            });
                          }
                        })
                  });
                  selectionList.save(function(err,final){
                    if(err){
                      console.log(err);
                    }else{
                      res.json({
                        msg:"added selected subcat to list",
                        items:final
                      })
                    }
                  })
                }
              })
            }
          })
        }
      }
    })
  })
  
  
  //vendor profile
  ///add new item to buy list
  ///checked
  router.post('/:id/transaction',vendorAuth,function(req,res){
      var vendor_id=req.params.id;
      var item_id=req.body.item_id;
      var price=req.body.price;
      const transaction=new Transaction({
        vendor:vendor_id,
        item:item_id,
        price:price
      });
      Item.findById(item_id,function(err1,res1){
        if(err1){
          res.status(400).json(err1);
        }
        if(res1.status==='sold'){
          res.json({
            msg:"item already sold"
          })
        }
        res1.status='sold';
        res1.save(function(err2,res2){
          if(err2){
            res.status(400).json(err2);
          }
          transaction.save()
            .then(trans=>{
              Vendor.findById(vendor_id,function(err4,res4){
                if(err4){
                  console.log('adding transaction failed');
                  res.status(400).json({
                    msg:"transaction failed"
                  })
                }
                res4.transactions.push(trans._id);
                res4.save()
                  .then(res5=>{
                    console.log("transaction added"),
                    res.json({
                      msg:"item added"
                    })
                  })
                  .catch(error=>{
                    res.status(400).json(error)
                  })
              })
            })
            .catch(err3=>{
              res.status(400).json(err3);
            })
        })
      })
  })
  
  ///fetch all purchased items
  router.get('/:id/viewBuyedItem',vendorAuth,function(req,res){
    
    Vendor.findById(req.params.id).populate({ 
      path: 'transactions',
      populate: {
        path: 'item',
        model: 'Item',
        populate: [{
          path: 'cat_id',
          model: 'Cat'
        },{
          path:'sub_cat_id',
          model:'Sub_cat'
        }]
      },
    })
    .exec(function(err, response) {
      if(err)
      {
          console.log(err);
      } 
      else 
      {
        var filtered=response.transactions.filter(transaction=>{
            return (transaction.item.status==='sold');
        });
        filtered=filtered.map(trans=>{
          return trans.item
        })
        res.json(filtered);
      }
    });
  });
  
  router.get('/newsfeed', vendorAuth, function(req, res){
    Item.find({}).populate([{
      path: 'cat_id',
      model: 'Cat'
    },{
      path:'sub_cat_id',
      model:'Sub_cat'
    }])
    .exec(function(err, allItems){
      if(err)
      {
          console.log(err);
      } 
      else 
      {
        var filtered=allItems.map(item=>{
          return {
            id: item._id,
            cat: item.cat_id,
            subcat: item.sub_cat_id,
            quantity: item.quantity,
            image: item.image,
            status:item.status
          }
        });
        console.log(filtered);
        filtered=filtered.filter((item)=>{
            return item.status=='inBid';
        })
        res.json(filtered);
      }
   });
  })
  ///checked
  router.get('/:id', vendorAuth, function(req, res){
    Vendor.findById(req.params.id, function(err, foundVendor){
      if(err)
      {
        console.log(err);
      }
      else
      {
        res.json(foundVendor);
      }
    })
  })
  
  
  ///new category request
  router.post('/newWasteType', vendorAuth, function(req, res){
    let request = new Cat_request(req.body);
    request.vendor_id =req.vendor.id;
    Cat.findOne({name:req.body.cat_name},function(err,category){
        if(err)
        {
          console.log(err);
        }
        else
        {
          let newSubCat = new Sub_cat({name: req.body.sub_cat_name, quantity_type: req.body.quantity_type});
          if(category)
          {
            newSubCat.save()
              .then(newSubCat => {
                category.sub_cats.push(newSubCat);
                category.save();
                request.save()
                  .then(request => {
                      res.status(200).json({request: 'request and sub-category added successfully'});
                  })
                  .catch(err => {
                      res.status(400).send('adding new request failed');
                  });
               // res.status(200).json({sub_cat: 'sub-category added successfully'});
            })
            .catch(err => {
                res.status(400).send('adding new sub-category failed');
            });
          }
          else
          {
            let newCat = new Cat({name: req.body.cat_name});
            newCat.save()
              .then(newCat => {
                newSubCat.save()
                    .then(newSubCat => {
                      newCat.sub_cats.push(newSubCat);
                      newCat.save();
                      request.save()
                        .then(request => {
                            res.status(200).json({request: 'request, category and sub-category added successfully'});
                        })
                        .catch(err => {
                            res.status(400).send('adding new request failed');
                        });
                     // res.status(200).json({sub_cat: 'sub-category and category added successfully'});
                  })
                  .catch(err => {
                      res.status(400).send('adding new sub-category failed');
                  });
                  //res.status(200).json({newCat: 'seller added successfully'});
              });
              // .catch(err => {
              //     res.status(400).send('adding new Category failed');
              // });
          }
        }
    });
  });

  
module.exports = router;