module.exports=function isAuthenticated(req,res,next)
{
	if(req.isAuthenticated())
		return next();
	else
		res.render('login');
		
};