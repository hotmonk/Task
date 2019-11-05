const express = require('express');
const router = express.Router();
var Cat = require('../models/catModel.js');
var Sub_cat = require('../models/sub_catModel.js');


///GET ALL CATEGORIES
///checked
router.get("/",function(req,res){
    Cat.find({},function(err, allCategories){
      if(err){
          console.log(err);
      } else {
        var filtered=allCategories.map(category=>{
          category.populate({
            path:'sub_cats',
            model:'Sub_cat'
          })
          // return {
          //   name:category.name,
          //   id:category._id,
          //   key: category._id,
          // }
        })
       // console.log(allCategories);
        //console.log(filtered);
        res.json(filtered);
      }
   });
  })
  
  
  // router.get("/:id",function(req,res){
  //   Cat.findById(req.params.id, function(err, category){
  //     if(err){
  //         console.log(err);
  //     } else {
  //      // console.log(allCategories);
  //       //console.log(filtered);
  //       var categoryData={
  //         name:category.name,
  //         key:category._id
  //       }
  //       res.json(categoryData);
  //     }
  //  });
  // })
  
  ///get all subcategories of a category
  /// checked
  router.get("/:id/subcat",function(req,res){
      Cat.findById(req.params.id).populate('sub_cats').exec(function(err, result){
          if(err||!result){
            console.log(err);
          }else{
            var sub_cat=result.sub_cats;
            var final_res=sub_cat.map(subcat=>{
              return {
                key:subcat._id,
                id:subcat._id,
                name:subcat.name,
                quantity_type:subcat.quantity_type
              }
            });
            res.json(final_res);
          }
      });
  });
  
  // router.get("/subcat/:id",function(req,res){
  //     Sub_cat.findById(req.params.id,function(err,response){
  //       if(err){
  //         console.log(err);
  //       }else{
  //         res.json(response);
  //       }
  //     })
  // });

  
module.exports = router;