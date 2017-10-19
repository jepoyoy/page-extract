function ogSearch(){

	runLoading("Blog/Article meta data");

	$.get( "/extract/og", { 
		url: $("#inpUrl").val()}, function( data ) {
              //console.log(data);
              $("#inpTitle").val(data.main.title);
              $("#inpCaption").val(data.main.caption);
              $("#imgPreview").css("background-image", "url(" + data.main.image + ")"); 

              var html = JSON2HTMLList(data.summary);
              $('#other-data').html(html);

              closeLoading();
        });
}