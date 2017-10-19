function igSearch(){

	runLoading("Instagram");

	$.get( "/extract/instagram", { 
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