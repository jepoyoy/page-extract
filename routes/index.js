const express = require('express')
const app = express()

module.exports = function(app, express){

	app.get('/', function (req, res) {
	  res.send('Hello World!')
	})

	app.get('/submit', function (req, res) {
	  
	  

	})
}

