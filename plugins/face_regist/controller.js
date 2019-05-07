
function Face_Regist($scope, $http, SpeechService, Focus) {
	
	
	var exec = require('child_process').exec;	
	console.debug('얼굴등록 컨트롤러 추가 완료');
		
	var uName = "";
	var faceUrl ="";
    // 얼굴인식 커맨드 추가
	SpeechService.addCommand('face_regist', function () {
		
		$scope.face = "사용자를 등록하겠습니다 누구(으)로 해 줘 라고 말해주세요.";
		if(responsiveVoice.voiceSupport()) {
          responsiveVoice.speak("사용자등록을 진행하겠습니다 이름을 이야기 해주세요.","Korean Female");
        }

	
		SpeechService.addCommand('user_name', function (userName) {
		var user = userName;
		uName = user;
		$scope.face = user+"님이 맞습니까? 맞아 거울아 혹은 아니야 거울아 로 대답해주세요.";
		if(responsiveVoice.voiceSupport()) {
          responsiveVoice.speak(user+"님이 맞습니까?","Korean Female");
        }
		userNameRegist();
		Focus.change("face_regist");
	});
	
	function userNameRegist(){
		
		SpeechService.addCommand('checkName', function (ans) {
				var an = ans;
				if(an == '맞아'){
					  $scope.face = "그럼 사진을 찍겠습니다.";
					 if(responsiveVoice.voiceSupport()) {
						responsiveVoice.speak("그럼 사진을 찍겠습니다.","Korean Female");
					 }
					camera()
					setTimeout(interval, 2000);
				}else{
					  $scope.face = "아니라면 이름을 다시 누구(으)로 해줘 라고 말해주세요.";
					  if(responsiveVoice.voiceSupport()) {
					 responsiveVoice.speak("죄송합니다 다시 이름을 이야기 해주세요.","Korean Female");
						 }
		}
		Focus.change("face_regist");
		});
	}
		//------------------------------------------------
		
		//------------------------------------------------
		var formatted ="";
		var filename = "";
		function camera(){
			var fs = require('fs');

			var gcs = require('@google-cloud/storage')({
						projectId: 'mindful-ship-176106',
						keyFilename: '/home/pi/smart-mirror/plugins/face_detection/keyfile.json'
					});

			var datetime = require('node-datetime');
			var dt = datetime.create();
			 formatted = dt.format('YmdHMS');
			

			
			
			child = exec('raspistill -br 55 -w 1920 -h 1080 -t 500 -o /home/pi/smart-mirror/face_img/'+formatted+'face.jpg',
				function (error, stdout, stderr) {
				console.log('stdout: ' + stdout);
				console.log('stderr: ' + stderr);
				$scope.image = '/home/pi/smart-mirror/'+formatted+'face.jpg';
				if (error !== null) {
			 console.log('exec error: ' + error);
						  }
			});
			filename = formatted+'face.jpg';
			faceUrl = 'https://storage.googleapis.com/smartmirrortest/'+filename;
			
		

		}
		function interval(){	
				
				global.gcs = require('@google-cloud/storage')({
  					projectId: 'mindful-ship-176106',
 					keyFilename: '/home/pi/smart-mirror/plugins/face_detection/keyfile.json'
				});

				var bucketName = 'smartmirrortest'
				
				// Reference an existing bucket.
				var bucket = gcs.bucket(bucketName);
		
				// Upload a local file to a new file to be created in your bucket.
				bucket.upload('/home/pi/smart-mirror/face_img/'+formatted+'face.jpg', function(err, file) {
 					 if (!err) {
  					  bucket.file(filename).makePublic().then(() => {
						console.log(`gs:${bucketName}/${filename} is now public.`);
						$scope.face = "얼굴등록 진행중";
						
						$scope.faceUrl = faceUrl;
					
						setTimeout(faceCreatePersonInterval,1500);
						setTimeout(addPersonInterval, 4500);
			
						}).catch((err) => {
						console.error('ERROR:', err);
				});
 				}
				});

				
			

		}
		
		//face detection
	var axios = require("axios");
	const MSCSFACEAPI = require("mscs-face-api");
	var Key = 'c73ed2e95e6e42cd8f586ff3b22f913c';
	var useServer = 'WCUS';
	var mscsfa = new MSCSFACEAPI(Key,"WCUS");
	var personGroupId = 'ditmirrorgroup';
	var confidenceThreshold = 0.4;
	//483cb6be-dca9-4f7a-9e3d-9093c870e970 - 최민준

	//bda63cd9-5920-44f2-8b52-261a7f1410b2 - 김남억

	//2b6a5be2-9036-4927-b88d-dde51edbc0b7 - 동근이형

	var userData = 'dit smart mirror team';
	var personId = '483cb6be-dca9-4f7a-9e3d-9093c870e970';
	var personImage = faceUrl;
	
	mscsfa.trainPersonGroup(personGroupId);
	mscsfa.getPersonGroupTrainingStatus(personGroupId);
	mscsfa.getPersonGroup(personGroupId);

	function faceCreatePersonInterval(){
		console.log(faceUrl+"을 분석합니다.");
	 mscsfa.createPerson(personGroupId, uName, userData);
		
	}
	
		
	//mscsfa.createPerson(personGroupId, name, userData);		

	function addPersonInterval(){
	
		mscsfa.addPersonFace(personGroupId, global.pIdValue, userData, personImage);
		 if(responsiveVoice.voiceSupport()) {
						responsiveVoice.speak("등록이 완료되었습니다.","Korean Female");
					 }
		var text = '{"'+global.pIdValue+'":"'+uName+'"}';
		var obj = JSON.parse(text);
		var updater = require('jsonfile-updater');
		var fs = require('fs')
		function getParsedPackage() {
			 return JSON.parse(fs.readFileSync('/home/pi/smart-mirror/config.json'))
		}
		console.log('수정');
		updater('/home/pi/smart-mirror/config.json').append('faceDetection.personId', obj , function(err) {
			  if (err) return console.log(err)
			  var pkg = getParsedPackage()
			  console.log(pkg.author)
		})
	
		
	}
	
	
	 
	
		
	
	/*
	

	
	
	var personId = ', "personId": [{  "' + global.pIdValue +'" : "'+uName +'"'   +   ' }]';
 
		

		var jsonfile = require('jsonfile');
		var file = '/home/pi/smart-mirror/config.json';
		var obj = {
	  "general": {
		"language": "ko",
		"layout": "main",
		"commandsPerPage": 10
	  },
	  "speech": {
		"device": "default",
		"keyFilename": "./keyfile.json",
		"hotwords": [
		  {
			"keyword": "거울아",
			"model": "smart_mirror.pmdl"
		  }
		],
		"sensitivity": 1
	  },
	  "remote": {
		"enabled": true,
		"port": 8080
	  },
	  "lastfm": {
		"refreshInterval": 0.6
	  },
	  "fitbit": {
		"timeout": 10000,
		"uris": {
		  "authorizationUri": "https://www.fitbit.com",
		  "authorizationPath": "/oauth2/authorize",
		  "tokenUri": "https://api.fitbit.com",
		  "tokenPath": "/oauth2/token"
		},
		"authorization_uri": {
		  "redirect_uri": "http://localhost:4000/fitbit_auth_callback/",
		  "response_type": "code",
		  "scope": "activity nutrition profile settings sleep social weight heartrate",
		  "state": "3(#0/!~"
		}
	  },
	  "giphy": {
		"key": "dc6zaTOxFJmzC"
	  },
	  "greeting": {
		"option": "allDay"
	  },
	  "calendar": {
		"icals": [
		  "https://calendar.google.com/calendar/ical/yoona7394%40gmail.com/private-dd39043e3386c9761f589853dcd64e36/basic.ics\r\n"
		],
		"maxResults": 9,
		"maxDays": 9,
		"showCalendarNames": true
	  },
	  "rss": {
		"refreshInterval": 120
	  },
	  "geoPosition": {
		"latitude": "35.164631",
		"longitude": "129.071321"
	  },
	  "youtube": {
		"key": "AIzaSyC7fXd8dHhCWxNxYxcCJX9f6mUUA57Qx-Y"
	  },
	  "autoTimer": {
		"mode": "disabled",
		"autoWake": "07:00:00",
		"autoSleep": 40,
		"wakeCmd": "sudo ./scripts/raspi-monitor.sh on > /dev/null 2>&1",
		"sleepCmd": "sudo ./scripts/raspi-monitor.sh off > /dev/null 2>&1"
	  },
	  "traffic": {
		"key": "AtLxJryWfHdThBKMumQa2-OBrfoKvLNRWtEchb6nMOqfQ5ifGIIuweSJHXYdT5z_",
		"refreshInterval": "5"
	  },
	  "forecast": {
		"key": "9b2d063cd93d1d60d61b989808919d71",
		"units": "auto",
		"refreshInterval": 2
	  },
	  "faceDetection":{
		"faceIds":[""],
		"emotion":[{
			
			"anger":0,
			"contempt":0,
			"disgust":0,
			"fear":0,
			"happiness":0,
			"neutral":0,
			"sadness":0,
			"surprise":0
		
		}]+personId }};
		
			
		jsonfile.writeFile(file, obj, function (err) {
				 console.error(err)
		})	
	*/
		//여기 까지
	

		
		
		
		Focus.change("face_regist");
	});
	
	//컨피그 수정
	

}

angular.module('SmartMirror')
    .controller('Face_Regist', Face_Regist);
