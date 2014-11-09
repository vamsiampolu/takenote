var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var NotebookSchema=new Schema({
	title:String,
	isActive:Boolean,
	user:Schema.Types.ObjectId
},{
	collection:'notebook',
	strict:false
});

var notebook=mongoose.model('notebook',NotebookSchema);

module.exports=notebook;