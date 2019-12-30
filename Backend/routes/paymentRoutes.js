const express=require('express'),
      router=express.Router(),
      checksum_lib=require('../paytmlibrary/checksum.js'),
      PaytmConfig=require('../config/paytm.js');

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
			params['CALLBACK_URL']		= 'http://localhost:4000/payment/callback';
			params['EMAIL']				= 'abc@mailinator.com';
          //  params['MOBILE_NO']			= '7777777777';

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

        checksum_lib.genchecksum(params, PaytmConfig.key, function (err, checksum) {
            if(err){
                console.log(err);
            }else{
                params.CHECKSUMHASH = checksum;
                post_data = 'JsonData='+JSON.stringify(params);
                res.json({
                    msg:'success'
                })
                // var options = {
                //     hostname: 'securegw-stage.paytm.in', // for staging
                //     // hostname: 'securegw.paytm.in', // for production
                //     port: 443,
                //     path: '/merchant-status/getTxnStatus',
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/x-www-form-urlencoded',
                //         'Content-Length': post_data.length
                //     }
                // };

                //  https.request(options, function(post_res) {
                //     post_res.on('data', function (chunk) {
                //         response += chunk;
                //     });

                //     post_res.on('end', function(){
                //         console.log('S2S Response: ', response, "\n");

                //         var _result = JSON.parse(response);
                //         html += "<b>Status Check Response</b><br>";
                //         for(var x in _result){
                //             html += x + " => " + _result[x] + "<br/>";
                //         }

                //         res.writeHead(200, {'Content-Type': 'text/html'});
                //         res.write(html);
                //         res.end();
                //     });
                // });

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