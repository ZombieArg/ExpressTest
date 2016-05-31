// JavaScript Document

/*Get 'home' page*/
module.exports.homeList = function(req, res){
	res.render('locations-list', {
		title: 'Loc8r - find places to work with wifi',
		pageHeader: {
			title: 'Loc8r',
			strapline: 'Find places to work with wifi near you!'
		},
		sidebar: 'Looking for a wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps  with coffee, cake or a pint? Let Loc8r help you find the place you&rsquo;re looking for.',
		locations: [{
			name: 'Starcups',
			address: '125 High Street, Reading, RG6 1PS',
			rating: 3,
			facilities: ['Hot Drinks','Food','Premium wifi'],
			distance: '150m'
		},{
			name: 'Cafe Hero',
			address: '135 High Street, Reading, RG6 1PS',
			rating: 4,
			facilities: ['Hot Drinks','Food','Premium wifi'],
			distance: '200m'
		},{
			name: 'Burger Queen',
			address: '150 High Street, Reading, RG6 1PS',
			rating: 1,
			facilities: ['Food','Premium wifi'],
			distance: '300m'
		}]
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
			coords: {
				lat: '51.455041',
				long: '-0.9690884'
			},
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