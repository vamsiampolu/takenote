var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var UserSchema=new Schema({
	username:'String',
	password:'String'
});

var user=mongoose.model('user',UserSchema);
module.exports=user;