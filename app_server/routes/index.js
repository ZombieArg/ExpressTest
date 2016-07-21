var express = require('express');
var router = express.Router();
/*var ctrlMain = require('../controllers/main');*/
var ctrlLocations = require('../controllers/locations');
var ctrlOthers = require('../controllers/others');


/*Locations*/
router.get('/', ctrlOthers.angularApp); //SPA:Set homepage route to use new controller
/*router.get('/location/:locationid', ctrlLocations.locationInfo);
router.get('/location/:locationid/review/new', ctrlLocations.addReview); //Insert location parameter into existing route for review form
router.post('/location/:locationid/review/new', ctrlLocations.doAddReview); //Create new route on same URL but using post method and referencing different controller*/

/*Others*/
router.get('/about', ctrlOthers.about);


module.exports = router;
