const express = require('express')
const https = require('https');
const app = express();
const querystring = require('querystring'); 

const EXTRACT_SOURCE = "youtube";
const POST_TYPE = "video";
const TOKEN = "AIzaSyAbJidH_pJb_QznRu8-33_WQyDYOIcFTrw";

module.exports = function(app, express){

	app.get('/extract/youtube', function (req, res) {
	  
		var str = req.query.url.split("=");
		//res.send('Fetch data from URL: ' + req.query.url + '<br/>id: ' + str[1]);

		console.log('https://www.googleapis.com/youtube/v3/videos?id=' + str[1] + '&part=snippet,statistics&key=' + TOKEN);
		https.get('https://www.googleapis.com/youtube/v3/videos?id=' + str[1] + '&part=snippet,statistics&key=' + TOKEN, (resp) => {
		

		let data = '';
		 
		// A chunk of data has been recieved.
		resp.on('data', (chunk) => {
		  data += chunk;
		});
		 
		// The whole response has been received. Print out the result.
		resp.on('end', () => {

	      var results = JSON.parse(data);

	      var imgObj;
	      var img;
	      var imgH;
	      var imgW;
	      if(results.items[0].snippet.thumbnails.maxres){
	      	imgObj = results.items[0].snippet.thumbnails.maxres;
	      }else if(results.items[0].snippet.thumbnails.high){
	      	imgObj = results.items[0].snippet.thumbnails.high;
	      }else if(results.items[0].snippet.thumbnails.medium){
	      	imgObj = results.items[0].snippet.thumbnails.medium;
	      }else{
	      	imgObj = results.items[0].snippet.thumbnails.default;
	      }

	      img = imgObj.url;
	      imgW = imgObj.width;
	      imgH = imgObj.height;

	      getChannelDetails(results.items[0].snippet.channelId, TOKEN, function(channelObj){
			  res.send({

			  	main: {

			  		title: results.items[0].snippet.title,
			  		caption: results.items[0].snippet.description ? results.items[0].snippet.description : results.items[0].snippet.title,
			  		image: img

			  	},

			  	summary: {
			  		type: POST_TYPE,
			  		provider: EXTRACT_SOURCE,
			  		timepublished: results.items[0].snippet.publishedAt,
			  		sourcename: channelObj.items[0].snippet.title, //channel name
			  		sourceinfo: channelObj.items[0].statistics.subscriberCount, //channel subs count
			  		sourceinfo2: channelObj.items[0].statistics.viewCount, //channel subs count
			  		sourceicon: channelObj.items[0].snippet.thumbnails.default.url, //channel image
			  		sourceprofile: 'https://www.youtube.com/channel/' + results.items[0].snippet.channelId,
			  		urlmedia: img,
			  		urlsource: 'https://www.youtube.com/watch?v=' + results.items[0].id,
			  		urlthumbnail: results.items[0].snippet.thumbnails.default.url,
			  		medialikes: results.items[0].statistics.likeCount,
			  		mediadislikes: results.items[0].statistics.dislikeCount,
			  		mediacomments: results.items[0].statistics.commentCount,
			  		mediaviews: results.items[0].statistics.viewCount,
			  		urlthumbnailheight: results.items[0].snippet.thumbnails.default.height,
			  		urlthumbnailwidth: results.items[0].snippet.thumbnails.default.width,
			  		urlmediaheight: imgH,
			  		urlmediawidth: imgW

			  	}

			  });

	      });

		});
	 
		}).on("error", (err) => {
		  console.log("Error: " + err.message);
		});
	})

	function getChannelDetails(id, token, callback){
		console.log('https://www.googleapis.com/youtube/v3/channels?id='+id+'&part=snippet,statistics,contentDetails&key=' + token);
		https.get('https://www.googleapis.com/youtube/v3/channels?id='+id+'&part=snippet,statistics,contentDetails&key=' + token, (resp) => {
			
			let data = '';
			 
			// A chunk of data has been recieved.
			resp.on('data', (chunk) => {
			  data += chunk;
			});
			 
			// The whole response has been received. Print out the result.
			resp.on('end', () => {

		      var results = JSON.parse(data);

		      return callback(results)
			  
			});
		 
			}).on("error", (err) => {
			  console.log("Error: " + err.message);
			});
	}
}

