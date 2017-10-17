const express = require('express')
const https = require('https');
const app = express();
const querystring = require('querystring'); 

module.exports = function(app, express){

	app.get('/extract/facebook', function (req, res) {
	  
		var str = req.query.url.split("/");
		//res.send('Fetch data from URL: ' + req.query.url + '<br/>id: ' + str[5] + '<br/>token: ' + req.query.token);
		
		var index = 0;
		var fields = "";
		var prefixObjId = "";

		if(str.indexOf("posts") !== -1){
		    getUserIDFromWeb(str[0] + '/' + str[1] + '/' + str[2] + '/' + str[3],
		    		function(data){
		    			console.log(data);
		    			index = 5;
						fields="picture,link,name,likes.limit(0).summary(true),reactions.limit(0).summary(true)"
						prefixObjId = data.id + "_"
						runFBGraph(prefixObjId, str[index], fields, req, res);
		    		})

		}else if(str.indexOf("photos") !== -1){
			index = 6;
			fields="picture,link,name,likes.limit(0).summary(true),reactions.limit(0).summary(true)"
			runFBGraph(prefixObjId, str[index], fields, req, res);

		}else if(str.indexOf("videos") !== -1){
			var index = 5;
			var fields = "title,description,created_time,picture,thumbnails,source,likes.limit(0),reactions.limit(0),permalink_url";
			runFBGraph(prefixObjId, str[index], fields, req, res);
		}

	})

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

	function runFBGraph(prefixObjId, objId, fields, req, res){

		https.get('https://graph.facebook.com/' + prefixObjId + objId+'?fields='+fields+'&access_token=' + req.query.token, (resp) => {
		
			let data = '';
			 
			// A chunk of data has been recieved.
			resp.on('data', (chunk) => {
			  data += chunk;
			});
			 
			// The whole response has been received. Print out the result.
			resp.on('end', () => {

		      var results = JSON.parse(data);
		      		
			  res.send({

			  	main: {

			  		title: (results.title ? results.title : 'no title'),
			  		caption: (results.description ? results.description : results.name),
			  		image: results.picture

			  	},

			  	summary: results

			  });
			});
		 
		}).on("error", (err) => {
		  console.log("Error: " + err.message);
		});
	}
}

