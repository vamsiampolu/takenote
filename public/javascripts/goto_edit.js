$('section ul').on('click','.open-edit',function(e){
	e.preventDefault();
	var _id=$(e.target).closest('.open-edit').data('id');
	//_id=_id.substring(1,_id.length-1);
	console.log(_id);
	window.location='/notes/edit/'+_id;
});

$('.notebook-list').on('click','li',function(e){
	console.log('This will lead to a notebook being retrieved');
	var $list=$('.notebook-list');
	var $target=$(e.target).closest('li');
	var $active=$list.find('.active');
	var _id=$(e.target).data('notebook');
	_id=_id.substring(1,_id.length-1);
	console.log(_id);
	//currently redirect to that route
		$.ajax({
			url:'notebook/'+_id,
			type:'GET'
		}).done(function(data){
			console.log(JSON.parse(data));
			var _data=JSON.parse(data);
			$active.removeClass('active');
			$target.addClass('active');
			$('header h1').html(_data.title);
			var locals={
				notebook:{
					notes:_data.notes
				}
			};
			console.log(locals);
			var jadeHtml=notes(locals);
			$('section ul').html(jadeHtml);
		});
});

$('#nb-submit').on('click',function(e){
	e.preventDefault();
	var title=$('#nb-name').val();
	var dataObj={
		title:title
	};
	var dataJSON=JSON.stringify(dataObj);
	$.ajax({
		type:'POST',
		url:'/notebook/',
		contentType:'application/json',
		data:dataJSON
	})	
	.done(function(data){
		console.log("Notebook has been created");
		console.log(data);
		var $notebook=$('<li><a href="#" data-notebook="'+data._id+'">'+data.title+'</a></li>');
		$('.notebook-list').append($notebook);
		$('#notebook-modal').modal('hide');
	});
});