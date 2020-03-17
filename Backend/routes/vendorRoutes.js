const express =require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const fs = require('fs');

var Vendor = require('../models/vendorModel.js');
var Item = require('../models/itemModel.js');
var Item_bid = require('../models/itemBidModel.js');
var Transaction = require('../models/transactionModel.js');
var Cat = require('../models/catModel.js');
var Sub_cat = require('../models/sub_catModel.js');
var SelectionHandler=require('../models/selectionHandleModel.js');
var Selection=require('../models/selectionModel.js');
var Cat_request = require('../models/cat_requestModel.js');
const vendorAuth = require('../middleware/vendorAuth.js');
var News_feed=require('../models/newsFeedModel.js');
var Quote=require('../models/quoteModel.js');

/*
  @route : `POST` `/vendor/signUp`
  @desc  : signup to the website as vendor
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
router.post('/signUp', function(req, res) {
    const { name, email, contact, address, password ,longitude,latitude} = req.body;
  
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
          password,
          longitude,
          latitude,
          defaulter:false,
          defaulterAmount:0
        });
  
        // Create salt & hash
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newVendor.password, salt, (err, hash) => {
            if(err) throw err;
            newVendor.password = hash;
            newVendor.save()
              .then(vendor2 => {
                var selection=new Selection({
                  vendor_id:vendor2._id
                });
                var newnewsfeed=new News_feed({	
                  vendor_id:vendor2._id	
                })
                selection.save(function(err2,selected){
                  if(err2){
                    console.log(err2);
                  }else{
                    newnewsfeed.save(function(err3,newsfeedsaved){	
                      vendor2.selection_id=selected._id;	
                      vendor2.newsFeed=newsfeedsaved._id;	
                      vendor2.save(function(err4,savedVendor){	
                          if(err4){	
                            console.log(err4);	
                          }else{	
                            jwt.sign(	
                              { id: vendor2.id },	
                              config.get('jwtSecretvendor'),	
                              { expiresIn: 3600 },	
                              (err, token) => {	
                                if(err) throw err;	
                                res.json({	
                                  token,	
                                  vendor: {	
                                    _id: vendor2.id,	
                                    name: vendor2.name,	
                                    email: vendor2.email,	
                                    contact: vendor2.contact,	
                                    address: vendor2.address,	
                                    selection_id:selected._id	
                                  }	
                                });	
                              });	
                          }	
                      });	
                    })
                  }
                });
              });
          })
        })
      })
  });  

/*
  @route : `DELETE` `/vendor/selections/:selectionHandlerid`
  @desc  : delete any category preferance
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
  router.delete('/selections/:selectionHandlerid',vendorAuth,function(req,res){
      SelectionHandler.findById(req.params.selectionHandlerid,function(err,selectionHandler){
        if(err){
          console.log(err);
        }else{
          var subcatid=selectionHandler.subcat_id;
          var selectionid=selectionHandler.selection_id;
          Sub_cat.findById(subcatid,function(err2,subcat){
            if(err2){
              console.log(err2);
            }else{
              SelectionHandler.findByIdAndDelete(req.params.selectionHandlerid,function(err3){
                if(err3){
                  console.log(err3);
                }else{
                  var filtered=subcat.selectionHandle_id;
                  filtered=filtered.filter(query=>{
                    return !query.equals(req.params.selectionHandlerid);
                  })
                  subcat.selectionHandle_id=filtered;
                  subcat.save(function(err4){
                    if(err4){
                      console.log(err4);
                    }else{
                      Selection.findById(selectionid,function(err5,selection){
                        if(err5){
                          console.log(err5);
                        }else{
                          var filtered=selection.intake;
                          filtered=filtered.filter(query=>{
                            return !query.equals(req.params.selectionHandlerid);
                          })
                          selection.intake=filtered;
                          selection.save(function(err6){
                            if(err6){
                              console.log(err6);
                            }else{
                              Selection.findById(selectionid).populate({
                                path:'intake',
                                model:'SelectionHandler',
                                populate:{
                                  path:'subcat_id',
                                  model:'Sub_cat',
                                  populate:{
                                    path:'cat_id',
                                    model:'Cat'
                                  }
                                }
                              }).exec(function(err7,selectionList){
                                if(err7){
                                  console.log(err7);
                                }else{
                                  res.json(selectionList.intake);
                                }
                              })
                            }
                          })
                        }
                      })
                    }
                  })
                }
              });

            }
          })
        }
      })
  })

/*
  @route : `GET` `/vendor/selections/:selectionid`
  @desc  : fetch all desired categories PREFERENCES OF VENDOR
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
  router.get('/selections/:selectionid',vendorAuth,function(req,res){
    Selection.findById(req.params.selectionid).populate({
      path:'intake',
      model:'SelectionHandler',
      populate:{
        path:'subcat_id',
        model:'Sub_cat',
        populate:{
          path:'cat_id',
          model:'Cat'
        }
      }
    }).exec(function(err,selectionList){
      if(err){
        console.log(err);
      }else{
        res.json(selectionList.intake);
      }
    })
  });


 /*
  @route : `POST` `/vendor/selections/:selectionid`
  @desc  : Add new wanted category to selectionlist for preferance
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
  router.post('/selections/:selectionid',vendorAuth,function(req,res){
    Selection.findById(req.params.selectionid).populate('intake').exec(function(err2,selectionList){
      if(err2){
        console.log("finding of selection failed" + err2);
      }else{
        var filtered=selectionList.intake.filter(request=>{
          return request.subcat_id.equals(req.body.subcat_id);
        })
        if(filtered&&filtered.length){
          Selection.findById(req.params.selectionid).populate({
            path:'intake',
            model:'SelectionHandler',
            populate:{
              path:'subcat_id',
              model:'Sub_cat',
              populate:{
                path:'cat_id',
                model:'Cat'
              }
            }
          }).exec(function(err7,selectionList){
            if(err7){
              console.log(err7);
            }else{
              res.json(selectionList.intake);
            }
          })
        }else{
            var newhandle=new SelectionHandler({
              vendor_id:req.body.vendorid,
              price:req.body.price,
              selection_id:req.params.selectionid,
              subcat_id:req.body.subcat_id
            })
            newhandle.save(function(err3,newhandler){
              if(err3){
                console.log("finding of selection failed" + err3);
              }else{
                Sub_cat.findById(req.body.subcat_id,function(err4,subcat){
                  if(err4){
                    console.log(err4);
                  }else{
                    subcat.selectionHandle_id.push(newhandler._id);
                    subcat.save(function(err5,subcat){
                      if(err5){
                        console.log(err5);
                      }else{
                        selectionList.intake.push(newhandler._id);
                        selectionList.save(function(err6){
                          if(err6){
                            console.log("saving list failed "+err6);
                          }else{
                            Selection.findById(req.params.selectionid).populate({
                              path:'intake',
                              model:'SelectionHandler',
                              populate:{
                                path:'subcat_id',
                                model:'Sub_cat',
                                populate:{
                                  path:'cat_id',
                                  model:'Cat'
                                }
                              }
                            }).exec(function(err7,selectionList){
                              if(err7){
                                console.log(err7);
                              }else{
                                res.json(selectionList.intake);
                              }
                            })
                          }
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

  /*
  @route : `PUT` `/vendor/selections/:selectionid`
  @desc  : change price of items
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
  router.put('/selections/:selectionid',vendorAuth,function(req,res){
    Selection.findById(req.params.selectionid).populate('intake').exec(function(err2,selectionList){
      if(err2){
        console.log("finding of selection failed" + err2);
      }else{
        var mapped=req.body.items.map((item,index)=>{
          if(item.price!==selectionList.intake[index].price){
            SelectionHandler.findById(item._id,function(err3,response){
              if(err3){
                console.log(err3);
                return false;
              }else{
                response.price=item.price;
                response.save(function(err4,saved){
                  if(err4){
                    console.log(err4);
                  }else{
                    return true;
                  }
                });
              }
            })
          }else{
            return false;
          }
        })
        res.json({
          msg:"saved all the changes made in prices"
        })
      }
    })
  })

 
  // router.post(':id/selections',vendorAuth,function(req,res){
  //   Vendor.findById(req.params.id,function(err,vendor){
  //     if(err){
  //       console.log("vendor finding process failed");
  //     }else{
  //       if(vendor.selection_id){
  //         Selection.findById(vendor.selection_id,function(err2,selectionList){
  //           if(err2){
  //             console.log("finding of selection failed" + err2);
  //           }else{
  //               if(req.body.intake&&req.body.intake.length){
  //                 var saturated=req.body.intake.map(request=>{
  //                     var newhandle=new SelectionHandler({
  //                       vendor_id:vendor._id,
  //                       price:request.price,
  //                       selection_id:selectionList._id,
  //                       subcat_id:request.subcat_id
  //                     })
  //                     newhandle.save(function(err3,newhandler){
  //                       if(err3){
  //                         console.log("finding of selection failed" + err3);
  //                       }else{
  //                         Sub_cat.findById(request.subcat_id,function(err4,subcat){
  //                           if(err4){
  //                             console.log(err4);
  //                           }else{
  //                             subcat.selectionHandle_id.push(newhandler._id);
  //                             subcat.save(function(err5,subcat){
  //                               if(err5){
  //                                 console.log(err5);
  //                               }else{
  //                                 selectionList.intake.push(newhandler._id);
  //                                 selectionList.save(function(err6,selectionList){
  //                                   if(err6){
  //                                     console.log("saving list failed "+err6);
  //                                   }else{
  //                                     res.redirect('');
  //                                   }
  //                                 })
  //                               }
  //                             })
  //                           }
  //                         })
                          
  //                       }
  //                     })
  //                     // if(!(selectionList.intake.includes(request.subcat_id))){
  //                     //     selectionList.intake.push(request.subcat_id);
  //                     //     Sub_cat.findById(request.subcat_id,function(err,subcategory){
  //                     //       if(err){
  //                     //         console.log(err);
  //                     //       }else{
  //                     //         subcategory.selection_data.push(request);
  //                     //         subcategory.save(function(err,savedsub){
  //                     //           if(err){
  //                     //             console.log(err);
  //                     //           }else{
  //                     //             return "added subcategory to selection "+savedsub.name ;
  //                     //           }
  //                     //         });
  //                     //       }
  //                     //     })
  //                     // }
  //                 });
  //                 // selectionList.save(function(err,final){
  //                 //   if(err){
  //                 //     console.log(err);
  //                 //   }else{
  //                 //     res.json({
  //                 //       msg:"added selected subcat to list",
  //                 //       items:final
  //                 //     })
  //                 //   }
  //                 // })
  //               }
  //           }
  //         })
  //       }else{
  //         var selection=new Selection({
  //           vendor_id:vendor._id
  //         });
  //         selection.save(function(err,selectionList){
  //           if(err){
  //             console.log(err);
  //           }else{
  //             vendor.selection_id=selectionList._id;
  //             vendor.save(function(err2,vendor2){
  //               if(err2){
  //                 console.log(err2);
  //                 res.status(400).json(err2);
  //               }else{
  //                 if(req.body.intake&&req.body.intake.length){
  //                   var saturated=req.body.intake.map(request=>{
  //                       var newhandle=new SelectionHandler({
  //                         vendor_id:vendor._id,
  //                         price:request.price,
  //                         selection_id:selectionList._id,
  //                         subcat_id:request.subcat_id
  //                       })
  //                       newhandle.save(function(err3,newhandler){
  //                         if(err3){
  //                           console.log("finding of selection failed" + err3);
  //                         }else{
  //                           Sub_cat.findById(request.subcat_id,function(err4,subcat){
  //                             if(err4){
  //                               console.log(err4);
  //                             }else{
  //                               subcat.selectionHandle_id.push(newhandler._id);
  //                               subcat.save(function(err5,subcat){
  //                                 if(err5){
  //                                   console.log(err5);
  //                                 }else{
  //                                   selectionList.intake.push(newhandler._id);
  //                                   selectionList.save(function(err6,selectionList){
  //                                     if(err6){
  //                                       console.log("saving list failed "+err6);
  //                                     }else{
  //                                       res.redirect('');
  //                                     }
  //                                   })
  //                                 }
  //                               })
  //                             }
  //                           })
                            
  //                         }
  //                       })
  //                   });
  //                 }
  //               }
  //             })
  //           }
  //         })
  //       }
  //     }
  //   })
  // })
  
  /*
  @route : `POST` `/vendor/:vendor_id/acceptOffer`
  @desc  : to bid for an item
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
  router.post('/:id/acceptOffer',vendorAuth,function(req,res){
      var vendor_id=req.params.id;
      var item_id=req.body.item_id;
      var date=req.body.date;
      var time=req.body.time;
      Item.findById(item_id).populate({
        path:'sub_cat_id',
        populate:{
          path:'selectionHandle_id'
        }
      }).exec(function(err0,res0){
        if(err0){
          console.log(err0); 
        }else{
          if(res0.status!=='INBID'&&res0.status!=='PAYMENT'){
            res.json({
              msg:'Item already sold'
            })
            return;
          }
          var arr=res0.sub_cat_id.selectionHandle_id;
          arr=arr.filter(item=>{
            return item.vendor_id.equals(vendor_id);
          })
          var price=arr[0].price;
          var newQuote=new Quote({
            vendor_id,
            price,
            date,
            time
          });
          newQuote.save(function(err1,res1){
            if(err1){
              console.log(err1);
            }else{
              Item_bid.findById(res0.item_bid,function(err2,res2){
                if(err2){
                  console.log(err2);
                }else{
                  res2.interested_vendor_id.push(newQuote._id);
                  res2.counter=res2.counter+1;
                  res2.save(function(err3,res3){
                    if(err3){
                      console.log(err3);
                    }else{
                      Vendor.findById(vendor_id,function(err3,res3){
                        if(err3){
                          console.log(err3);
                        }else{
                            News_feed.findById(res3.newsFeed,function(err4,res4){
                              if(err4){
                                console.log(err4);
                              }else{
                                var arr1=res4.items.filter(item=>{
                                  return !item.equals(item_id);
                                });
                                res4.items=arr1;
                                res4.save(function(err5,res5){
                                  if(err5){
                                    console.log(err5);
                                  }else{
                                    res.json({
                                      msg:'item suggessfully registered for interest'
                                    })
                                  }
                                });
                              }
                          })
                        }
                      })
                    }
                  });
                }
              })
            }
          })
        }
      })
  })

  /*
  @route : `POST` `/vendor/:vendor_id/rejectOffer`
  @desc  : to reject the offer of the item
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
  router.post('/:id/rejectOffer',vendorAuth,function(req,res){
    var vendor_id=req.params.id;
    var item_id=req.body.item_id;
    Item.findById(item_id).populate('item_bid').exec(function(err1,res1){
      if(err1){
        console.log(err1); 
      }else{
        if(res1.status!=='INBID'&&res1.status!=='PAYMENT'){
          res.json({
            msg:'Item already sold'
          })
          return;
        }
        var res2=res1.item_bid;
        res2.counter=res2.counter+1;
        res2.save(function(err3,res3){
          if(err3){
            console.log(err3);
          }else{
            Vendor.findById(vendor_id,function(err3,res3){
              if(err3){
                console.log(err3);
              }else{
                News_feed.findById(res3.newsFeed,function(err4,res4){
                  if(err4){
                    console.log(err4);
                  }else{
                      var arr1=res4.items.filter(item=>{
                        return !item.equals(item_id);
                      });
                      res4.items=arr1;
                      res4.save(function(err5,res5){
                        if(err5){
                          console.log(err5);
                        }else{
                          res.json({
                            msg:'item suggessfully removed for interest'
                          })
                        }
                      });   
                  }
                })
              }
            });
          }
        })
      }
    })
})
  
  //vendor profile
  ///add new item to buy list
  ///checked
  // router.post('/:id/transaction',function(req,res){
  //   if(req.body.requestCode!=='Unbreakable69'){
  //      res.send({
  //        msg:'permission denied'
  //      });
  //   }
  //   var vendor_id=req.params.id;
  //   var item_id=req.body.item_id;
  //   var price=req.body.price;
  //   const transaction=new Transaction({
  //     vendor:vendor_id,
  //     item:item_id,
  //     price:price
  //   });
  //   Item.findById(item_id,function(err1,res1){
  //     if(err1){
  //       res.status(400).json(err1);
  //     }
  //     if(res1.status!=='INBID'){
  //       res.json({
  //         msg:"item already sold"
  //       })
  //     }
  //     res1.status='RATING';
  //     res1.save(function(err2,res2){
  //       if(err2){
  //         res.status(400).json(err2);
  //       }
  //       transaction.save()
  //         .then(trans=>{
  //           res2.transaction_id=trans._id;
  //           res2.save();
  //           Vendor.findById(vendor_id,function(err4,res4){
  //             if(err4){
  //               console.log('adding transaction failed');
  //               res.status(400).json({
  //                 msg:"transaction failed"
  //               })
  //             }
  //             res4.transactions.push(trans._id);
  //             res4.save()
  //               .then(res5=>{
  //                 console.log("transaction added"),
  //                 res.json({
  //                   msg:"item added"
  //                 })
  //               })
  //               .catch(error=>{
  //                 res.status(400).json(error)
  //               })
  //           })
  //         })
  //         .catch(err3=>{
  //           res.status(400).json(err3);
  //         })
  //     })
  //   })
  // })

  /*
  @route : `POST` `/vendor/:vendor_id/paymentMethod`
  @desc  : select payment method for an item
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
  /// to be sent item_id and method
  router.post('/:id/paymentMethod',vendorAuth,function(req,res){
    var item_id=req.body.item_id;
    var method=req.body.method;
    Item.findById(item_id).populate('transaction_id').exec(function(err1,res1){
      if(err1){
        console.log(err1);
      }else{
        if(!res1.transaction_id.vendor.equals(req.params.id)){
          res.status(400).json({
            msg:'Invalid user request'
          })
          return;
        }
        if(method!=='COD'&&method!=='ONLINE'){
          res.status(400).json({
            msg:'Invalid method type'
          })
          return;
        }
        var transaction=res1.transaction_id;
        transaction.method=method;
        transaction.save(function(err2,res2){
          if(err2){
            console.log(err2);
          }else{
            res.json({
              msg:'method saved to the list'
            });
          }
        })
      }
    })
  })
  

  /*
  @route : `GET` `/vendor/:vendor_id/viewBuyedItem`
  @desc  : fetch all purchased items
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
        },{
          path:'transaction_id'
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
        var filtered=response.transactions.map(trans=>{
          return trans.item
        })
        filtered.reverse();
        res.json(filtered);
      }
    });
  });

  
  /*
  @route : `GET` `/vendor/viewItem/:item_id`
  @desc  : to get item data by its id
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
router.get('/viewItem/:id',vendorAuth,function(req,res){
  Item.findById(req.params.id).populate([{
    path: 'cat_id',
    model: 'Cat'
  },{
    path:'sub_cat_id',
    model:'Sub_cat'
  }])
  .exec(function(err,viewItem){
    if(err){
      console.log(err);
    }else{
      res.json(viewItem);
    }
  })
})
  

/*
  @route : `GET` `/vendor/newsfeed/:vendor_id`
  @desc  : fetch list of items for the vendor
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
  router.get('/newsfeed/:id', vendorAuth, function(req, res){
    Vendor.findById(req.params.id).populate({
      path:'newsFeed',
      model:'News_feed',
      populate:{
        path:'items',
        model:'Item',
        populate:[{
          path: 'cat_id',
          model: 'Cat'
        },{
          path:'sub_cat_id',
          model:'Sub_cat'
        }]
      }
    }).exec(function(err,vendor){
        var filtered=vendor.newsFeed.items;
        filtered=filtered.map(item=>{
          if(item.image){
              return{
              ...item,
              imageData:fs.readFileSync('C:/Users/sambh/Desktop/webdev/Task/Backend/public/uploads/'+item.image)
            }
          }else{
            return item;
          }
        })
      res.json(filtered);
    })
  //   Item.find({}).populate([{
  //     path: 'cat_id',
  //     model: 'Cat'
  //   },{
  //     path:'sub_cat_id',
  //     model:'Sub_cat'
  //   }])
  //   .exec(function(err, allItems){
  //     if(err)
  //     {
  //         console.log(err);
  //     } 
  //     else 
  //     {
  //       var filtered=allItems.map(item=>{
  //         return {
  //           id: item._id,
  //           cat: item.cat_id,
  //           subcat: item.sub_cat_id,
  //           quantity: item.quantity,
  //           image: item.image,
  //           status:item.status
  //         }
  //       });
  //       filtered=filtered.filter((item)=>{
  //           return item.status==='INBID';
  //       })
  //       res.json(filtered);
  //     }
  //  });
  })

/*
  @route : `POST` `/vendor/:vendor_id/quantityTaken`
  @desc  : vendor enters the quantity of item taken from seller
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
  router.post('/:id/quantityTaken',vendorAuth,function(req,res){
    var item_id=req.body.item_id;
    Item.findById(item_id).populate([{
        path: 'cat_id',
        model: 'Cat'
      },{
        path:'sub_cat_id',
        model:'Sub_cat'
      },{
        path:'transaction_id',
        model:'Transaction'
      }])
    .exec(function(err1,res1){
      if(err1){
        console.log(err1);
      }else{
        var transaction=res1.transaction_id;
        transaction.quantity_taken=req.body.quantity_taken;
        if(req.body.reason){
          transaction.reason=req.body.reason;
        }
        transaction.save(function(err2,res2){
          if(err2){
            console.log(err2);
          }else{
            res1.transaction_id=res2;
            res.json(res1);
          }
        })
      }
    })
  })
  
/*
  @route : `POST` `/vendor/newWasteType`
  @desc  : add a new category to the list of categories
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
  router.post('/newWasteType', vendorAuth, function(req, res){
    let request = new Cat_request(req.body);
    request.vendor_id =req.vendor.id;
    Cat.findOne({name:(req.body.cat_name.toLowerCase())},function(err,category){
        if(err){
          console.log(err);
        }else{
          if(category){
            Sub_cat.findOne({name:(req.body.sub_cat_name.toLowerCase())},function(err2,subcategory){
              if(err2){
                console.log(err2);
              }else{
                if(subcategory){
                  res.json({
                    msg:"subcategory already present"
                  })
                }else{
                  let newSubCat = new Sub_cat({name: req.body.sub_cat_name, quantity_type: req.body.quantity_type, cat_id:category._id});
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
              }
            })
          }else{
            let newCat = new Cat({name: req.body.cat_name});
            newCat.save()
              .then(newCat => {
                let newSubCat = new Sub_cat({name: req.body.sub_cat_name, quantity_type: req.body.quantity_type, cat_id:newCat._id});
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