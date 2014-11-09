var express=require('express');
var router=express.Router();
var notes=require('../models/notes');
var notebook=require('../models/notebook');
var users=require('../models/users');	
var mongoose=require('mongoose');
var isAuthenticated=require('../auth/isAuthenticated');
/*The notes routes*/

router.param('note',function(req,res,next,_id){
	//I either get a correct _id or an _id with '"the_actual_id"''(this is frustrating)
	console.log("Running the param middleware for note");
	if(_id)
	{
		if(_id.indexOf('"')===0)
		{
			console.log('Positive: " at 0');
			_id=_id.substring(1,_id.length)
		}
		if(_id.indexOf('"')===_id.length-1)
		{

			console.log('Positive: " at '+_id.length-1);
			_id=_id.substring(0,_id.length-1);
			console.log(_id);
		}
		req.params.note=_id;	
	}	
	next();
});

router.get('/:note',isAuthenticated,function(req,res){
	var _id=req.params.note;
	console.log(_id);
	var _user=mongoose.Types.ObjectId(req.session.passport.user);
	var locals={};
	users.findById(_user)
	.exec(function(err,user){
		if(err)	console.error(err);
		else{
			console.log(user.username);
			locals.username=user.username;
		}
					
	});
	notes.findById(mongoose.Types.ObjectId(_id),function(err,doc){
		
		if(err)
			console.error(err);
		else
		{
			
			console.log("Document has been retrieved");
			locals.note=doc;
			console.log(locals);
			res.render('note',locals);
		}	
	});	
});

router.get('/edit/:note',isAuthenticated,function(req,res){
	console.log("Inside get edit route");
	var _id=req.params.note;
	console.log(_id);
	var locals={};
	users.findById(mongoose.Types.ObjectId(req.session.passport.user))
	.exec(function(err,user){
		if(err)	console.error(err);
		else
			locals.username=user.username;
	});
	notes.findById(mongoose.Types.ObjectId(_id),function(err,doc){
		
		if(err)
			console.error(err);
		else
		{
			console.log("Documment has been retrieved");
			locals.note=doc;
			console.log(locals);
			res.render('edit',locals);
		}	
	});	
});

router.post('/edit/:note',isAuthenticated,function(req,res){
	var _id=req.params.note;
	var title=req.body.title;
	var content=req.body.content;
	console.log("_id: "+_id+"title "+title+" content "+content);
	notes.findByIdAndUpdate(mongoose.Types.ObjectId(_id),{
		$set:{
			title:title,
			content:content,
			lastUpdatedOn:Date.now()
		}
	},{
		'new':true
	},function(err,doc){
		if(err)
			console.error(err);
		else
		{
			console.log('Document has been updated');
			console.log(doc);
			res.send({
				_id:doc._id
			});
		}	
	});

});

module.exports=router;