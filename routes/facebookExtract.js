const express = require('express')
const https = require('follow-redirects').https
const app = express();
const querystring = require('querystring'); 

const EXTRACT_SOURCE = "Facebook";

module.exports = function(app, express){

	app.get('/extract/facebook', function (req, res) {
	  
		var str = req.query.url.split("/");

		//the only data we can get in the URL only
		var USER_NAME = str[4];
		var USER_PROFILE_URL = str[0] + '/' + str[1] + '/' + str[2] + '/' + str[3];
		getUserIDFromWeb(
			USER_PROFILE_URL,
			function(data){
				
				var queryParams = {};
				var params = {};

				if(str.indexOf("posts") !== -1){
    			
					queryParams = {
						objId : str[5],
						fields : "full_picture,link,name,likes.limit(0).summary(true),reactions.limit(0).summary(true),created_time",
						prefixObjId : data.id + "_",
						userid: data.id
					}

					//other parameters we can extract from here
					params = { type: "TEXT", username : USER_NAME, profileURL: USER_PROFILE_URL }

				}else if(str.indexOf("photos") !== -1){

					queryParams = {
						objId : str[6],
						fields : "picture,link,name,likes.limit(0).summary(true),reactions.limit(0).summary(true),created_time, webp_images",
						prefixObjId : "",
						userid: data.id
					}

					//other parameters we can extract from here
					params = { type: "IMAGE", username : USER_NAME, profileURL: USER_PROFILE_URL  }

				}else if(str.indexOf("videos") !== -1){

					queryParams = {
						objId : str[5],
						fields : "title,description,created_time,picture,thumbnails,source,likes.limit(0),reactions.limit(0),permalink_url,created_time",
						prefixObjId : "",
						userid: data.id
					}

					//other parameters we can extract from here
					params = { type: "VIDEO", username : USER_NAME, profileURL: USER_PROFILE_URL  }

				}

				getUserIDPhoto(queryParams, req, function(userIdPhotoUrl){
						params.userIdPhotoUrl = userIdPhotoUrl;
					getObjComments(queryParams, req ,function(summary){
						params.commentsCount = summary.total_count;
						runFBGraph(queryParams, params, req, res);
					});
				});

			})

	})

	function getUserIDPhoto(queryParams, req, callback){

		https.get('https://graph.facebook.com/' + queryParams.userid +'/picture?redirect&access_token=' + req.query.token, (resp) => {

			let data = '';

			resp.on('data', (chunk) => {
			  data += chunk;
			});
			 
			resp.on('end', () => {

				var results = JSON.parse(data);
				return callback(results.url);
		     
			});
		 
		}).on("error", (err) => {
		  console.log("Error: " + err.message);
		});
	}

	function getUserIDFromWeb(url, callback){

		var postData = querystring.stringify({
		    'url' : url
		});

		var options = {
		  hostname: 'findmyfbid.com',
		  path: '/',
		  method: 'POST',
		  headers: {
		       'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
		       "Accept": "application/json, text/plain, */*",
		       "User-Agent" : "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/14.0.835.202 Safari/535.1"
		     }
		};

		var req = https.request(options, (res) => {
		  console.log('statusCode:', res.statusCode);
		  console.log('headers:', res.headers);

		  res.on('data', (d) => {
		    return callback( JSON.parse(d) );
		  });
		});

		req.on('error', (e) => {
		  console.error(e);
		});

		req.write(postData);
		req.end();
	}

	function getObjComments(queryParams,req, callback){

		https.get('https://graph.facebook.com/' + queryParams.prefixObjId + queryParams.objId+'/comments?limit=0&summary=1&access_token=' + req.query.token, (resp) => {

			let data = '';

			resp.on('data', (chunk) => {
			  data += chunk;
			});
			 
			resp.on('end', () => {

				var results = JSON.parse(data);
				return callback(results.summary);
		     
			});
		 
		}).on("error", (err) => {
		  console.log("Error: " + err.message);
		});
	}

	function runFBGraph(queryParams, params, req, res){

		https.get('https://graph.facebook.com/' + queryParams.prefixObjId + queryParams.objId+'?fields='+queryParams.fields+'&access_token=' + req.query.token, (resp) => {
		
			let data = '';

			//set vars to be accessed in promise callback
			let token = req.query.token;
			let POST_TYPE = params.type;
			let FACEBOOK = EXTRACT_SOURCE;
			let USERNAME = params.username;
			let USER_PROFILE_URL = params.profileURL;
			let commentsCount = params.commentsCount;

			resp.on('data', (chunk) => {
			  data += chunk;
			});
			 
			resp.on('end', () => {

		      var results = JSON.parse(data);
		      var img = "";
		      if(results.full_picture){
		      	img = results.full_picture;
		      }else if(results.webp_images){
		      	img = results.webp_images[0].source;
		      }else if(results.picture){
		      	img = results.picture;
		      }else{
		      	img =''
		      }

		      var thumbnail = "";
		      if(results.thumbnails){
		      	thumbnail = results.thumbnails.data[0].uri;
		      }else if(results.picture){
		      	thumbnail = results.picture;
		      }else{
		      	thumbnail =''
		      }

			  return res.send({

			  	main: {

			  		title: (results.title ? results.title : results.description ? results.description : results.name),
			  		caption: (results.description ? results.description : results.name),
			  		image: img

			  	},

			  	summary: {
			  		type: POST_TYPE,
			  		provider: FACEBOOK,
			  		created_time: results.created_time,
			  		sourceName: USERNAME,
			  		sourceInfo: results.likes.summary.total_count,
			  		sourceIcon: results.userIdPhotoUrl,
			  		sourceProfile: USER_PROFILE_URL,
			  		urlMedia: results.source ? results.source : img,
			  		urlThubmnail: thumbnail,
			  		mediaLikes: results.reactions.summary.total_count,
			  		mediaComments: commentsCount,
			  		urlThubmnailheight: results.thumbnails ? results.thumbnails.data[0].height : '',
			  		urlThubmnailwidth: results.thumbnails ? results.thumbnails.data[0].width : ''
			  	}

			  });
			});
		 
		}).on("error", (err) => {
		  console.log("Error: " + err.message);
		});
	}
}

