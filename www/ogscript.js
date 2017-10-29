function ogSearch(){

	runLoading("Blog/Article meta data");

  $.ajax({
    url: "/extract/og",
    data : {url: $("#inpUrl").val()},
    success: function(data) {
        $("#inpTitle").val(data.main.title);
              $("#inpCaption").val(data.main.caption);
              $("#imgPreview").css("background-image", "url(" + data.main.image + ")"); 
              $("#imgPreviewSrc").val(data.main.image);
              $("#inpSourcename").val(data.summary.sourcename || '');
              //$("#filestackCDN").val(data.main.image);  
              $("#extractedLang").val(data.summary.lang); 
              $("#extractedImage").val(data.main.image);  
              $("#mappingsJson").val(JSON.stringify(data.summary));

              var options = {
                formatProperty: function(prop) {
                    var strong = document.createElement('strong');
                    strong.appendChild(prop);
                    strong.appendChild(document.createTextNode(': '));

                    return strong;
                }
              }
    
              var html = JSON2HTMLList(data.summary,options);
              $('#other-data').html(html);

              closeLoading();       
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) { 
      if (XMLHttpRequest.status == 0) {
        showError(' Check Your Network.');
      } else if (XMLHttpRequest.status == 404) {
        showError('Requested URL not found or invalid URL.');
      } else if (XMLHttpRequest.status == 500) {
        showError('Internel Server Error.');
      }  else {
         showError('Unknown Error. Full error trace in console logs');
         console.log(XMLHttpRequest.responseText);
      }     
       closeLoading();  
    }
  });
}