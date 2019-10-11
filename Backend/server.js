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

app.get("/categories",function(req,res){
  Cat.find({}, function(err, allCategories){
    if(err){
        console.log(err);
    } else {
      var filtered=allCategories.map(category=>{
        return {
          name:category.name,
          id:category._id
        }
      })
      console.log(allCategories);
      res.json(filtered);
    }
 });
})

app.get("/categories/:id/subcat",function(req,res){
    Cat.findById(req.params.id).populate("sub_cats").exec(function(err, result){
        if(err||!result){
          console.log(err);
        }else{
          var sub_cat=result.sub_cats;
          var final_res=sub_cat.map(subcat=>{
            return {
              name:subcat.name,
              quantity_type:subcat.quantity_type
            }
          });
          res.json(final_res);
        }
    });
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
          res.status(200).json({vendor: 'vendor added successfully'});
      })
      .catch(err => {
          res.status(400).send('adding new vendor failed');
      });
});  

app.post('/NewWasteType',function(req, res){
  let request = new Cat_request(req.body);
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
