$(document).ready(function(){

	$("#other-data").toggle();

	var dateNow = new Date();
	$('#datetimepicker2').datetimepicker({
		format: 'YYYY-MM-DD HH:mm',
		defaultDate: dateNow
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
	$(".login-loading").show();
	$("#login").prop('disabled', true);
	$(".login-loading #fetch-name").html(strLoading);
}

function closeLoading(){
	$(".login-loading").hide();
	$("#login").prop('disabled', false);
	loadGraphCMSCategories(); 
}

function runUploadCMS(){
	$(".upload-loading").show();
	$("#upload").prop('disabled', true);
}

function closeUploadCMS(){
	$(".upload-loading").hide();
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
			closeUploadCMS();
			clearForm();
			$("#upload-complete").slideToggle();
			setTimeout(function() { 
				$("#upload-complete").slideToggle();
			}, 3000);
		}
	})
}

function clearForm(){

	$("#inpUrl").val("");
	$("#mainForm #inpTitle").val("");
	$("#mainForm #inpCaption").val("");
	$("#other-data").html("");
	$("#imgPreview").css("background-image", "url(http://via.placeholder.com/350x250)");  
}

function showImageNewTab(){
	window.open($("#filestackCDN").val(),'_blank');
}

function checkURL(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

function checkURLIfStatic(url) {

		console.log("CHECK" + checkURL(url));

		if(checkURL(url)){
			return true;
		}else{
			if(checkURL(url.split('?')[0])){
				return true;
			}
		}

		var queryparams = url.split('?')[1];

		var params = queryparams.split('&');

		var pair = null,
		    data = [];

		params.forEach(function(d) {
		    pair = d.split('=');
		    var value = pair[1];

		    if(checkURL(value)){
		    	return true;
		    }

		});
	    return false;
	};







