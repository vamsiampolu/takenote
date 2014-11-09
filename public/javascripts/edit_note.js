/*This module assumes that jQuery has been loaded*/
(function($){
	var $note=$('#create-note');
	var $title=$('#create-title');
	var $save=$('#save-note').parent();
	var $input=$('<input type="text" class="form-control" id="title-input" placeholder="Add a title here">');
	var title=$title.html();
	var content=$note.val().trim();
	var _id=$('.mypanel').data("identifier");
	_id=_id.substring(1,_id.length-1);
	console.log(_id);
	$save.on('click',function(e){
		content=$note.val().trim();
		console.log(content);
		$.ajax({
			type:'POST',
			contentType:'application/json',
			url:'/notes/edit/'+_id,
			data:JSON.stringify({_id:_id,title:title,content:content})
		})
		.done(function(data){
			console.log("Note saved successfully");
			console.log(data);
			window.location='/notes/'+data._id;
		})
		.fail(function(){
			console.log("Saving data failed");
		});
	});
	$title.on('click',function(e){
		if($('#save-note').length)
			$save.detach();
		if(!$title.hasClass('editing'))
			$title.addClass('editing');
		if(!$('#create-title').find('input').length)
		{
			console.log("Adding input");
			$title.html('');
			$input.val(title);
			$title.append($input);
			$input.focus();
		}	
		$title.find('input').on('keypress',function(e){
			//if the user presses the enter key save the title
			//var $btn=$('<div class="btn-group btn-group-sm pull-right><button class="btn btn-success" id="save-note">Save</button></div>');
			if(e.which==13)
			{
				console.log('Enter key pressed');
				title=$(this).val();
				console.log(title);
				$input.detach();
				if(title)
					$title.html(title);	
				else
					$title.html('Add Title Here');
				$title.removeClass('editing');	
				$title.parent().append($save);
			}
		});
	});
})(jQuery);