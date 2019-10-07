const express =require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const SellerRoutes = express.Router();
const PORT = 4001;

var Seller = require('./Seller.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/todos',{useNewUrlParser: true});
const connection=mongoose.connection;

connection. once('open',function(){
  console.log("Mongoose database connected");
})

SellerRoutes.route('/').get(function(req,res){
    Seller.find(function(err,todos){
      if(err){
        console.log(err);
      }
      else{
         res.json(todos);
      }
    });
});


app.use('/todos',SellerRoutes);

app.listen(PORT, function(){
  console.log("Server is running on PORT:"+ PORT);
});
