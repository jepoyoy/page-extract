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
}