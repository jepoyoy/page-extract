const express = require('express')
const https = require('https');
const app = express();
const querystring = require('querystring'); 
const cheerio = require('cheerio');
var fetch = require('node-fetch');

const EXTRACT_SOURCE = "instagram";
/*
		
TO GET TOKEN, use this link:

https://www.instagram.com/oauth/authorize/?client_id=fab3019bb0d64b639e715d3e1efab9f4&redirect_uri=http://localhost/index&response_type=token&scope=basic+likes+comments+relationships

*/
var TOKEN = "33316313.fab3019.5fdebccc71094bdea504707c6ee011af";

module.exports = function(app, express){

	app.get('/extract/instagram', function (req, res) {
	  
		var str = req.query.url.split("/");

		console.log('https://api.instagram.com/v1/media/shortcode/'+str[4]+'?access_token=' + TOKEN);
		
		https.get('https://api.instagram.com/v1/media/shortcode/'+str[4]+'?access_token=' + TOKEN, (resp) => {
			

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
		      
		      getUserDetails(results.data.user.id, TOKEN, function(userObj){
              scrapeMediaViews(results.data.link, userObj, function(views, userObj){

				  res.send({

				  	main: {

				  		title: truncatedTitle,
				  		caption: results.data.caption.text,
				  		image: results.data.images.standard_resolution.url

				  	},

				  	summary: {
				  		type: results.data.type,
				  		provider: EXTRACT_SOURCE,
				  		timepublished: new Date(parseInt(results.data.created_time)).toISOString(),
				  		sourcename: results.data.user.username, 
				  		sourcename2: results.data.user.full_name, 
				  		sourceinfo: userObj.data.counts.followed_by, //followedby
				  		sourceinfo2: userObj.data.bio, //bio
				  		sourceicon: results.data.user.profile_picture,
				  		sourceprofile: 'https://www.insatgram.com/' + results.data.user.username,
				  		urlsource: results.data.link,
				  		urlmedia: results.data.type == 'video' ? results.data.videos.standard_resolution.url : results.data.images.standard_resolution.url,
				  		urlthubmnail: results.data.images.thumbnail.url,
				  		medialikes: results.data.likes.count,
				  		mediacomments: results.data.comments.count,
				  		mediaviews: views, //manually scraped
				  		urlthubmnailheight: results.data.images.thumbnail.height,
				  		urlthubmnailwidth: results.data.images.thumbnail.width,
				  		urlmediaheight: results.data.images.standard_resolution.height,
				  		urlmediawidth: results.data.images.standard_resolution.width
				  	}

				  });

				});//
                });//
			});
		 
		}).on("error", (err) => {
		  console.log("Error: " + err.message);
		});

	})

	function getUserDetails(id, token, callback){
		https.get('https://api.instagram.com/v1/users/' + id + '?access_token=' + token, (resp) => {
			
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

	function scrapeMediaViews(url, userObj, callback){
		const options = {
		method: 'GET',
		headers: {
		       "User-Agent" : "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/14.0.835.202 Safari/535.1"
		    }
		};

		fetch(url, options)
		.then(response => response.text())
		.then(function(data){
		
			var extrct =  data.match(new RegExp("video_view_count\":" + "(.*)" + ", \"is_video"));
			if(!extrct){
				return callback(0,userObj);
			}
			console.log(extrct[extrct.length-1]);
			return callback(extrct[extrct.length-1],userObj);
		});
	}

}	

