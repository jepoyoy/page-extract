const express = require('express')
const https = require('https');
const app = express();
const querystring = require('querystring');
const scrape = require('html-metadata');
const favicon = require('favicon');

const EXTRACT_SOURCE = "Website";
const POST_TYPE = "Text";

module.exports = function(app, express){

	app.get('/extract/og', function (req, res) {
		
		scrape(req.query.url).then(function(allmeta){
			console.log(req.query.url);
		scrapeFavicon(req.query.url, allmeta, function(favicon_url, allmeta){

			console.log(allmeta)
	      	
	      	meta = allmeta.openGraph;

			  res.send({

			  	main: {

			  		title: meta.title,
			  		caption: meta.description ? meta.description : meta.title,
			  		image: meta.image.url ? meta.image.url : 'http://sanrafael.gov.ph/images/products-no-image.png'

			  	},

			  	summary: {
			  		type: POST_TYPE,
			  		provider: EXTRACT_SOURCE,
			  		created_time: allmeta.jsonLd ? allmeta.jsonLd.datePublished : 'no date',
			  		sourceName: meta.site_name, 
			  		sourceName2: meta.site_name.split("/")[2], 
			  		sourceIcon: favicon_url,
			  		urlSource: meta.url,
			  		urlMedia: meta.image.url ? meta.image.url : 'n/a',
			  		urlThubmnail: meta.image.url ? meta.image.url : 'n/a',
			  		urlThubmnailheight: meta.image ? meta.image.height: 'n/a',
			  		urlThubmnailwidth: meta.image ? meta.image.width: 'n/a',
			  		urlMediaheight: meta.image ? meta.image.height: 'n/a',
			  		urlMediawidth: meta.image ? meta.image.width: 'n/a'
			  	}

			  });
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

