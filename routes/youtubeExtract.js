const express = require('express')
const https = require('https');
const app = express();
const querystring = require('querystring'); 

module.exports = function(app, express){

	app.get('/extract/youtube', function (req, res) {
	  
		var str = req.query.url.split("=");
		//res.send('Fetch data from URL: ' + req.query.url + '<br/>id: ' + str[1]);
		
		https.get('https://www.googleapis.com/youtube/v3/videos?id=' + str[1] + '&part=snippet&key=AIzaSyAbJidH_pJb_QznRu8-33_WQyDYOIcFTrw', (resp) => {
			

			let data = '';
			 
			// A chunk of data has been recieved.
			resp.on('data', (chunk) => {
			  data += chunk;
			});
			 
			// The whole response has been received. Print out the result.
			resp.on('end', () => {

		      var results = JSON.parse(data);

		      var img = "";
		      if(results.items[0].snippet.thumbnails.maxres){
		      	img = results.items[0].snippet.thumbnails.maxres.url;
		      }else if(results.items[0].snippet.thumbnails.high){
		      	img = results.items[0].snippet.thumbnails.high.url;
		      }else if(results.items[0].snippet.thumbnails.medium){
		      	img = results.items[0].snippet.thumbnails.medium.url;
		      }else{
		      	img = results.items[0].snippet.thumbnails.default.url;
		      }
		      		
			  res.send({

			  	main: {

			  		title: results.items[0].snippet.title,
			  		caption: results.items[0].snippet.description ? results.items[0].snippet.description : results.items[0].snippet.title,
			  		image: img

			  	},

			  	summary: results.items[0]

			  });
			});
		 
		}).on("error", (err) => {
		  console.log("Error: " + err.message);
		});

	})

}

