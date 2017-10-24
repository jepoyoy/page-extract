$(document).ready(function(){

	$("#other-data").toggle();

	$('#inpTime').datetimepicker({
		format: 'YYYY-MM-DD HH:mm'
	});
	
	$('#toggleView').click(function(){
		$("#other-data").toggle();
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

	if(url.length <= 0){ alert("url is required"); return;}

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
	$("#login .loading").show();
	$("#login .btnTxt").hide();
	$("#login").prop('disabled', true);
	$("#login #fetch-name").html(strLoading);
}

function closeLoading(){
	$("#login .loading").hide();
	$("#login .btnTxt").show();
	$("#login").prop('disabled', false);
	loadGraphCMSCategories(); 
}

function runUploadCMS(){
	$("#upload .loading").show();
	$("#upload .btnTxt").hide();
	$("#upload").prop('disabled', true);
}

function closeUploadCMS(){
	$("#upload .loading").hide();
	$("#upload .btnTxt").show();
	$("#upload").prop('disabled', false);
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

function validateForm(){
		//validation
	if($("#inpTitle").val().length <= 0){
		alert("Title is required");
		return false;
	}

	if($("#inpCaption").val().length <= 0){
		alert("Caption is required");
		return false;
	}

	if($("#inpTime").val().length <= 0){
		alert("Time is required");
		return false;
	}

	return true;
}

function submitForm(){

	$("#mainForm").ajaxSubmit({
		success: function(data, textStatus, jqXHR, $form){
			alert("Uploaded Successfully!");
			clearForm();
		}
	})
}

function clearForm(){

	$("#inpUrl").val("");
	$("#mainForm").find("input[type=text], textarea").val("");
	$("#other-data").html("");
	$("#imgPreview").css("background-image", "url(http://via.placeholder.com/350x250)");  
}














