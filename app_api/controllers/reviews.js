/**
 * Created by Zombie on 01/06/2016.
 */

var mongoose =  require('mongoose');
var loc = mongoose.model('Location');
var User = mongoose.model('User'); //Ensure the model user is available

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

//Add review when provided with a parent document
var doAddReview = function (req, res, location, author) { //Add an author parameter to function definition
  if(!location){
      sendJsonResponse(res, 404, {
          "Message" : "location not found"
      });
  }else{

      //Push new data into subdocument array
      location.reviews.push({
          author : author, //Use author parameter when creating review subdocument
          rating : req.body.rating,
          reviewText : req.body.reviewText
      });


      //Saving it
      location.save(function (err, location) {
         var thisReview;
          if(err){
              console.log(err);
              sendJsonResponse(res, 400, err);
          }else{
              //On successful save operation call function to update average rating
              updateAverageRating(location._id);
              //Retrieve last review added to array and returned as JSON confirmation response
              thisReview = location.reviews[location.reviews.length - 1];
              sendJsonResponse(res, 201, thisReview);
          }
      });
  }
};

//Find Document to update Rating
var updateAverageRating = function(locationid){
    //Find Document by given ID
    loc.findById(locationid).select("rating reviews").exec( function (err, location) {
        if(!err){
            doSetAverageRating(location);
        }
    });

};

//Set Rating

var doSetAverageRating = function (location) {
    var i, reviewCount, ratingAverage, ratingTotal;
    if(location.reviews && location.reviews.length > 0){
        reviewCount = location.reviews.length;
        ratingTotal = 0;

        //Loop Through review subdocs adding up ratings
        for(i = 0; i < reviewCount; i++){
            ratingTotal = ratingTotal + location.reviews[i].rating;
        }
        //Calculate average rating
        ratingAverage = parseInt( ratingTotal / reviewCount , 10);

        //Update rating of paretn document
        location.rating = ratingAverage;

        //Save parent document
        location.save(function (err) {
            if (err){
                sendJsonResponse(res, 404, err);
            }else{
                console.log("Average rating updated to " + ratingAverage);
            }

        });
    }

};

var getAuthor = function (req, res, callback) {

    if(req.payload && req.payload.email){ //Validate that JWT information is on the request object
        User.findOne({ //User email address to find user
            email : req.payload.email})
            .exec(function (err, user) {
                if(!user){
                    sendJsonResponse(res, 404, {
                        "message" : "User not found"
                    });
                    return;
                }else if(err){
                    console.log(err);
                    sendJsonResponse(res, 404, err);
                    return;
                }

                callback(req, res, user.name);
            });

    }else{
        sendJsonResponse(res, 404, {
            "message" : "User not found"
        });
        return;
    }

};


/*Create review*/
module.exports.reviewsCreate = function (req, res) {

    getAuthor(req, res, function (req, res, userName) { //Call getAuthor function, and pass original controller code in as a callback; pass user's name into callback

        if(req.params.locationid){
            loc.findById(req.params.locationid).select("reviews").exec( function (err, location) {
              if(err){
                  sendJsonResponse(res, 404, err);
              }else{
                  //Successful find operation will call new function to add review, passing request, response, and location objects
                  doAddReview(req, res, location, userName); //Pass user's name into doAddReview function
              }
            });
        }else{
            sendJsonResponse(res, 404, {"message" : "Not Found, locationId required"});
        }

    }); //Close getAuthor function
};

/*Get review*/
module.exports.reviewsReadOne = function (req, res) {

    //Verify reviewid exist as a parameter
    if(req.params && req.params.locationid && req.params.reviewid){

        //Find parent document, Add mongoose select method to model query stating we want to get name location and its reviews
        loc.findById(req.params.locationid).select('name reviews').exec(function (err, location) {
            var response, review;
            if(!location){
                sendJsonResponse(res, 404, {'message': 'locationid not found'});
                return;
            } else if (err){
                sendJsonResponse(res, 404, err);
                return;
            }

            //Find subdocument, Check that returned location has revies
            if(location.reviews && location.reviews.length > 0){
                //Use subdocument .id method a helper for searching for matching ID
                review = location.reviews.id(req.params.reviewid);
                if(!review){
                    sendJsonResponse(res, 404, {'message': 'reviewid not found'});
                    return;
                } else{
                    //If review is found  build response object returning review and location  name and ID
                    response = {
                        location: {
                            name: location.name,
                            id: req.params.locationid
                        },
                        review : review
                    };

                    sendJsonResponse(res, 202, response);
                }
            } else {
            //If no reviews are found return the appropriated error message
            sendJsonResponse(res, 404, {'message': 'No reviews found'});
         }
        });
    } else{
        sendJsonResponse(res, 404, {'message': 'No found locationid and reviewid are both required'});
    }



};

/*Update review*/
module.exports.reviewsUpdateOne = function (req, res) {
    if(!req.params.locationid || !req.params.reviewid){
        sendJsonResponse(res, 404, {'message': 'Not found, locationid and reviewid are required'});
        return;
    }

    //Find parent document
    loc.findById(req.params.locationid).select('reviews').exec(function (err, location) {
        var thisReview;

        if (!location){
            sendJsonResponse(res, 404, {'message': 'Location not found'});
            return;
        }else if (err){
            sendJsonResponse(res, 404, err);
            return;
        }


        if(location.reviews && location.reviews.length > 0 ){
            //Find subdocument
            thisReview = location.reviews.id(req.params.reviewid);

            if(!thisReview){
                sendJsonResponse(res, 404, {'message': 'Reviewid not found'});
            }else{

                //Make changes to subdocument from supplied form data
                thisReview.author = req.body.author;
                thisReview.rating = req.body.rating;
                thisReview.reviewText = req.body.reviewText;

                //Save parent document
                location.save(function (err, location) {
                   if(err){
                       sendJsonResponse(res, 404, err);
                   }else{
                       updateAverageRating(location._id);
                       sendJsonResponse(res, 200, thisReview);
                   }
                });

            }
        }else{
            sendJsonResponse(res, 404, {'message': 'No Review updated'});
        }


    });
};


/*Delete review*/
module.exports.reviewsDeleteOne = function (req, res) {

    if(!req.params.locationid || !req.params.reviewid){
        sendJsonResponse(res, 404, {'message': 'Not found, locationid and reviewid are required'});
        return;
    }

    //Find relevant parent document
    loc.findById(req.params.locationid).select("reviews").exec( function (err, location) {

        if (!location){
            sendJsonResponse(res, 404, {'message': 'Location not found'});
            return;
        }else if (err){
            sendJsonResponse(res, 404, err);
            return;
        }

        if(location.reviews && location.reviews.length > 0 ) {

            if (!location.reviews.id(req.params.reviewid)) {
                sendJsonResponse(res, 404, {'message': 'Reviewid not found'});
            } else {

                //Find and delete relevant subdocument in one step
                location.reviews.id(req.params.reviewid).remove();
                
                //Save parent document
                location.save(function (err) {
                    if(err){
                        sendJsonResponse(res, 404, err);
                    }else {
                        updateAverageRating(location._id);
                        sendJsonResponse(res, 204, null);
                    }
                })
            }
        }
    });



};