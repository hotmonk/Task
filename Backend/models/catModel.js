var mongoose = require('mongoose');


//Model to store categories of items
var Cat = new mongoose.Schema({
  ///NAME OF CATEGORY
    name:{
      type:String,
      lowercase:true
  } ,
    ///ARRAY OF SUBCAT ID BELONGING TO THIS CATEGORY
    sub_cats: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Sub_cat"
        }
      ]
});

module.exports = mongoose.model("Cat", Cat);