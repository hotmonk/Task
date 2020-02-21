const express=require('express'),
      router=express.Router(),
      checksum_lib=require('../paytmlibrary/checksum.js'),
      PaytmConfig=require('../config/paytm.js');
const axios=require('axios');

var Item = require('../models/itemModel.js');

const vendorAuth = require('../middleware/vendorAuth.js');

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
                            Item.findById(req.params.item_id).populate('transaction_id').exec(function(err1,res1){
                                if(err1){
                                    console.log(err1);
                                }else{
                                    var transaction=res1.transaction_id;
                                    res1.status='RATING';
                                    res1.save(function(err2,res2){
                                        if(err2){
                                            console.log(err2);
                                        }else{
                                            transaction.order_id=params['ORDERID'];
                                            transaction.save(function(err3,res3){
                                                if(err3){
                                                    console.log(err3);
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