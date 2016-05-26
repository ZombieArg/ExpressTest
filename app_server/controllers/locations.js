// JavaScript Document

/*Get 'home' page*/
module.exports.homeList = function(req, res){
	res.render('locations-list', {title: 'Home'});
};

/*Get 'Location info' page*/
module.exports.locationInfo = function(req, res){
	res.render('location-info', {title: 'Location info'});
};

/*Get 'Add review' page*/
module.exports.addReview = function(req, res){
	res.render('location-review-form', {title: 'Add Review'});
};