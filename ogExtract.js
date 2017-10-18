const express = require('express')
const https = require('https');
const app = express();
const querystring = require('querystring');
var og = require('open-graph');

module.exports = function(app, express){

	app.get('/extract/og', function (req, res) {
		
		og(req.query.url, function(err, meta){

			console.log(meta)
	      		
			  res.send({

			  	main: {

			  		title: meta.title,
			  		caption: meta.description ? meta.description : meta.title,
			  		image: meta.image.url ? meta.image.url : 'http://sanrafael.gov.ph/images/products-no-image.png'

			  	},

			  	summary: meta

			  });
		})
	})

}

