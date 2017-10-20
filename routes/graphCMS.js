const express = require('express')
const https = require('https');
const app = express();
const querystring = require('querystring');
fetch = require('node-fetch')
const config = require('./../config.json')
const Apollo = require('apollo-client')
const gql = require('graphql-tag')
const ApolloClient = Apollo.ApolloClient
const createNetworkInterface = Apollo.createNetworkInterface

const client = new ApolloClient({
    networkInterface: createNetworkInterface({
        uri: config.apiEndpoint
    })
})

module.exports = function(app, express){

	app.get('/graphcms/categories', function (req, res) {
	  	
	  	client.query({
                query: gql`
                   {
					  allCategories {
					    id
					    title
					  }
					}
                `
            })
            .then((response) => {
                res.send(response.data.allCategories)
            })
		
	})

	app.get('/graphcms/languages', function (req, res) {
	  	
	  	res.send(config.languages);
		
	})

	app.post('/graphcms/submit', function (req, res) {
	  
	  	console.log(req.body.inpTitle);
	  	console.log(req.body.inpCaption);
	  	console.log(req.body.inpCategory);
	  	console.log(req.body.inpLang);
	  	console.log(req.body.inpTime);

	  	res.send(req.body);
	 
	})
}

