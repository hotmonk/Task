const express =require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

var Seller = require('../models/sellerModel.js');
var Item = require('../models/itemModel.js');
var Sub_cat=require('../models/sub_catModel');
var Item_bid=require('../models/itemBidModel');
const sellerAuth = require('../middleware/sellerAuth.js');
var Vendor=require('../models/vendorModel.js');
var Transaction=require('../models/transactionModel.js');
var News_feed=require('../models/newsFeedModel.js');

function distance(lat1, lon1, lat2, lon2) {
  var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p))/2;

  var dist= 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  return dist;
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

router.post('/:id/getVendor',sellerAuth,function(req,res){
  var item_id=req.body.item_id;
  var seller_id=req.params.id;
  Item.findById(item_id).populate('item_bid').exec(function(err1,res1){
    if(err1){
      console.log(err1);
    }else{
      if(!res1.cust_id.equals(seller_id)){
        res.json({
          status:'fail',
          msg:'the item doesn\'t belong to you'
        })
        return;
      }
      var itembid=res1.item_bid;
      if(itembid.interested_vendor_id.length===0&&itembid.counter===itembid.vendor_id.length){
        res.json({
          status:'fail',
          msg:'No more vendors available'
        });
      }else if(itembid.interested_vendor_id.length===0){
        res.json({
          status:'fail',
          msg:'we will contact you as soon as we find more interested vendors'
        });
      }else{
        var price=itembid.interested_vendor_id[0].price;
        var vendor_id=itembid.interested_vendor_id[0].id;
        Seller.findById(seller_id,function(err2,res2){
          if(err2){
            console.log(err2);
          }else{
            Vendor.findById(vendor_id,function(err3,res3){
              if(err3){
                console.log(err3);
              }else{
                res.json({
                  price,
                  name:res3.name,
                  distance:distance(res2.latitude,res2.longitude,res3.latitude,res3.longitude)
                })
              }
            })
          }
        })
      }
    }
  })
})

router.post('/:id/vendorReject',sellerAuth,function(req,res){
  var item_id=req.body.item_id;
  var seller_id=req.params.id;
  Item.findById(item_id).populate('item_bid').exec(function(err1,res1){
    if(err1){
      console.log(err1);
    }else{
      if(!res1.cust_id.equals(seller_id)){
        res.json({
          status:'fail',
          msg:'the item doesn\'t belong to you'
        })
        return;
      }
      var newitembid=res1.item_bid;
      if(newitembid.interested_vendor_id.length===0){
        res.json({
          status:'fail',
          msg:'Invalid API Call'
        });
      }
      newitembid.interested_vendor_id.shift();
      newitembid.save(function(err0,res0){
        if(err0){
          console.log(err0);
        }else{
          var itembid=res0;
          if(itembid.interested_vendor_id.length===0&&itembid.counter===itembid.vendor_id.length){
            res.json({
              status:'fail',
              msg:'No more vendors available.Please request again.'
            });
          }else if(itembid.interested_vendor_id.length===0){
            res.json({
              status:'fail',
              msg:'we will contact you as soon as we find more interested vendors'
            });
          }else{
            var price=itembid.interested_vendor_id[0].price;
            var vendor_id=itembid.interested_vendor_id[0].id;
            Seller.findById(seller_id,function(err2,res2){
              if(err2){
                console.log(err2);
              }else{
                Vendor.findById(vendor_id,function(err3,res3){
                  if(err3){
                    console.log(err3);
                  }else{
                    res.json({
                      price,
                      name:res3.name,
                      distance:distance(res2.latitude,res2.longitude,res3.latitude,res3.longitude)
                    })
                  }
                })
              }
            })
          }
        }
      })
    }
  })
})

  //unchecked
router.post('/:id/vendorAccept',sellerAuth,function(req,res){
  var item_id=req.body.item_id;
  var seller_id=req.params.id;
  Item.findById(item_id).populate('item_bid').exec(function(err1,res1){
    if(err1){
      console.log(err1);
    }else{
      var itembid=res1.item_bid;
      if(itembid.interested_vendor_id.length===0){
        res.json({
          status:'fail',
          msg:'Invalid Api Call'
        });
      }
      else if(!res1.cust_id.equals(seller_id)){
        res.json({
          status:'fail',
          msg:'the item doesn\'t belong to you'
        })
      }
      else if(res1.status!=='INBID'){
        res.json({
          status:'fail',
          msg:"item already sold"
        })
        return;
      }
      res1.status='PAYMENT';
      res1.save(function(err2,res2){
        if(err2){
          console.log(err2);
        }else{
          var price=itembid.interested_vendor_id[0].price;
          var vendor_id=itembid.interested_vendor_id[0].id;
          const transaction=new Transaction({
            vendor:vendor_id,
            item:item_id,
            price:price
          });
          transaction.save()
            .then(trans=>{
              res2.transaction_id=trans._id;
              res2.item_bid=null;
              res2.save(function(err3,res3){
                if(err3){
                  console.log(err3);
                }else{
                  Vendor.findById(vendor_id,function(err4,res4){
                    if(err4){
                      console.log('adding transaction failed');
                      res.status(400).json({
                        status:'fail',
                        msg:"transaction failed"
                      })
                    }
                    res4.transactions.push(trans._id);
                    res4.save()
                      .then(res5=>{
                        Item_bid.findByIdAndDelete(itembid._id,function(err6){
                          if(err6){
                            console.log(err);
                          }else{
                            res.json({
                            msg:"vendor successfully selected"
                          })
                        }
                      })
                    })
                    .catch(error=>{
                      res.status(400).json(error)
                    })
                  })
                }
              });
            })
            .catch(err3=>{
              res.status(400).json(err3);
          })
        }          
      })
    }
  })
})
  
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
  const { name, email, contact, address, password ,longitude,latitude} = req.body;
  
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
        password,
        longitude,
        latitude
      });
      // Create salt & hash
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newSeller.password, salt, (err, hash) => {
          if(err) throw err;
          newSeller.password = hash;
          newSeller.save()
            .then(seller => {
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
                      _id: seller.id,
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
  
  //upload new item by customer
  ///checked
  ///change required
  router.post('/:id/items',sellerAuth, function(req, res){
    let newItem = new Item(req.body);
    newItem['cust_id']=req.params.id;
    newItem['status']="INBID";
    newItem.save()
        .then(savedItem => {
          Seller.findById(req.params.id,function(err,response){
            response.items.push(savedItem._id);
            response.save()
              .then(seller=>{
                Sub_cat.findById(req.body.sub_cat_id).populate({
                  path:'selectionHandle_id',
                  populate:{
                    path:'vendor_id'
                  }
                }).exec(function(err2,subcats){
                  if(err2){
                    console.log(err2);
                  }else{
                    var arr=subcats.selectionHandle_id;
                    // if(!arr||arr.length===0){
                    //   res.json({
                    //     msg:"sorry no current vendor is available"
                    //   });
                    // }else{
                      arr=arr.filter(handle=>{
                        return distance(seller.latitude,seller.longitude,handle.vendor_id.latitude,handle.vendor_id.longitude)<config.get('allowedRadius');
                      })
                      // if(arr.length===0){
                      //   res.json({
                      //     msg:"sorry no current vendor is available"
                      //   });
                      // }else{
                        var vendor_id=arr.map((item)=>{
                          return item.vendor_id._id;
                        })
                        var itemBid=new Item_bid({
                          item_id:savedItem._id,
                          vendor_id
                        })
                        itemBid.save(function(err3,savedbid){
                          if(err3){
                            console.log(err3);
                          }else{
                            savedItem.item_bid=savedbid._id;
                            savedItem.save(function(err4,saveditem){
                              if(err4){
                                console.log(err4);
                              }else{
                                arr=arr.map(item=>{
                                  News_feed.findById(item.vendor_id.newsFeed,function(err5,newsfeed){
                                    if(err5){
                                      console.log(err5);
                                    }else{
                                      newsfeed.items.push(savedItem._id);
                                      newsfeed.save(function(err6,res6){
                                        if(err6){
                                          console.log(err6);
                                        }else{
                                          return item;
                                        }
                                      });
                                    }
                                  })
                                  return item;
                                })
                                res.status(200).json({
                                  msg:"your item is added for sale and a vendor will soon contact you"
                                })
                              }
                            });
                          }
                        });
                    //  }
                    //}
                    
                  }
                })
              })
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
