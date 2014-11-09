var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;
var bcrypt=require('bcrypt-nodejs');
var User=require('../models/users');

function createHash(password)
{
	return bcrypt.hashSync(password,bcrypt.genSaltSync(10),null);
}

module.exports=function(passport){
	passport.use('signup',new LocalStrategy({passReqToCallback:true},
		function(req,username,password,done)
		{
			function findOrCreateUser()
			{
				User.findOne({
					'username':username
				},function(err,user){
					if(err)
					{
						console.error(err);
						done(err);
					}
					if(user)
					{
						console.log('User already exists');	
						return done(null,false);
					}
					else
					{
						var newUser=new User({
							username:username,
							password:createHash(password)
						});
						newUser.save(function(err,user){
							if(err)
							{
								console.error(err);
								return done(err);
							}	
							return done(null,user);
						})
					}
				})
			}
			process.nextTick(findOrCreateUser);
		})
	);	
};