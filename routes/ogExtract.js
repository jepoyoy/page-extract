const express = require('express')
const app = express();
const querystring = require('querystring');
const scrape = require('metadata-parser');
const parseOpenGraph = require('metadata-parser').parseOpenGraph;

var Extrator = require("html-extractor");

var cheerio = require('cheerio');
const preq = require('preq');
const favicon = require('favicon');

const EXTRACT_SOURCE = "website";
const POST_TYPE = "text";

module.exports = function(app, express){

	function checkURL(url) {
	    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
	}

	function getUrlParameter(url) {

		console.log("CHECK" + checkURL(url));

		if(checkURL(url)){
			return url;
		}

		return url;
	};

	app.get('/extract/og', function (req, res) {
		
		console.log("start with")
		preq.get({
		    uri: req.query.url,
		    headers: {
		        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
		        'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
		    }
		}).then(function(response){
			console.log("done with")
			//console.log(response.body);
			var rawHTML

			try{
				rawHTML = response.body.replace(/property/g, "name");
			}catch(err){
				return res.status(404).send('Not found');
			}

			var myExtrator = new Extrator();

		    
		    myExtrator.extract( rawHTML, function( err, allmeta ){

		    	console.log(allmeta);

			scrapeFavicon(req.query.url, allmeta, function(favicon_url, allmeta){
	      	

	      	meta = allmeta.meta;

	      	var output = {};

	      	var title;
	      	var caption;
	      	var image;
	      	var sourcename;
	      	var sourcename2;
	      	var urlsource;
	      	var lang = 'sv';//default
	      	var imgObj;
	      	var timepublished;

	      	console.log(meta.title)

	      	if(meta){
	      		title = getFirstNonNull([meta.title, meta['og:title'], meta['twitter:title']]);
	      		caption = meta['og:description'] ? meta['og:description'] : meta['twitter:description']  ? meta['twitter:description'] : '';
	      		sourcename = getFirstNonNull([meta['og:site_name'], title]);
	      		sourcename2 = meta['og:url'] ? meta['og:url'].split("/")[2] : '';
	      		image = meta['og:image'] ? getUrlParameter(meta['og:image']) : '';
	      		imgObj = meta['og:image'];

	      		if(meta['og:locale']){
	      			if(meta['og:locale'].indexOf("_") != -1 ){
	      				lang = meta['og:locale'].split("_")[0];
	      			}else{
	      				lang= meta['og:locale'];
	      			}
	      		}

	      		timepublished = getFirstNonNull([meta['article:published_time'], meta['lp.article:published_time']]);

	      		if(timepublished.length > 0){
	      			timepublished = new Date(timepublished).toISOString()
	      		}else{
	      			timepublished = new Date('01/01/1900 12:00 AM').toISOString()
	      		}
	      	}	

	      	output = {

				  	main: {

				  		title: title,
				  		caption: caption,
				  		image: image

				  	},

				  	summary: {
				  		type: POST_TYPE,
				  		provider: EXTRACT_SOURCE,
				  		timepublished: timepublished,
				  		sourcename: sourcename,
				  		sourcename2: sourcename2,
				  		sourceicon: favicon_url,
				  		urlsource: req.query.url,
				  		lang: lang
				  	}

				  };

				if(meta){  
					if(meta['og:image']){
						output.summary.urlmedia = imgObj;
						output.summary.urlthumbnail = imgObj;
					}else{
						output.summary.urlmedia = '';
						output.summary.urlthumbnail = '';
					}

					if(meta['og:image']){
						output.summary.urlthumbnailheight = meta['og:image:height'];
						output.summary.urlthumbnailwidth = meta['og:image:width'];
						output.summary.urlmediaheight = meta['og:image:height'];
						output.summary.urlmediawidth = meta['og:image:width'];;
					}else{
						output.summary.urlthumbnailheight = '';
						output.summary.urlthumbnailwidth = '';
						output.summary.urlmediaheight = '';
						output.summary.urlmediawidth = '';
					}
				}

			res.send(output);
			});  

		});
		
		});
	})

	function getFirstNonNull(arrayOfValues){

		if(arrayOfValues.length <= 0){
			return '';
		}

		try{

			var variable = arrayOfValues.pop();
			console.log("CHECK THIS" + typeof variable);
			console.log(typeof variable != 'undefined')
			if(typeof variable != 'undefined'){
				console.log("NOT UNDEFINED: 	" + variable);
				return variable;
			}

			return getFirstNonNull(arrayOfValues);

		}catch(err){
			return getFirstNonNull(arrayOfValues);
		}

		return '';
	}

	function scrapeFavicon(url, allmeta, callback){
		console.log(url);
		favicon(url, function(err, favicon_url) {
		  if(err){
		  	return callback('no favicon', allmeta); 
		  }
		  return callback(favicon_url ? favicon_url : 'no favicon', allmeta);
		});
	}
}

