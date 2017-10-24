const express = require('express')
const https = require('https');
const app = express();
const querystring = require('querystring');
const scrape = require('html-metadata');
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

		var queryparams = url.split('?')[1];

		var params = queryparams.split('&');

		var pair = null,
		    data = [];

		var extractedUrl = "#";

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
		
		scrape(req.query.url).then(function(allmeta){
			console.log(req.query.url);
		scrapeFavicon(req.query.url, allmeta, function(favicon_url, allmeta){

			console.log(allmeta)
	      	
	      	meta = allmeta.openGraph;

	      	var output = {

			  	main: {

			  		title: meta.title,
			  		caption: meta.description ? meta.description : meta.title,
			  		image: meta.image ? getUrlParameter(meta.image.url) : 'http://sanrafael.gov.ph/images/products-no-image.png'

			  	},

			  	summary: {
			  		type: POST_TYPE,
			  		provider: EXTRACT_SOURCE,
			  		timepublished: allmeta.jsonLd ? new Date(allmeta.jsonLd.datePublished) : 'n/a',
			  		sourcename: meta.site_name, 
			  		sourcename2: meta.url.split("/")[2], 
			  		sourceicon: favicon_url,
			  		urlsource: meta.url
			  	}

			  };

			if(meta.image.url){
				output.summary.urlmedia = meta.image.url;
				output.summary.urlthubmnail = meta.image.url;
			}

			if(meta.image){
				output.summary.urlthubmnailheight = meta.image.height;
				output.summary.urlthubmnailwidth = meta.image.width;
				output.summary.urlmediaheight = meta.image.height;
				output.summary.urlmediawidth = meta.image.width;
			}

			res.send(output);
		});   
		});
	})

	function scrapeFavicon(url, allmeta, callback){
		console.log(url);
		favicon(url, function(err, favicon_url) {
		  return callback(favicon_url ? favicon_url : 'no favicon', allmeta);
		});
	}
}

