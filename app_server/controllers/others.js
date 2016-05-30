// JavaScript Document

module.exports.about = function(req, res){
	res.render('generic-text', {
		title: 'About',
		pageHeader: {
			title: 'About',
			strapline: 'Loc8r was created to help people to find places to sit down and get bit of work done.'
		},
		content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sed lorem ac nisi dignissim accumsan.'
	});
};