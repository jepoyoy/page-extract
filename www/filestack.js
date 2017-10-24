function stackUpload(){
	if(validateForm()){
		runUploadCMS();
		if($("#filestackCDN").val().length <= 0){
			filestackStoreURL(
				$("#imgPreview").css("background-image").replace("url(\"","").replace("\")",""),
				function(){
					closeUploadCMS();
					submitForm();
				}
			)
		}else{
			closeUploadCMS();
			submitForm();
		}
	}
}

function filestackStoreURL(url, callback){
	var client = filestack.init('AilcyvnHqTsyng8JmGEAYz');
	var log = function(result) {
	  $("#filestackCDN").val(result.url)
	  callback();
	}

	client.storeURL(escape(url)).then(log)
}

function uploadImage(){
	const client = filestack.init('AilcyvnHqTsyng8JmGEAYz');

	const results = document.getElementById('other-data');

	const setResults = res => {
	    const filstkRes = JSON.parse(res.filesUploaded.map(JSON.stringify));

	    $("#imgPreview").css("background-image", "url(" + filstkRes.url + ")");  
	    $("#filestackCDN").val(filstkRes.url)
	};

	var chorva = "chenes";
	
	 return client.pick({
		    maxFiles: 1,
		    preferLinkOverStore: true,
		    fromSources: ['url'],
		    onOpen: function(){

		    	setTimeout(function() { 
		    	 		var $input = $('.fsp-url-source__input').val($("#imgPreview").css("background-image").replace("url(\"","").replace("\")",""));
						var e = document.createEvent('HTMLEvents');
						e.initEvent('input', true, true);
						$input[0].dispatchEvent(e);
						setTimeout(function() { 
								$('.fsp-url-source__submit-button').trigger('click');
							}, 1000);
		    	 }, 1000);


		    }
		})
		    .then(setResults);
     
}