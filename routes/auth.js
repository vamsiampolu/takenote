var router=require('express').Router();
var passport=require('passport');

router.get('/signup',function(req,res){
	res.render('signup');
});

router.get('/login',function(req,res){
	res.render('login');
});

//add routes to get the login/signup screen

router.post('/login',passport.authenticate('login',{
	successRedirect:'/main',
	failureRedirect:'/auth/login',
	failureFlash:'Username or Password is incorrect.Please try again',
}));

router.post('/signup',passport.authenticate('signup',{
	successRedirect:'/main',
	failureRedirect:'/auth/login',
	failureFlash:'User already exists.Please choose a different username'
}));

//added a route for logging out existing user before logging in new user...
router.get('/logout',function(req,res){
	req.logout();
	res.redirect('/auth/login');
});

module.exports=router;