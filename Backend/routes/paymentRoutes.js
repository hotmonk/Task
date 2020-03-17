const express=require('express'),
      router=express.Router(),
      checksum_lib=require('../paytmlibrary/checksum.js'),
      PaytmConfig=require('../config/paytm.js'),
      config = require('config');
const axios=require('axios');

var Item = require('../models/itemModel.js');
var News_feed=require('../models/newsFeedModel.js');
var Quote=require('../models/quoteModel.js');
var Vendor=require('../models/vendorModel.js');
var Item_bid=require('../models/itemBidModel');
var Transaction=require('../models/transactionModel.js');

const vendorAuth = require('../middleware/vendorAuth.js');

/*
  @route : `POST` `/payment/`
  @desc  : Get all the payment related data
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
router.post('/',vendorAuth,function(req,res){
    Item.findById(req.body.item_id).populate('transaction_id').exec(function(err1,res1){
        if(err1){
            console.log(err1);
        }else{
            if(res1.status!=='PAYMENT'){
                res.json({
                    msg:'some error occured'
                })
                return;
            }
            var sum=(res1.transaction_id.price)*(res1.quantity);
            var params 						= {};
			params['MID'] 					= PaytmConfig.MID;
			params['WEBSITE']				= PaytmConfig.WEBSITE;
			params['CHANNEL_ID']			= PaytmConfig.CHANNEL_ID;
			params['INDUSTRY_TYPE_ID']	=  PaytmConfig.INDUSTRY_TYPE_ID;
			params['ORDER_ID']			= ''+req.body.vendor_id+'_'+new Date().getTime();
			params['CUST_ID'] 			=  req.body.vendor_id;
			params['TXN_AMOUNT']			= ''+sum+'';
			params['CALLBACK_URL']		= 'http://localhost:4000/payment/callback/'+req.body.item_id;
            params['EMAIL']				= 'abc@mailinator.com';
          //  params['MOBILE_NO']	    = '7777777777';

            checksum_lib.genchecksum(params, PaytmConfig.PAYTM_MERCHANT_KEY, function (err, checksum){
                if(err){
                    console.log(err);
                }else{
                    var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction";
                    params['CHECKSUMHASH']=checksum;
                    params['TXN_URL']=txn_url;
                    res.json({
                        ...params
                    });
                }
            })
        }
    })
  })

  /*
  @route : `POST` `/payment/callback/:item_id`
  @desc  : callback function from the paytm gateway after payment process
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
  router.post('/callback/:item_id',function(req,res){
       // received params in callback 
       var post_data=req.body;
        // verify the checksum
        var checksumhash = post_data.CHECKSUMHASH;
        // delete post_data.CHECKSUMHASH;
        var result = checksum_lib.verifychecksum(post_data, PaytmConfig.PAYTM_MERCHANT_KEY, checksumhash);

        if(!result){
            res.json({
                msg:'invalid tokens',
            })
        }

        // Send Server-to-Server request to verify Order Status
        var params = {"MID": PaytmConfig.MID, "ORDERID": post_data.ORDERID};

        checksum_lib.genchecksum(params, PaytmConfig.PAYTM_MERCHANT_KEY, function (err, checksum) {
            if(err){
                console.log(err);
            }else{
                params.CHECKSUMHASH = checksum;
                var body=JSON.stringify(params);
                var config={
                    headers:{
                        'Content-type': 'application/json'
                    }
                }
                axios.post('https://securegw-stage.paytm.in/order/status',body,config)
                    .then((response)=>{
                        if(response.data.RESPCODE==='01'){
                            Item.findById(req.params.item_id).populate([{
                                path:'item_bid',
                                model:'Item_bid',
                                populate:{
                                  path:'interested_vendor_id',
                                  model:'Quote'
                                }
                              },{
                                path:'transaction_id',
                                model:'Transaction',
                                populate:{
                                  path:'vendor',
                                  model:'Vendor'
                                }
                              }]).exec(function(err1,res1){
                                  if(err1){
                                    console.log(err1);
                                  }else{
                                    var item_id=req.params.item_id;
                                    res1.status='RATING';
                                    res1.transaction_id.order_id=params['ORDERID'];
                                    res1.save(function(err2,res2){
                                        if(err2){
                                            console.log(err2);
                                        }else{
                                            var quote_ids=res1.item_bid.interested_vendor_id.map(quote=>{
                                                return quote._id;
                                            })
                                            var vendor_ids=res1.item_bid.interested_vendor_id.map(vendor=>{
                                                return quote.vendor_id;
                                            })
                                            var leftVendors = res1.item_bid.vendor_id.filter( function(el){
                                                return !vendor_ids.includes(el);
                                            });
                                            quote_ids.map(quote=>{
                                                Quote.findByIdAndDelete(quote,function(err6){
                                                    if(err6){
                                                        console.log(err6);
                                                    }
                                                })
                                                return null;
                                            })
                                            leftVendors.map(leftVendor=>{
                                                Vendor.findById(leftVendor,function(err6,res6){
                                                    if(err6){
                                                    console.log(err6);
                                                    }else{
                                                    News_feed.findById(res6.newsFeed,function(err7,res7){
                                                        if(err7){
                                                        console.log(err7);
                                                        }else{
                                                            var arr1=res7.items.filter(item=>{
                                                            return !item.equals(item_id);
                                                            });
                                                            res7.items=arr1;
                                                            res7.save(function(err8){
                                                            if(err8){
                                                                console.log(err8);
                                                            }else{
                                                                return null;
                                                            }
                                                            });   
                                                        }
                                                    })
                                                    }
                                                });
                                            })
                                            Item_bid.findByIdAndDelete(res1.item_bid._id,function(err6){
                                                if(err6){
                                                    console.log(err6);
                                                }else{
                                                    res.render('../paytmlibrary/redirectPage.ejs',{response:response.data});
                                                }
                                            })
                                        }
                                    })
                                  }
                              })
                        }else{
                            res.send({
                                msg:'unsuccessful'
                            })
                        }
                        
                    })
                    .catch(err=>{
                        console.log(err);
                        res.json({
                            err
                        })
                    })
            }
    });
  })
  module.exports = router;