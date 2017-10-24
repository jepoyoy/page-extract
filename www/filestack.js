function stackUpload(){
	if(validateForm()){
		runUploadCMS();
		if($("#filestackCDN").val().length <= 0){
			filestackStoreURL(
				$("#imgPreview").css("background-image").replace("url(\"","").replace("\")",""),
				function(){
					return submitForm();
				}
			)
		}else{
			return submitForm();
		}
	}
	//closeUploadCMS();
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

	 return client.pick({
		    maxFiles: 1,
		    transformations: {
			    crop: {
			      aspectRatio: 4 / 3
			    }
			  },
		    preferLinkOverStore: true,
		    fromSources: ['url', 'local_file_system'],
		    onOpen: function(){

		    	setTimeout(function() { 
		    			var textInput = $("#imgPreviewSrc").val();
		    	 		var $input = $('.fsp-url-source__input').val(textInput);
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