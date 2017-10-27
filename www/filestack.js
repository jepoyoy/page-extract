function stackUpload(){
	if(validateForm()){
		runUploadCMS();
		submitForm();
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

	var autoupload = true;
	if(!checkURLIfStatic($("#extractedImage").val())){
		alert("Detected: URL is not a static image file. Filestack URL upload will not work for link. Download the image and manually upload it from file system.")
		autoupload = false;
	}

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

		    	if(!autoupload){ return; }

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
