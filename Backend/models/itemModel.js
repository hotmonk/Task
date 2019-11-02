var mongoose = require('mongoose');

var Item = new mongoose.Schema({
    ///CUSTOMER IF OF PERSON WHO ADDED ITEM
    cust_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Seller' 
    },
    ///CATEGORY ID OF THE ITEM ADDED
    cat_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Cat' 
    },
    ///SUBCAT ID OF THE ITEM ADDED
    sub_cat_id:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Sub_cat' 
    },
    ///QUANTITY OF THE ITEM AVAILABLE FOR SALE
    quantity: Number,
    image: String,
    ///STATUS CAN BE INBID,PAYMENT,DONE
    status:{
        type:String,
        uppercase:true,
        default:'INBID'
    } ,
    ///TRANSACTION ID OF ASSOCIATED ITEM
    transaction_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction"
    }
});

module.exports = mongoose.model("Item", Item);