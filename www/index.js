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
	    
		if(localStorage.getItem('langdefault')){
			$('#inpLang option[value='+localStorage.getItem('langdefault')+']').prop('selected', true);
		}
	});

	$("#inpLang").change(function(){
		localStorage.setItem('langdefault', $("#inpLang").val());
	})

});

function contextSearch(){

	var url = $("#inpUrl").val();

	if(url.length <= 0 || !isUrlValid(url)){ showError("valid url is required"); return;}

	if(!/^(f|ht)tps?:\/\//i.test(url)){ showError("make sure URL has 'http://' as prefix"); return; }


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

function isUrlValid(userInput) {
    var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if(res == null)
        return false;
    else
        return true;
}

function runLoading(strLoading){
	$(".login-loading").show();
	$("#login").prop('disabled', true);
	$(".login-loading #fetch-name").html(strLoading);
}

function closeLoading(){
	$(".login-loading").hide();
	$("#login").prop('disabled', false);

	if($("#extractedLang").val().length > 0){
		$('#inpLang option[value='+$("#extractedLang").val().split("-")[0].toLowerCase()+']').prop('selected', true);
	}
	$("#inpLang").trigger("change");
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

function showError(error){
	$("#error-loading").show();
	$("#error-loading").html(error);
	setTimeout(function() { 
		$("#error-loading").hide();
		$("#error-loading").html("");
	}, 3000);
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
	$("#mainForm #inpSourcename").val("");
	$("#other-data").html("");
	$("#imgPreview").css("background-image", "url(http://via.placeholder.com/350x250)");  
}

function showImageNewTab(){
	window.open($("#filestackCDN").val(),'_blank');
}





