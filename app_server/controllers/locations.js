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

/*Get 'home' page*/
module.exports.homeList = function(req, res){
	var requestOptions, path;

	path = '/api/locations'; //Set path for API request (Server is alredy defined at top of the file)

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
	res.render('location-info', {
		title: 'Location info',
		pageHeader: {
			title: 'Starcups',
		},
		sidebar: {
			lead: 'Simon&rsquo;s cafe is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
			secondary: 'If you&rsquo;ve been and you like it - or if you don&rsquo;t - please leave a review to help other people just like you.'
		},
		location: {
			name: 'Starcups',
			address: '125 High Street, Reading, RG6 1PS',
			rating: 3,
			facilities: ['Hot Drinks','Food','Premium wifi'],
			coords: [-0.9690884, 51.455041],
			openingTimes: [{
				days: 'Monday - Friday',
				opening: '7:00am',
				closing: '7:00pm',
				closed: false
			},{
				days: 'Saturday',
				opening: '8:00am',
				closing: '5:00pm',
				closed: false
			},{
				days: 'Sunday',
				closed: true
			}]
		},
		reviews:[{
			author: 'Eduardo Pan',
			rating: 4,
			timeStamp: '14 July 2016',
			reviewText: 'What a great place. I can&rsquo;t say enough good thing about it.'
		},{
			author: 'Sigmund Freud',
			rating: 2,
			timeStamp: '17 July 2016',
			reviewText: 'It was okay. Coffe sucks, but the wifi was fast.'
		}]
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