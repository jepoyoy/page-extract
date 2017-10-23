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
	  	
	  	var mappings = JSON.parse(req.body.mappingsJson);

	  	if(mappings.provider === "youtube"){
	  	
		  	var youtubeMutation = gql`mutation (
				$title: String!,
				$caption: String!,
				$timepublished: DateTime!,
				$language: String!,
				$categoriesId: ID!,
				$type: String!,
		  		$provider: String!,
		  		$sourcename: String!,
		  		$sourceinfo: String!,
		  		$sourceinfo2: String!,
		  		$sourceicon: String!,
		  		$sourceprofile: String!,
		  		$urlsource: String!,
		  		$urlmedia: String!,,
		  		$urlthumbnail: String!,
		  		$medialikes: Int!,
		  		$mediadislikes: Int!,
		  		$mediacomments: Int!,
		  		$mediaviews: Int!,
		  		$urlthumbnailheight: Int!,
		  		$urlthumbnailwidth: Int!,
		  		$urlmediaheight: Int!,
		  		$urlmediawidth: Int!
			  ){
			  createPost(
			  	title: $title,
				caption: $caption,
				timepublished: $timepublished,
				language: $language,
				categoriesId: $categoriesId,
				type: $type,
		  		provider: $provider,
		  		sourcename: $sourcename,
		  		sourceinfo: $sourceinfo,
		  		sourceinfo2: $sourceinfo2,
		  		sourceicon: $sourceicon,
		  		sourceprofile: $sourceprofile,
		  		urlsource: $urlsource,
		  		urlmedia: $urlmedia,,
		  		urlthumbnail: $urlthumbnail,
		  		medialikes: $medialikes,
		  		mediadislikes: $mediadislikes,
		  		mediacomments: $mediacomments,
		  		mediaviews: $mediaviews,
		  		urlthumbnailheight: $urlthumbnailheight,
		  		urlthumbnailwidth: $urlthumbnailwidth,
		  		urlmediaheight: $urlmediaheight,
		  		urlmediawidth: $urlmediawidth) {
			    id
			  }
			}`;

			client.mutate({ 
			mutation: youtubeMutation, 
			variables: {
				title:req.body.inpTitle,
				caption:req.body.inpCaption,
				language:req.body.inpLang,
				categoriesId:req.body.inpCategory,
				timepublished: new Date(req.body.inpTime),
				type: mappings.type,
		  		provider: mappings.provider,
		  		sourcename: mappings.sourcename, //channel name
		  		sourceinfo: mappings.sourceinfo, //channel subs count
		  		sourceinfo2: mappings.sourceinfo2, //channel subs count
		  		sourceicon: mappings.sourceicon, //channel image
		  		sourceprofile: mappings.sourceprofile,
		  		urlsource:mappings.urlmedia,
		  		urlmedia: mappings.urlmedia,
		  		urlthumbnail: mappings.urlthubmnail || '#',
		  		medialikes: parseInt(mappings.medialikes) || 0,
		  		mediadislikes: parseInt(mappings.mediadislikes) || 0,
		  		mediacomments: parseInt(mappings.mediacomments) || 0,
		  		mediaviews: parseInt(mappings.mediaviews) || 0,
		  		urlthumbnailheight: parseInt(mappings.urlthubmnailheight) || 0,
		  		urlthumbnailwidth: parseInt(mappings.urlthubmnailwidth) || 0,
		  		urlmediaheight: parseInt(mappings.urlmediaheight) || 0,
		  		urlmediawidth: parseInt(mappings.urlmediawidth) || 0

			} 
			}).then((response) => {
			    res.send(response.data)
			})
	  	}

	})
}

