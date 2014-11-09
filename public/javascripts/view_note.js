(function($){
	var _id=$(".mypanel").eq(0).data("identifier");
	_id=_id.substring(1,_id.length-1);
	console.log(_id);
	$("#save-note").on('click',function(e){
		console.log("Edit clicked");
		window.location='/notes/edit/'+_id;
	});
})(jQuery);