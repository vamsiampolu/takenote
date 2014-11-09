var express = require('express');
var router = express.Router();
var _=require('lodash');
//Load mongoose models...
var notes=require('../models/notes');
var notebook=require('../models/notebook');
var users=require('../models/users');
var mongoose=require('mongoose');
//var passport=require('passport');
var isAuthenticated=require('../auth/isAuthenticated');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/main',isAuthenticated,function(req,res){
	console.log("Inside main route");
	var locals={
		title:"TakeNote:An easy to use note taking app for web and hopefully mobile",
		sidebar:{
			title:'Notebooks',
			items:[]
		},
		notebook:{
			notes:[]
		}
	};
	console.log("User in passport: "+req.session.passport.user);
	users
	.findById(mongoose.Types.ObjectId(req.session.passport.user))
	.exec(function(err,user){
		console.log("Obtaining user from passport");
		if(err)
			console.error(err);
		else
		{
			console.log("Successfully got user");
			console.log(user);
			locals.username=user.username;
			notebook.find({'user':user._id})
			.exec(function(err,docs){
				console.log("Inside notebooks handler");
				if(err)
					console.error(err);
				if(docs && docs.length)
				{
					console.log("notebooks retrieved");
					console.dir(docs);
					_(docs).forEach(function(notebook){
						locals.sidebar.items.push({
							title:notebook.title,
							isActive:notebook.isActive,
							_id:notebook._id
						});
						if(notebook.isActive)
						{
							console.log("Notebook is active");
							console.log(notebook);
							notes
							.find({notebook:notebook._id})
							.exec(function(err,docs){
								if(err)
									console.log(err);
								else
								{
									console.log("Obtained notes");
									console.log(docs);
									locals.notebook.title=notebook.title;
									locals.notebook.notes=docs;	
									res.render('main',locals);
								}
									
							});
						}
					});
				}
				else
					res.render('main',locals);	
			});
		}	
	});
});

router.get('/new',isAuthenticated,function(req,res){
	//figure out a way to select notebook from newNote
	
	notebook
	.find({user:mongoose.Types.ObjectId(req.session.passport.user)},'title')
	.exec(function(err,docs){
		if(err)
			console.error(err);
		else
		{	
			var locals={
				notebooks:docs
			};
			users
			.findById(mongoose.Types.ObjectId(req.session.passport.user))
			.exec(function(err,user){
				if(err)	console.error(err);
				else
					locals.username=user.username;
			});
			console.log(locals);
			res.render('newNote',locals);		
		}	
	});
	
});

router.post('/new',isAuthenticated,function(req,res){
	/*Use this route for creating a new route in the database*/
	//get notebook from req...
	var _id=mongoose.Types.ObjectId(req.body.notebook);
    console.log(_id);
    var data={
		title:req.body.title,
		content:req.body.content,
		notebook:_id
	};

	var createdNote=new notes(data);
	createdNote
	.save(function(err,doc,numberAffected){
		if(err)
			console.error(err);
		else
		{
			console.log("No error occured");
			console.log(doc);
			console.log("Number affected: "+numberAffected);
			console.log("Document has been saved");
			res.send({
				_id:doc._id
			});	
		}	
	});
});

module.exports = router;