function ytSearch(){

	runLoading("Youtube");

	$.get( "/extract/youtube", { 
		url: $("#inpUrl").val()}, function( data ) {
              //console.log(data);
              $("#inpTitle").val(data.main.title);
              $("#inpCaption").val(data.main.caption);
              $("#imgPreview").css("background-image", "url(" + data.main.image + ")");
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
        });
}