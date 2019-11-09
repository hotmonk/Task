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
var SelectionHandler=require('../models/selectionHandleModel.js');
var Selection=require('../models/selectionModel.js');
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
              .then(vendor2 => {
                var selection=new Selection({
                  vendor_id:vendor2._id
                });
                selection.save(function(err2,selected){
                  if(err2){
                    console.log(err2);
                  }else{
                    vendor2.selection_id=selected._id
                    vendor2.save();
                    jwt.sign(
                      { id: vendor2.id },
                      config.get('jwtSecretvendor'),
                      { expiresIn: 3600 },
                      (err, token) => {
                        if(err) throw err;
                        res.json({
                          token,
                          vendor: {
                            id: vendor2.id,
                            name: vendor2.name,
                            email: vendor2.email,
                            contact: vendor2.contact,
                            address: vendor2.address,
                            selection_id:selected._id
                          }
                        });
                      }
                    )
                  }
                });
              });
          })
        })
      })
  });  


  ///delete any category preferance
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

  ///fetch all desired categories
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

  ///change price of items
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

  ///Add new wanted category to selectionlist for preferance
  router.post('/selections/:selectionid',vendorAuth,function(req,res){
    Selection.findById(req.params.selectionid).populate('intake').exec(function(err2,selectionList){
      if(err2){
        console.log("finding of selection failed" + err2);
      }else{
        var filtered=selectionList.intake.filter(request=>{
          return request.subcat_id===req.body.subcat_id
        })
        if(filtered&&filtered.length){
          res.json({
            msg:"subcategory already present in the list"
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
        if(res1.status!=='INBID'){
          res.json({
            msg:"item already sold"
          })
        }
        res1.status='RATING';
        res1.save(function(err2,res2){
          if(err2){
            res.status(400).json(err2);
          }
          transaction.save()
            .then(trans=>{
              res2.transaction_id=trans._id;
              res2.save();
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
        var filtered=response.transactions.map(trans=>{
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
        filtered=filtered.filter((item)=>{
            return item.status==='INBID';
        })
        res.json(filtered);
      }
   });
  })
  ///checked
  ///probably not used anywhere
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
          if(category)
          {
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
          else
          {
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