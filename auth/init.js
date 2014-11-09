var login=require('./login');
var signup=require('./signup');
var user=require('../models/users');

module.exports=function(passport)
{
	//to support persistant login sessions,passport needs to be able to serialize and deserialize users
	passport.serializeUser(function(user,done){
		console.log('Serializing the user');
		console.log(user);
		done(null,user._id);
	});

	passport.deserializeUser(function(id,done){
		user.findById(id,function(err,doc){
			console.log("Deserializing the user");
			if(err)
			{
				console.log("Error deserializing the user");
				console.error(err);
			}	
			done(err,doc);
		});
	});

	//set up passport strategies for login and signup/registration
	login(passport);
	signup(passport);
};