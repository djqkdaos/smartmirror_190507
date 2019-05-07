function Email($scope, $http, $interval, EmailService) {

	var getEmail = function(){
		
			EmailService.getEmailEvents();
			
			$scope.email = EmailService.getEvents();
		
	}

	getEmail();
	$interval(getEmail, config.calendar.refreshInterval * 6000 || 180000)
}

angular.module('SmartMirror')
    .controller('Email', Email);