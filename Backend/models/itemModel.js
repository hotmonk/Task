var mongoose = require('mongoose');

/// MODEL FOR THE ITEMS ADDED BY THE SELLER FOR SALE
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
    ///IMAGE DATA OF THE ITEM
    image: String,
    ///STATUS CAN BE INBID,PAYMENT,RATING,DONE
    status:{
        type:String,
    } ,
    ///TRANSACTION ID OF ASSOCIATED ITEM
    transaction_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction"
    },
    ///ITEM_BID ID STORING ALL THE DATA REGARDING BIDDING
    item_bid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item_bid"
    },
    /// ITEM DESCRIPTION
    description:String
},{
    timestamps:true
});

module.exports = mongoose.model("Item", Item);