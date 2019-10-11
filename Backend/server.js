const express =require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;

var Seller = require('./models/sellerModel.js');
var Vendor = require('./models/vendorModel.js');
var Item = require('./models/itemModel.js');
var Transaction = require('./models/transactionModel.js');
var Cat = require('./models/catModel.js');
var Sub_cat = require('./models/sub_catModel.js');
var Cat_request = require('./models/cat_requestModel.js');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/WasteManagement',{useNewUrlParser: true});
const connection=mongoose.connection;

connection. once('open',function(){
  console.log("Mongoose database connected");
})

app.post('/SignUpSeller', function(req, res) {
  let seller = new Seller(req.body);
  console.log(seller);
  seller.save()
      .then(seller => {
          res.status(200).json({seller: 'seller added successfully'});
      })
      .catch(err => {
          res.status(400).send('adding new seller failed');
      });
});  

app.post('/SignUpVendor', function(req, res) {
  let vendor = new Vendor(req.body);
  console.log(vendor);
  vendor.save()
      .then(vendor => {
          res.status(200).json({vendor: 'seller added successfully'});
      })
      .catch(err => {
          res.status(400).send('adding new vendor failed');
      });
});  

app.get("/seller/:id",function(req,res){
	Seller.findById(req.params.id).populate("items").exec(function(err,foundSeller){
		if(err)
		{
			console.log(err);
		}
		else
		{
			console.log(foundSeller);
			res.json(foundSeller);
		}
	});
});

// app.get('/Seller', function(req,res){
//     Seller.find(function(err,todos){
//       if(err){
//         console.log(err);
//       }
//       else{
//          res.json(todos);
//       }
//     });
// });


app.listen(PORT, function(){
  console.log("Server is running on PORT: "+ PORT);
});
