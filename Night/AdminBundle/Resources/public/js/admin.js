$(document).ready(function(){
	
	
	
	// ========================= WIDGET FILE / DELETE BOX
	// ==== Events 
	addFileDeleteStyle($("body p.filename").closest(".control-group"));
	$("body").on("click", ".form-delete-box input", function(){
		var index = $("body .form-delete-box input").index(this);
		$($(".filename").get(index))
			.toggleClass("line-through")
			.siblings("input").toggle();
	})
	
	
});

// ========================= WIDGET FILE / DELETE BOX
function addFileDeleteStyle($div){
	$div.addClass("file-loaded");
}