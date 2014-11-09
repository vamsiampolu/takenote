var LocalStrategy=require('passport-local').Strategy;
var User=require('../models/users');
var bcrypt=require('bcrypt-nodejs');

function validPassword(user,password)
{
	return bcrypt.compareSync(password,user.password);
}

module.exports=function(passport)
{
	passport.use('login',new LocalStrategy({passReqToCallback:true},
		function(req,username,password,done){
			//this function is called the verify callback
			User.findOne({'username':username},
				function(err,user){
					if(err)
					{
						console.error(err);
						return done(err);
					}	
					if(!user)
					{
						//invoke done with null,false if credentials are incorrect
						console.log('User not found');
						return done(null,false,{message:'Incorrect username'});
					}	
					if(!validPassword(user,password))
					{
						console.log('Password not found');
						return done(null,false,{message:'Incorrect Password'});
					}
					//if credentials are correct pass the user to the done method as the 2nd arg
					return done(null,user);	
				});
			}
		)
	);
};