/**
 * Created by Zombie on 01/06/2016.
 */

var mongoose =  require('mongoose');
var loc = mongoose.model('Location');

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};


/*Create review*/
module.exports.reviewsCreate = function (req, res) {

};

/*Get review*/
module.exports.reviewsReadOne = function (req, res) {
    if(req.params && req.params.locationid && req.params.reviewid){
        loc.findById(req.params.locationid).select('name reviews').exec(function (err, location) {
            var response, review;
            if(!location){
                sendJsonResponse(res, 404, {'message': 'locationid not found'});
                return;
            } else if (err){
                sendJsonResponse(res, 404, err);
                return;
            }

            if(location.reviews && location.reviews.length > 0){
                review = location.reviews.id(req.params.reviewid);
                if(!review){
                    sendJsonResponse(res, 404, {'message': 'reviewid not found'});
                    return;
                } else{
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
            sendJsonResponse(res, 404, {'message': 'No reviews found'});
         }
        });
    } else{
        sendJsonResponse(res, 404, {'message': 'No found locationid and reviewid are both required'});
    }



};

/*Update review*/
module.exports.reviewsUpdateOne = function (req, res) {

};


/*Delete review*/
module.exports.reviewsDeleteOne = function (req, res) {

};