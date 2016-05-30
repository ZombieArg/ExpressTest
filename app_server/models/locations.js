/**
 * Created by Zombie on 30/05/2016.
 */
//Require mongoose
var mongoose = require('mongoose');

//Defining a new Schema
var locationSchema = new mongoose.schema({
    name: {type: String, required: true}, //Required
    address: String,
    rating: {type: Number, "default": 0, min: 0, max: 5}, //Default value, min and max number
    facilities: [String], //Array of strings
    coords: {type: [Number], index: '2dsphere'}
});