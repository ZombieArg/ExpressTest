// JavaScript Document

var request = require('request');

//Set default server URL for local enviroment
var apiOptions = {
	server: "http://localhost:3000"
};

if(process.env.NODE_ENV === "production"){
	apiOptions.server = "https://"; //If application running on a production mode set different base ULR change to be a live address application
}


//Start Skeleton to make an API calls
//Define option for request
var requestOptionsSkeleton = {
	url: "http://yourapi.com/api/path", //Define URL of API call to be made
	method: "GET", //Set request method
	json: {}, //Define body of request even if its an empty JSON object
	qs: {
		offset: 20 //Optionally add any query string parameters that might be used by the API
	}
};

//Make request sending throught options, and supplying a callback function to use response as needed
request(requestOptionsSkeleton,  function (err, response, body) {
	if(err){ //If error has been passed through, do something
		console.log(err);
	}else if (response.statusCode == "200"){ //IF response status is 200 (successful) output JSON body of response
		console.log(body);
	}else {
		console.log(response.statusCode()); //If the response status wasn't 200, do something else
	}
});
//End Skeleton to make an API calls



var _formatDistance = function ( distance ) {
	var numDistance, units;

	if(distance){
		if(distance > 1000){
			numDistance = parseFloat(distance / 1000).toFixed(2);
			unit = " km";
		}else{
			numDistance = parseFloat(distance).toFixed(0);
			unit = " m";
		}

		return numDistance + unit;
	}else{
		console.log("No distance defined");
	}
};

var _showErrors = function (req, res, status ) {
	var title, content;

	if(status === 404){ // if status passed through is 404, set title and content for page
		title = "404, page not found";
		content = "Oh dear, Looks like we can't find this page, sorry.";
	}else{ //Otherwise set a generic catch-call message
		title = status + "Something's gone wrong";
		content = "Something's, somewhere, has gone  just a little bit wrong.";
	}

	res.status(status); //Use status parameter to set response status

	//Send data to view to be compiled and sent to browser
	res.render('generic-text',{
		title: title,
		content: content
	});
};

//External function to render the homepage
var renderHomepage = function (req, res, responseBody) {
	var message; //Define variable to hold a message

	if(!(responseBody instanceof Array)){ //if response isn't an array, set message and set responseBody to be empty array
		message = "API lookup error";
		responseBody = [];
	} else {
		if(!responseBody.length){ //If the response is an array with no length, set message
			message = "No places found nearby";
		}
	}

	res.render('locations-list', {
		title: 'Loc8r - find places to work with wifi',
		pageHeader: {
			title: 'Loc8r',
			strapline: 'Find places to work with wifi near you!'
		},
		sidebar: 'Looking for a wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps  with coffee, cake or a pint? Let Loc8r help you find the place you&rsquo;re looking for.',
		locations: responseBody,
		message: message //Add Message  to variables to send to view
	});
};

var renderDetailPage = function ( req, res, locDetail) { //Add new parameter for data as needed in function definition
	res.render('location-info', {
		title: locDetail.name,  //Reference specific item of data  as needed  in function
		pageHeader: {
			title: locDetail.name
		},
		sidebar: {
			lead: 'Simon&rsquo;s cafe is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
			secondary: 'If you&rsquo;ve been and you like it - or if you don&rsquo;t - please leave a review to help other people just like you.'
		},
		location: locDetail //Pass full locDetail data object to view, containing all details
	});
};

/*Get 'home' page*/
module.exports.homeList = function(req, res){
	var requestOptions, path;

	path = '/api/locations'; //Set path for API request (Server is already defined at top of the file)

	requestOptions = {
		url: apiOptions.server + path, //Define URL of API call to be made
		method: "GET", //Set request method
		json: {}, //Define body of request even if its an empty JSON object
		qs: {
			lng: '-58.4969780', //Optionally add any query string parameters that might be used by the API
			lat: '-34.5760370'
		}
	};

//Make request sending throught options, and supplying a callback function to use response as needed
	request(requestOptions,  function (err, response, body) {
		var i, data;

		 data = body;

		if (response.statusCode === 200  && data.length){ //only run loop format distances if API returned a 200 status and send some data
			for (i = 0; i < data.length; i++){
				data[i].distanceMeters = _formatDistance(data[i].distanceMeters);
			}
		}
		renderHomepage(req, res, data);

	});

};

/*Get 'Location info' page*/
module.exports.locationInfo = function(req, res){
	var requestOption, path;

	path = '/api/locations/' + req.params.locationid; //Get locationid parameter from URL  and append it to API path

	//Set all request option needed to call API
	requestOption = {
		url: apiOptions.server + path,
		method: "GET",
		json: {}
	};


	request(requestOption, function (err, response, body) {

		if(response.statusCode === 200) {
			console.log(body);
			var data = body; //Create copy of returned data in new variable

			data.coords = {
			 lng: body.coords[0],
			 lat: body.coords[1]
			};

			renderDetailPage(req, res, data); //Call renderDetailPage function when API has responded
		}else {
			_showErrors(req, res,  response.statusCode);
		}

	});

};

/*Get 'Add review' page*/
module.exports.addReview = function(req, res){
	res.render('location-review-form', {
		title: 'Add Review',
		pageHeader: {
			title: 'Starcups'
		}
	});
};