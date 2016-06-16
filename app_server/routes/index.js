var express = require('express');
var router = express.Router();
/*var ctrlMain = require('../controllers/main');*/
var ctrlLocations = require('../controllers/locations');
var ctrlOthers = require('../controllers/others');


/*Locations*/
router.get('/', ctrlLocations.homeList);
router.get('/locations/:locationid', ctrlLocations.locationInfo);
router.get('/locations/review/new', ctrlLocations.addReview);

/*Others*/
router.get('/about', ctrlOthers.about);


module.exports = router;
