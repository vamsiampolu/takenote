var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var NoteSchema=new Schema({
	title: String,
	content: String,
	notebook: {type:Schema.Types.ObjectId,ref:'notebook'},
	createdOn:{type:Date,default:Date.now()},
	lastUpdatedOn:{type:Date,default:Date.now()}
},{
	collection:'notes',
	strict:false
});

//do full text searches on notes and content using notebook as a sorting mechanism
NoteSchema.index({
	title:'text',
	content:'text',
	notebook:1
});

//add a collection name when creating the model
var notes=mongoose.model('notes',NoteSchema);
//add code to perform find operation with population in Node.js
module.exports=notes;