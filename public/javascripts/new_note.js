/*This module assumes that jQuery has been loaded*/
(function($){
	var $note=$('#create-note');
	var $title=$('#create-title');
	var $save=$('#save-note').parent();
	var $saveBtn=$('#save-note');
	var $notebookBtn=$('#notebook-btn');
	var $caret=$('<span class="caret">');
	var $notebook=$('#notebook-list');
	var $input=$('<input type="text" class="form-control" id="title-input" placeholder="Add a title here">');
	var defaultNotebook=$('#notebook-list').find('li').eq(0).data('notebook');
	//remove the double quotes from the result...
	defaultNotebook=defaultNotebook.substring(1,defaultNotebook.length-1);
	//when the user selects a notebook the value is placed in selected notebook
	var selectedNotebook;
	var title=$title.html();
	var content=$note.val().trim();
	$notebook.on('click','li',function(e){
		//this will fail
		e.preventDefault();
		var title=$(e.target).text();
		console.log(title);
		$notebookBtn.text(title).append($caret);
		selectedNotebook=$(this).data('notebook');
		selectedNotebook=selectedNotebook.substring(1,selectedNotebook.length-1);
		console.log(selectedNotebook);
	});

	$saveBtn.on('click',function(e){
		content=$note.val().trim();
		console.log(content);
		if(selectedNotebook==null)
		{
			selectedNotebook=defaultNotebook;
			console.log(selectedNotebook);
		}	
		console.log(JSON.stringify({title:title,content:content,notebook:selectedNotebook}));	
		$.ajax({
			type:'POST',
			contentType:'application/json',
			url:'/new',
			data:JSON.stringify({title:title,content:content,notebook:selectedNotebook})
		})
		.done(function(data){
			console.log("Note saved successfully");
			console.log(data);
			window.location='http://localhost:3000/notes/'+data._id;
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