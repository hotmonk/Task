const express=require('express'),
      router=express.Router(),
      checksum_lib=require('../paytmlibrary/checksum.js'),
      PaytmConfig=require('../config/paytm.js');
const axios=require('axios');

const vendorAuth = require('../middleware/vendorAuth.js');

router.get('/',vendorAuth,function(req,res){
    var params 						= {};
			params['MID'] 					= PaytmConfig.MID;
			params['WEBSITE']				= PaytmConfig.WEBSITE;
			params['CHANNEL_ID']			= PaytmConfig.CHANNEL_ID;
			params['INDUSTRY_TYPE_ID']	= PaytmConfig.INDUSTRY_TYPE_ID;
			params['ORDER_ID']			= 'TEST_'  + new Date().getTime();
			params['CUST_ID'] 			= 'Customer001';
			params['TXN_AMOUNT']			= '1.00';
			params['CALLBACK_URL']		= 'http://localhost:'+4000+'/payment/callback';
			params['EMAIL']				= 'abc@mailinator.com';
            params['MOBILE_NO']			= '7777777777';

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
    
  })

  router.post('/callback',function(req,res){
        var post_data=req.body;
        // received params in callback
        console.log('Callback Response: ', post_data, "\n");

        // verify the checksum
        var checksumhash = post_data.CHECKSUMHASH;
        // delete post_data.CHECKSUMHASH;
        var result = checksum_lib.verifychecksum(post_data, PaytmConfig.PAYTM_MERCHANT_KEY, checksumhash);
        console.log("Checksum Result => ", result, "\n");

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
                        console.log('final call');
                        console.log(response.data);
                        res.render('../paytmlibrary/redirectPage.ejs',{response:response.data});
                    })
                    .catch(err=>{
                        console.log(err);
                        res.json({
                            err
                        })
                    })
                // http.request(options, function(res) {
                //     console.log('STATUS: ' + res.statusCode);
                //     console.log('HEADERS: ' + JSON.stringify(res.headers));
                //     res.setEncoding('utf8');
                //     res.on('data', function (chunk) {
                //       console.log('BODY: ' + chunk);
                //     });
                //   }).end();
            }
    });
  })
  module.exports = router;