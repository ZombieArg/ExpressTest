var express = require('express');
var router = express.Router();
var jwt = require('express-jwt'); //Require express-jwt module
var auth = jwt({
    secret: process.env.JWT_SECRET, //Set secret using name environment variable as before
    userProperty: 'payload' //Define property on req to be payload
});
/*var ctrlMain = require('../controllers/main');*/
var ctrlLocations = require('../controllers/locations');
var ctrlReviews = require('../controllers/reviews');
var ctrlAuth = require('../controllers/authentication');


/*Locations*/
router.get('/locations', ctrlLocations.locationsListByDistance);
router.post('/locations', ctrlLocations.locationsCreate);
router.get('/locations/:locationid', ctrlLocations.locationsReadOne);
router.put('/locations/:locationid', ctrlLocations.locationsUpdateOne);
router.delete('/locations/:locationid', ctrlLocations.locationsDeleteOne);

/*Reviews*/
router.post('/locations/:locationid/reviews/', auth, ctrlReviews.reviewsCreate);
router.get('/locations/:locationid/reviews/:reviewid', ctrlReviews.reviewsReadOne);
router.put('/locations/:locationid/reviews/:reviewid', auth, ctrlReviews.reviewsUpdateOne);
router.delete('/locations/:locationid/reviews/:reviewid', auth, ctrlReviews.reviewsDeleteOne);

/*Authentication*/
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);


module.exports = router;
