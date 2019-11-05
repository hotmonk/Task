var mongoose = require('mongoose');

var Cat = new mongoose.Schema({
    name: String,
    sub_cats: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Sub_cat"
        }
      ]
});

module.exports = mongoose.model("Cat", Cat);