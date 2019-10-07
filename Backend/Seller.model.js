const mongoose =require('mongoose');
const Schema = mongoose.Schema;

let Seller= new Schema({
   name: {
     type: String
   },
   email:{
     type:String
   },
   contact_number:{
     type:String
   },
   password:{
     type: String
   },
   location:{
     type: String
   },
   user_id:{
     type: Number
   }
})

module.exports = mongoose.model('Seller',Seller);
