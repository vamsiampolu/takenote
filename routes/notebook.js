<<<<<<< HEAD
var express=require('express');
var router=express.Router();
var _=require('lodash');

//load mongoose models
var notebook=require('../models/notebook');
var notes=require('../models/notes');
var mongoose=require('mongoose');
var isAuthenticated=require('../auth/isAuthenticated');

//a notebook can be created from the home page only(for now)
router.post('/',isAuthenticated,function(req,res){
	console.log("Inside the notebook post route");
	var nb;
	var _user=mongoose.Types.ObjectId(req.session.passport.user);
	console.log("User: ");
	console.log(_user);
	console.log(req.body);
	console.log(req.body.title);
	notebook.find({user:_user,isActive:true},function(err,c){
		if(err){
			console.log("Error retrieving the notebooks");
			console.error(err);
		}	
		console.dir(c);
		if(!c.length)
		{
			console.log("No active notebooks found");
			nb=new notebook({
				title:req.body.title,
				isActive:true,
				user:mongoose.Types.ObjectId(req.session.passport.user)
			});		
		}
		else
		{
			console.log("Retrieved the notebooks");
			nb=new notebook({
				title:req.body.title,
				isActive:false,
				user:mongoose.Types.ObjectId(req.session.passport.user)
			});
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

=======
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

router.get('/default/:notebook',isAuthenticated,function(req,res){
	console.log("Inside the default notebook route");
	var _id=mongoose.Types.ObjectId(req.param('notebook'));
	console.log(_id);
	notebook.update({
		isActive:true
	},{
		$set:{
			isActive:false
		}
	},
	{multi:true},
	function(err,docs){
		if(err)
			console.error(err);
		else
			console.log(docs);
	});
	notebook.findByIdAndUpdate(_id,{
		$set:{
			isActive:true
		}
	},
	{
		new:true
	},
		function(err,doc){
		if(err)
			console.error(err);
		else
		{
			console.log("Recieved an updated document");
			console.log(doc);

			res.send(doc);
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

>>>>>>> bc5d0c8c92491d7370a2301764b0d580b844c891
module.exports=router;