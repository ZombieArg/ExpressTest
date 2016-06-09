/**
 * Created by Zombie on 30/05/2016.
 */
//Require mongoose
var mongoose = require('mongoose');

//Subdocument Schema
var openingTimeSchema = new mongoose.Schema({
    days: {type: String, required: true},
    opening: String,
    closing: String,
    closed: {type: Boolean, required: true}
});

//Subdocument Schema
var reviewSchema = new mongoose.Schema({
    author: {type: String, required: true},
    rating: {type: Number, required: true, min: 0, max: 5},
    reviewText: String,
    createdOn: {type: Date, "default": Date.now}
});


//Defining a new Schema
var locationSchema = new mongoose.Schema({
    name: {type: String, required: true}, //Required
    address: String,
    rating: {type: Number, "default": 0, min: 0, max: 5}, //Default value, min and max number
    facilities: [String], //Array of strings
    coords: {type: [Number], index: '2dsphere', required: true},
    openingTimes: [openingTimeSchema],
    reviews: [reviewSchema]
});

mongoose.model('Location', locationSchema);