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
	  	console.log(new Date(req.body.inpTime).toISOString());
	  	
	  	var mappings = JSON.parse(req.body.mappingsJson);
	  	var mutationQuery;
	  	var variables;

	  	if(mappings.provider === "youtube"){
	  		var ytGraphVars = getYoutubeMapVars(req, mappings);
	  		mutationQuery = ytGraphVars.mutationQuery;
	  		variables = ytGraphVars.variables;
	  	}

	  	if(mappings.provider === "facebook"){
	  		var fbGraphVars = getFacebookMapVars(req, mappings);
	  		mutationQuery = fbGraphVars.mutationQuery;
	  		variables = fbGraphVars.variables;
	  	}

	  	if(mappings.provider === "instagram"){
	  		var igGraphVars = getInstagramMapVars(req, mappings);
	  		mutationQuery = igGraphVars.mutationQuery;
	  		variables = igGraphVars.variables;
	  	}

	  	if(mappings.provider === "website"){
	  		var wpGraphVars = getWebpageMapVars(req, mappings);
	  		mutationQuery = wpGraphVars.mutationQuery;
	  		variables = wpGraphVars.variables;
	  	}

	  	

  		client.mutate({ 
			mutation: mutationQuery, 
			variables: variables
		}).then((response) => {
		    res.send(response.data)
		});

	})

	function getYoutubeMapVars(req, mappings){

		  	var youtubeMutation = gql`mutation (
				$title: String!,
				$caption: String!,
				$timescheduled: DateTime!,
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
		  		$urlnew: String!,
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
				timescheduled: $timescheduled,
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
		  		urlnew: $urlnew,
		  		medialikes: $medialikes,
		  		mediadislikes: $mediadislikes,
		  		mediacomments: $mediacomments,
		  		mediaviews: $mediaviews,
		  		urlthumbnailheight: $urlthumbnailheight,
		  		urlthumbnailwidth: $urlthumbnailwidth,
		  		urlmediaheight: $urlmediaheight,
		  		urlmediawidth: $urlmediawidth,
		  		isPublished: true
		  		) {
			    id
			  }
			}`;

			var ytVariables = {
				title:req.body.inpTitle,
				caption:req.body.inpCaption,
				language:req.body.inpLang,
				categoriesId:req.body.inpCategory,
				timescheduled: new Date(req.body.inpTime).toISOString(),
				timepublished: new Date(mappings.timepublished),
				type: mappings.type,
		  		provider: mappings.provider,
		  		sourcename: mappings.sourcename, //channel name
		  		sourceinfo: mappings.sourceinfo.toString(), //channel subs count
		  		sourceinfo2: mappings.sourceinfo2, //channel subs count
		  		sourceicon: mappings.sourceicon, //channel image
		  		sourceprofile: mappings.sourceprofile,
		  		urlsource:mappings.urlsource,
		  		urlmedia: mappings.urlmedia,
		  		urlthumbnail: mappings.urlthumbnail,
		  		urlnew: req.body.filestackCDN,
		  		medialikes: parseInt(mappings.medialikes) || 0,
		  		mediadislikes: parseInt(mappings.mediadislikes) || 0,
		  		mediacomments: parseInt(mappings.mediacomments) || 0,
		  		mediaviews: parseInt(mappings.mediaviews) || 0,
		  		urlthumbnailheight: parseInt(mappings.urlthubmnailheight) || 0,
		  		urlthumbnailwidth: parseInt(mappings.urlthubmnailwidth) || 0,
		  		urlmediaheight: parseInt(mappings.urlmediaheight) || 0,
		  		urlmediawidth: parseInt(mappings.urlmediawidth) || 0

			}

			return {
				mutationQuery: youtubeMutation,
				variables: ytVariables
			};
	}

	function getFacebookMapVars(req, mappings){

		  	var fbMutation = gql`mutation (
				$title: String!,
				$caption: String!,
				$language: String!,
				$categoriesId: ID!,
				$timescheduled: DateTime!,
				$timepublished: DateTime!,
				$type: String!,
		  		$provider: String!,
		  		$sourcename: String!,
		  		$sourceinfo: String!,
		  		$sourceicon: String!,
		  		$sourceprofile: String!,
		  		$urlsource: String!,
		  		$urlmedia: String!,,
		  		$urlthumbnail: String!,
		  		$urlnew: String!,
		  		$medialikes: Int!,
		  		$mediacomments: Int!,
		  		$urlthumbnailheight: Int!,
		  		$urlthumbnailwidth: Int!
			  ){
			  createPost(
			  	title: $title,
				caption: $caption,
				language: $language,
				categoriesId: $categoriesId,
				timescheduled: $timescheduled,
				timepublished: $timepublished,
				type: $type,
		  		provider: $provider,
		  		sourcename: $sourcename,
		  		sourceinfo: $sourceinfo,
		  		sourceicon: $sourceicon,
		  		sourceprofile: $sourceprofile,
		  		urlsource: $urlsource,
		  		urlmedia: $urlmedia,,
		  		urlthumbnail: $urlthumbnail,
		  		urlnew: $urlnew,
		  		medialikes: $medialikes,
		  		mediacomments: $mediacomments,
		  		urlthumbnailheight: $urlthumbnailheight,
		  		urlthumbnailwidth: $urlthumbnailwidth,
		  		isPublished: true) {
			    id
			  }
			}`;

			var fbVariables = {
				title:req.body.inpTitle,
				caption:req.body.inpCaption,
				language:req.body.inpLang,
				categoriesId:req.body.inpCategory,
				timescheduled: new Date(req.body.inpTime).toISOString(),
				timepublished: new Date(mappings.timepublished),
				type: mappings.type,
		  		provider: mappings.provider,
		  		sourcename: mappings.sourcename, 
		  		sourceinfo: mappings.sourceinfo.toString(), 
		  		sourceicon: mappings.sourceicon,
		  		sourceprofile: mappings.sourceprofile,
		  		urlsource: mappings.urlsource,
		  		urlmedia: mappings.urlmedia,
		  		urlthumbnail: mappings.urlthubmnail || '#',
		  		urlnew: req.body.filestackCDN,
		  		medialikes: parseInt(mappings.medialikes) || 0,
		  		mediacomments: parseInt(mappings.mediacomments) || 0,
		  		urlthumbnailheight: parseInt(mappings.urlthubmnailheight) || 0,
		  		urlthumbnailwidth: parseInt(mappings.urlthubmnailwidth) || 0
			}

			return {
				mutationQuery: fbMutation,
				variables: fbVariables
			};
	}

	function getInstagramMapVars(req, mappings){

	  	var igMutation = gql`mutation (
			$title: String!,
			$caption: String!,
			$language: String!,
			$categoriesId: ID!,
			$timescheduled: DateTime!,
			$timepublished: DateTime!,
			$type: String!,
	  		$provider: String!,
	  		$sourcename: String!,
	  		$sourcename2: String!,
	  		$sourceinfo: String!,
	  		$sourceicon: String!,
	  		$sourceprofile: String!,
	  		$urlsource: String!,
	  		$urlmedia: String!,,
	  		$urlthumbnail: String!,
	  		$urlnew: String!,
	  		$medialikes: Int!,
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
			language: $language,
			categoriesId: $categoriesId,
			timescheduled: $timescheduled,
			timepublished: $timepublished,
			type: $type,
	  		provider: $provider,
	  		sourcename: $sourcename,
	  		sourcename2: $sourcename2,
	  		sourceinfo: $sourceinfo,
	  		sourceicon: $sourceicon,
	  		sourceprofile: $sourceprofile,
	  		urlsource: $urlsource,
	  		urlmedia: $urlmedia,
	  		urlthumbnail: $urlthumbnail,
	  		urlnew: $urlnew,
	  		medialikes: $medialikes,
	  		mediacomments: $mediacomments,
	  		mediaviews: $mediaviews,
	  		urlthumbnailheight: $urlthumbnailheight,
	  		urlthumbnailwidth: $urlthumbnailwidth,
	  		urlmediaheight: $urlmediaheight,
	  		urlmediawidth: $urlmediawidth,
	  		isPublished: true) {
		    id
		  }
		}`;

		var igVariables = {
			title:req.body.inpTitle,
			caption:req.body.inpCaption,
			language:req.body.inpLang,
			categoriesId:req.body.inpCategory,
			timescheduled: new Date(req.body.inpTime).toISOString(),
			timepublished: new Date(mappings.timepublished),
			type: mappings.type,
	  		provider: mappings.provider,
	  		sourcename: mappings.sourcename, 
	  		sourcename2: mappings.sourcename2, 
	  		sourceinfo: mappings.sourceinfo.toString(), 
	  		sourceicon: mappings.sourceicon,
	  		sourceprofile: mappings.sourceprofile,
	  		urlsource: mappings.urlsource,
	  		urlmedia: mappings.urlmedia,
	  		urlthumbnail: mappings.urlthubmnail,
	  		urlnew: req.body.filestackCDN,
	  		medialikes: parseInt(mappings.medialikes),
	  		mediacomments: parseInt(mappings.mediacomments),
	  		mediaviews: parseInt(mappings.mediaviews),
	  		urlthumbnailheight: parseInt(mappings.urlthubmnailheight),
	  		urlthumbnailwidth: parseInt(mappings.urlthubmnailwidth),
	  		urlmediaheight: parseInt(mappings.urlmediaheight),
	  		urlmediawidth: parseInt(mappings.urlmediawidth)
		}

		return {
			mutationQuery: igMutation,
			variables: igVariables
		};
	}

	function getWebpageMapVars(req, mappings){

	  	var wpMutation = gql`mutation (
			$title: String!,
			$caption: String!,
			$language: String!,
			$categoriesId: ID!,
			$timescheduled: DateTime!,
			$timepublished: DateTime!,
			$type: String!,
	  		$provider: String!,
	  		$sourcename: String!,
	  		$sourcename2: String!,
	  		$sourceicon: String!,
	  		$sourceprofile: String!,
	  		$urlsource: String!,
	  		$urlnew: String!
		  ){
		  createPost(
		  	title: $title,
			caption: $caption,
			language: $language,
			categoriesId: $categoriesId,
			timescheduled: $timescheduled,
			timepublished: $timepublished,
			type: $type,
	  		provider: $provider,
	  		sourcename: $sourcename,
	  		sourcename2: $sourcename2,
	  		sourceicon: $sourceicon,
	  		sourceprofile: $sourceprofile,
	  		urlsource: $urlsource,
	  		urlnew: $urlnew,
	  		isPublished: true) {
		    id
		  }
		}`;

		var wpMutationNoPubDate = gql`mutation (
			$title: String!,
			$caption: String!,
			$language: String!,
			$categoriesId: ID!,
			$timescheduled: DateTime!,
			$type: String!,
	  		$provider: String!,
	  		$sourcename: String!,
	  		$sourcename2: String!,
	  		$sourceicon: String!,
	  		$sourceprofile: String!,
	  		$urlsource: String!,
	  		$urlnew: String!,
		  ){
		  createPost(
		  	title: $title,
			caption: $caption,
			language: $language,
			categoriesId: $categoriesId,
			timescheduled: $timescheduled,
			type: $type,
	  		provider: $provider,
	  		sourcename: $sourcename,
	  		sourcename2: $sourcename2,
	  		sourceicon: $sourceicon,
	  		sourceprofile: $sourceprofile,
	  		urlsource: $urlsource,
	  		urlnew: $urlnew,
	  		isPublished: true) {
		    id
		  }
		}`;

		var wpVariables = {
			title:req.body.inpTitle,
			caption:req.body.inpCaption,
			language:req.body.inpLang,
			categoriesId:req.body.inpCategory,
			timescheduled: new Date(req.body.inpTime).toISOString(),
			type: mappings.type,
	  		provider: mappings.provider,
	  		sourcename: mappings.sourcename, 
	  		sourcename2: mappings.sourcename2, 
	  		sourceicon: mappings.sourceicon, 
	  		sourceprofile: mappings.sourceprofile ? mappings.sourceprofile : '',
	  		urlsource: mappings.urlsource,
	  		urlnew: req.body.filestackCDN
		}

		if(mappings.timepublished != 'n/a'){
			wpVariables.timepublished = mappings.timepublished;
		}

		return {
			mutationQuery: mappings.timepublished != 'n/a' ? wpMutation : wpMutationNoPubDate,
			variables: wpVariables
		};
	}
}

