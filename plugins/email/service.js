(function () {
	'use strict';

	function EmailService($window, $http, $q) {
		var service = {};

		service.events = [];

		var uName = global.name;

		service.getEmailEvents = function () {
		
			
		var imaps = require('imap-simple');
				
				//var userI = config.userData[uName].email;

				var emailConfig = {
					imap: {
						user: "yoona7394@gmail.com",
						password: "min@148454@",
						host: 'imap.gmail.com',
						port: 993,
						tls: true,
						authTimeout: 3000
					}
						
				};
				imaps.connect(emailConfig).then(function (connection) {
					
					
				 
					return connection.openBox('INBOX').then(function () {

						var delay = 24 * 3600 * 1000;
						var yesterday = new Date();
							yesterday.setTime(Date.now() - delay);
							yesterday = yesterday.toISOString();
						var searchCriteria = ['UNSEEN', ['SINCE', yesterday]];
		
				 
						var fetchOptions = {
							bodies: ['HEADER', 'TEXT'],
							markSeen: false
						};
				 
						return connection.search(searchCriteria, fetchOptions).then(function (results) {
							var subjects = results.map(function (res) {
								return res.parts.filter(function (part) {
									return part.which === 'HEADER';
								})[0].body.subject[0];
							});
				 
							console.log(subjects);
							for(var i =0; i<subjects.length; i++){
							service.events[i] = subjects[i];
							
							}
						});
					});
				});
		
			

		}
	

		

		

		


		service.getEvents = function () {
			return service.events;
		}

		
		

		return service;
	}

	angular.module('SmartMirror')
    .factory('EmailService', EmailService);
} ());
