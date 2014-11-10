var express=require('express');
var router=express.Router();
var _=require('lodash');

//load mongoose models
var notebook=require('../models/notebook');
var notes=require('../models/notes');
var mongoose=require('mongoose');
var isAuthenticated=require('../auth/isAuthenticated');

nb=new notebook({});	
//a notebook can be created from the home page only(for now)
router.post('/',isAuthenticated,function(req,res){
	console.log("Inside the notebook post route");
	
	var _user=mongoose.Types.ObjectId(req.session.passport.user);
	nb.set('title',req.body.title);
	nb.set('user',_user);
	notebook.find({user:_user,isActive:true},function(err,c){
		if(err){
			console.log("Error retrieving the notebooks");
			console.error(err);
		}	
		
		if(!c.length)
		{
			console.log("No active notebooks found");
			nb.set({isActive:true});		
		}
		else
		{
			console.log("Retrieved the notebooks");
			nb.set({isActive:false});
		}
		nb.save(function(err,doc){
			if(err)
			{
				console.log("Error saving the notebook");
				console.error(err);
			}	
			else
			{
				console.log("Notebook Document has been saved");
				console.log(doc);
				res.send(doc);
			}	
		});	
	});
	
});

router.get('/default/:notebook',function(req,res){
	var _id=req.param('notebook');
	_id=mongoose.Types.ObjectId(_id);
	notebook.findByIdAndUpdate(_id,{$set:{isActive:true}},{new:true},function(err,doc){
		if(err)
			console.error(err);
		else
		{
			console.log("Set isActive");
			console.log(doc);
			//worry about doing it the ajax way later
			res.redirect('/main');
		}	
	});
});

router.get('/:notebook',isAuthenticated,function(req,res){
	var locals={};
	console.log(req.session.passport.user);
	var _id=mongoose.Types.ObjectId(req.param('notebook'));
	var _user=mongoose.Types.ObjectId(req.session.passport.user);
	notebook.findOne({_id:_id,user:_user})
	.exec(function(err,doc){
		if(err)
			console.error(err);
		else
		{
			console.log(doc._id);
			notes.find({notebook:doc._id})
			.exec(function(err,docs){
				if(err)
					console.error(err);
				else
				{
					console.log(docs);
					locals={
						title:doc.title,
						notes:docs
					};
					res.send(JSON.stringify(locals));
				}	
			});
		}	
	});
});

module.exports=router;