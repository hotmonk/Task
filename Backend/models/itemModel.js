var mongoose = require('mongoose');

var Item = new mongoose.Schema({
    cust_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Seller' 
    },
    cat_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Cat' 
    },
    sub_cat_id:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Sub_cat' 
    },
    quantity: Number,
    image: String,
    status: String,
    transaction_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction"
    }
});

module.exports = mongoose.model("Item", Item);