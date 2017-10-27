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

		if(checkURL(url.split('?')[0])){
			return url.split('?')[0];
		}

		var queryparams = url.split('?')[1];

		var params = queryparams.split('&');

		var pair = null,
		    data = [];

		var extractedUrl = url + "&nofstkTag=true";

		params.forEach(function(d) {
		    pair = d.split('=');
		    var value = pair[1];

		    if(checkURL(value)){
		    	extractedUrl = decodeURIComponent(value.replace(/\+/g, ' '));
		    }

		});
	    return extractedUrl;
	};

	app.get('/extract/og', function (req, res) {
		
		preq(req.query.url).then(function(response){
			//console.log(response.body);
			var rawHTML = response.body.replace(/property/g, "name");
			
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
	      		sourcename = getFirstNonNull([meta['og:site_name']]);
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
						output.summary.urlthubmnail = imgObj;
					}

					if(meta['og:image']){
						output.summary.urlthubmnailheight = meta['og:image:height'];
						output.summary.urlthubmnailwidth = meta['og:image:width'];;
						output.summary.urlmediaheight = meta['og:image:height'];;
						output.summary.urlmediawidth = meta['og:image:width'];;
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

