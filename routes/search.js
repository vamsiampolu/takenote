var express=require('express');
var router=express.Router();
var _=require('lodash');
var notes=require('../models/notes');
var notebook=require('../models/notebook');
var user=require('../models/users');
var mongoose=require('mongoose');
var isAuthenticated=require('../auth/isAuthenticated');
router.get('',isAuthenticated,function(req,res){
     var locals={results:[]};
     var _user=mongoose.Types.ObjectId(req.session.passport.user);
     console.log(_user);   
     var valid_notebooks;
    var search=req.query.searchBox;
    
    notebook
    .find({user:_user},'_id')    
    .exec(function(err,docs){
        if(err)
            console.error(err);
        else
        {
            user.findById(_user,function(err,doc){
                if(err)
                    console.error(err);
                else
                {
                    locals.username=doc.username;
                    console.log(doc.username);
                }    
            });
            //console.log(docs);
            valid_notebooks=_.map(docs,function(val){ return val._id; });
            //console.log("Getting valid notebooks");
            //console.log(valid_notebooks);
            //full text-search in mongodb has only been added on 2.6
            if(valid_notebooks.length)
            {
                notes
                .find({
                    notebook:{$in:valid_notebooks},
                    $text:{$search:search}
                })
                .exec(function(err,docs){ 
                    if(err)
                        console.error(err);
                    else
                    {
                        locals.results=docs;
                        //console.log(locals);
                        res.render('searchresults',locals);
                    }
                });

            }
            else
                res.render('searchresults',locals);
        }
    });
});                

module.exports=router;