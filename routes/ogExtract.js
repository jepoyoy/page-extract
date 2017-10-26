const express = require('express')
const app = express();
const querystring = require('querystring');
const scrape = require('metadata-parser');
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
			return url;
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
		
		scrape(req.query.url).then(function(allmeta){

			scrapeFavicon(req.query.url, allmeta, function(favicon_url, allmeta){

			console.log(allmeta)
	      	
	      	meta = allmeta.openGraph;
	      	twitter = allmeta.twitter;
	      	general = allmeta.general;

	      	var output = {};

	      	var title;
	      	var caption;
	      	var image;
	      	var sourcename;
	      	var sourcename2;
	      	var urlsource;



	      	if(meta){
	      		title = meta.title ? meta.title : general.title ? general.title : '';
	      		caption = meta.description ? meta.description : meta.title ? meta.title : '';
	      		sourcename = meta.site_name ? meta.site_name : '';
	      		sourcename2 = meta.url ? meta.url.split("/")[2] : '';
	      		lang = general.lang ? general.lang : '';
	      		image = Array.isArray(meta.image) ? getUrlParameter(meta.image[0].url) : meta.image.url ? getUrlParameter(meta.image.url) : 'http://sanrafael.gov.ph/images/products-no-image.png';
	      		
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
				  		timepublished: !allmeta ? '' : allmeta.jsonLd ? new Date(allmeta.jsonLd.datePublished) : 'n/a',
				  		sourcename: sourcename,
				  		sourcename2: sourcename2,
				  		sourceicon: favicon_url,
				  		urlsource: req.query.url,
				  		lang: lang
				  	}

				  };

				if(meta){  
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
				}

			res.send(output);
			});  
		
		});
	})

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

