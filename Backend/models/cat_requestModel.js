var mongoose = require('mongoose');


//Model to store data of request of new category/subcategory to be added
var Cat_request = new mongoose.Schema({
    ///stores vendor id who requested current addition
    vendor_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Vendor' 
    },
    ///category name to be added
    cat_name:{
        type:String,
        lowercase:true
    } ,
    ///sub category name to be added
    sub_cat_name:{
        type:String,
        lowercase:true
    } ,
    ///quantity type can be kg,l,g,ml,per piece
    quantity_type: String,
    ///status can be PENDING ,ACCEPTED or REJECTED
    status:{
        type:String,
        uppercase:true,
        default: 'PENDING'
    } 
});

module.exports = mongoose.model("Cat_request", Cat_request);