(function($){
	//Each search result can be edited by clicking on the pencil icon
	var $list=$('.list-group-item');
	$list.on('click','.open-edit',function(e){
		e.preventDefault();
		var $target=$(e.target).hasClass('.open-edit')?$(e.target):$(e.target).closest('.open-edit');
		var _id=$target.data('id');
		_id=_id.substring(1,_id.length-1);
		window.location='/notes/edit/'+_id;
	});
})(jQuery)