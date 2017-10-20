$(document).ready(function(){
	$('#inpTime').datetimepicker({
		format: 'HH:mm'
	});
	
	var languages = [];
	$.getJSON("/graphcms/languages", function(result) {
	    $.each(result, function(item) {
	        languages.push('<option value="',
          	result[item].value, '">',
          	result[item].name, '</option>');
	    });
	    $("#inpLang").html(languages.join(''));
	});
});

function contextSearch(){

	var url = $("#inpUrl").val();

	if(url.indexOf("facebook.com/") !== -1){
		fbSearch();
		return;
	}else if(url.indexOf("instagram.com/") !== -1){
		igSearch();
		return;
	}else if(url.indexOf("youtube.com/") !== -1){
		ytSearch();
		return;
	}else{
		ogSearch();
		return;
	}
}

function runLoading(strLoading){
	$("#loading").show();
	$("#fetch-name").html(strLoading);
}

function closeLoading(){
	$("#loading").hide();
	loadGraphCMSCategories(); 
}

function loadGraphCMSCategories(){

	//loads only once
	if($("#inpCategory option").length > 0){
		return;
	}
	var categories = [];
	$.getJSON("/graphcms/categories", function(result) {
	    $.each(result, function(item) {
	        categories.push('<option value="',
          	result[item].id, '">',
          	result[item].title, '</option>');
	    });
	    $("#inpCategory").html(categories.join(''));
	});
}

function submitForm(){
	$("#mainForm").submit();
}