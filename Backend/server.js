const express =require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const PORT=4000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/WasteManagement',{useNewUrlParser: true,  useUnifiedTopology: true, useCreateIndex: true});
const connection=mongoose.connection;

connection. once('open',function(){
  console.log("Mongoose database connected");
})
app.use('/seller/login', require('./routes/sellerAuth.js'));
app.use('/vendor/login', require('./routes/vendorAuth.js'));
app.use('/seller',require('./routes/sellerRoutes.js'));
app.use('/vendor',require('./routes/vendorRoutes.js'));
app.use('/categories',require('./routes/categoryRoutes.js'));


app.listen(PORT, function(){
  console.log("Server is running on PORT: "+ PORT);
});
