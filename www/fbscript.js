window.fbAsyncInit = function() {
        FB.init({
          appId            : '1728217677483476',
          autoLogAppEvents : true,
          xfbml            : true,
          version          : 'v2.10'
        });
      };

      (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "//connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));

    function fbSearch(){

        event.preventDefault();

        FB.login(function(response) {
          if (response.authResponse) {
           console.log('Welcome!  Fetching your information.... ');
           FB.api('/me', function(response) {
              FB.getLoginStatus(function(response) {
                if (response.status === 'connected') {
                    var accessToken = response.authResponse.accessToken;

                    runLoading("Facebook");

                    $.get( "/extract/facebook", { url: $("#inpUrl").val(), token: accessToken }, function( data ) {
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
                } )
           });
          } else {
           console.log('User cancelled login or did not fully authorize.');
          }
      });
    }