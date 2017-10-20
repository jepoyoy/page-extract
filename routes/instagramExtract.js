const express = require('express')
const https = require('https');
const app = express();
const querystring = require('querystring'); 

module.exports = function(app, express){

	app.get('/extract/instagram', function (req, res) {
	  
		var str = req.query.url.split("/");

		/*
		
		TO GET TOKEN, use this link:

		https://www.instagram.com/oauth/authorize/?client_id=fab3019bb0d64b639e715d3e1efab9f4&redirect_uri=http://localhost/index&response_type=token&scope=basic+likes+comments+relationships

		*/

		var access_token = "33316313.fab3019.5fdebccc71094bdea504707c6ee011af";

		https.get('https://api.instagram.com/v1/media/shortcode/'+str[4]+'?access_token=' + access_token, (resp) => {
			

			let data = '';
			let TRUNCATE_LIMIT = 60; //CHANGE 60 to your preferred length to truncate
			 
			resp.on('data', (chunk) => {
			  data += chunk;
			});
			 
			resp.on('end', () => {

		      var results = JSON.parse(data);

		      console.log(results);

		      var truncatedTitle = results.data.caption.text;

		      if(truncatedTitle.length > TRUNCATE_LIMIT){
		      		truncatedTitle = truncatedTitle.substring(0, TRUNCATE_LIMIT);
		      } 
		      		
			  res.send({

			  	main: {

			  		title: truncatedTitle,
			  		caption: results.data.caption.text,
			  		image: results.data.images.standard_resolution.url

			  	},

			  	summary: results.data

			  });
			});
		 
		}).on("error", (err) => {
		  console.log("Error: " + err.message);
		});

	})

}

