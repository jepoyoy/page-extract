function stackUpload(){
	filestackStoreURL(
			$("#imgPreview").css("background-image").replace("url(\"","").replace("\")",""),
			function(){
				submitForm();
			}
		)
}

function filestackStoreURL(url, callback){
	var client = filestack.init('AilcyvnHqTsyng8JmGEAYz');
	var log = function(result) {
	  $("#filestackCDN").val(result.url)
	  callback();
	}

	client.storeURL(escape(url)).then(log)
}