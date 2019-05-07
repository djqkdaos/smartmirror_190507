
function Face_Detection($scope, $http, SpeechService, Focus) {
	
	
	var filename;
		var chart;
		var chartData;
		var exec = require('child_process').exec;	
			console.debug('얼굴인식 컨트롤러 추가 완료');
		var emailHeader ;	
		var uName = "";
		var axios = require("axios");
		const MSCSFACEAPI = require("mscs-face-api");
		var Key = '4de19811f461498593d42fcc0343f721';
		var useServer = 'WCUS';
		var mscsfa = new MSCSFACEAPI(Key,"WCUS");
		var personGroupId = 'ditsmartmirrorgroup';
		var confidenceThreshold = 0.4;
		var userData = 'dit smart mirror team';

	var exec = require('child_process').exec;	
	console.debug('얼굴인식 컨트롤러 추가 완료');
	var emailHeader ;
	
	mscsfa.trainPersonGroup(personGroupId).then(function () {
			console.log("트레이닝 후 그룹 상태 보기");
			mscsfa.getPersonGroupTrainingStatus(personGroupId).then(function(){ console.log("체인성공") });
			
		}, function (error) {
			// 실패시 
			console.error(error);
		}).catch(function (err) {
                reject(err.response.data.error);
				console.log(res.data);
         });
		
	
	var testfaceUrl = "https://storage.googleapis.com/smartmirrortest/20170927134535face.jpg";
	
	function faceDetectionInterval(){
		console.log(testfaceUrl+"을 분석합니다.");
	 mscsfa.detectFace(testfaceUrl).then(function () {
		 if(config.faceDetection.faceIds[0] != ""){
			console.log("디텍트 이미지 전송 성공");
			mscsfa.identifyFace(personGroupId,confidenceThreshold).then(function(){ console.log("아이덴티파이 체인성공") });
		 }else{
			console.log("이미지 인식 실패");
		 }
		}).catch(function (err) {
                reject(err.response.data.error);
				console.log(res.data);
         });
		
	}
	faceDetectionInterval();
	var uName = "최민준";


	function imapSevice(uName){
		var imaps = require('imap-simple');
				
				var userI = config.userData[uName].email;

				var emailConfig = {
					imap: {
						user: userI.id,
						password: userI.password,
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
							emailHeader = subjects;
							
							var emailUl = document.getElementById("emailUl");
							
							while(emailUl.firstChild){
								emailUl.removeChild(emailUl.firstChild);
							}

							for(var i=0; i<subjects.length; i++){
							var node = document.createElement("LI");                 // Create a <li> node
							var textnode = document.createTextNode(subjects[i]);         // Create a text node
							node.appendChild(textnode);                    
							document.getElementById("emailUl").appendChild(node);
							}
						});
					});
				});

	}
	window.onload = imapSevice(uName);
	//사진에서 얼굴 찾기
	
	
	
    // 얼굴인식 커맨드 추가
	SpeechService.addCommand('face_detection', function () {


		//------------------------------------------------
		if(responsiveVoice.voiceSupport()) {
          responsiveVoice.speak("얼굴 인식을 시작합니다.","Korean Female");
        }
		//------------------------------------------------
		var fs = require('fs');

		global.gcs = require('@google-cloud/storage')({
  					projectId: 'mindful-ship-176106',
 					keyFilename: '/home/pi/smart-mirror/plugins/face_detection/keyfile.json'
				});

		var datetime = require('node-datetime');
		var dt = datetime.create();
		var formatted = dt.format('YmdHMS');
		

		
		
		child = exec('raspistill -br 55 -w 1920 -h 1080 -t 500 -o /home/pi/smart-mirror/face_img/'+formatted+'face.jpg',
  			function (error, stdout, stderr) {
    		console.log('stdout: ' + stdout);
    		console.log('stderr: ' + stderr);
			$scope.image = '/home/pi/smart-mirror/'+formatted+'face.jpg';
    		if (error !== null) {
     	 console.log('exec error: ' + error);
  					  }
		});
		var filename = formatted+'face.jpg';
		var faceUrl = 'https://storage.googleapis.com/smartmirrortest/'+filename;
				
		function interval(){	
		
				var bucketName = 'smartmirrortest'
				
				// Reference an existing bucket.
				var bucket = gcs.bucket(bucketName);
		
				// Upload a local file to a new file to be created in your bucket.
				bucket.upload('/home/pi/smart-mirror/face_img/'+formatted+'face.jpg', function(err, file) {
 					 if (!err) {
  					  bucket.file(filename).makePublic().then(() => {
						console.log(`gs:${bucketName}/${filename} is now public.`);
						$scope.face = "얼굴인식 완료";
						
						$scope.faceUrl = faceUrl;
					
						setTimeout(faceDetectionInterval,2000);
						setTimeout(faceidentifyInterval, 5500);
						setTimeout(userCheck, 7500);
						setTimeout(del_Face,10000);
						setTimeout(emotionCheck,7000);
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
	
	var personImage = faceUrl;
	
	mscsfa.trainPersonGroup(personGroupId);
	mscsfa.getPersonGroupTrainingStatus(personGroupId);
	mscsfa.getPersonGroup(personGroupId);

	function faceDetectionInterval(){
		console.log(faceUrl+"을 분석합니다.");
	 mscsfa.detectFace(faceUrl).then(function () {
			console.log("디텍트 이미지 전송 성공");
			mscsfa.identifyFace(personGroupId,confidenceThreshold).then(function(){ console.log("아이덴티파이 체인성공") });
			
		}).catch(function (err) {
                reject(err.response.data.error);
				console.log(res.data);
         });
		
	}
	
	function userCheck(){	
		var pI = global.personId;
		console.log(pI);

		if(global.personId != undefined && global.personId != ""){
			
			console.log(config.faceDetection.personId);
			
			global.name  = config.faceDetection.personId[pI];
			
			$scope.face = global.name+"님 어서오세요.";
			 if(responsiveVoice.voiceSupport()) {
				 responsiveVoice.speak(global.name+"님 어서오세요.","Korean Female");
			 }
			 global.personId = "";
			imapSevice(global.name);
		}else{
			$scope.face = "주인님 너무 눈부셔요~ 다시한번 거울아~ 해주세요.";
			if(responsiveVoice.voiceSupport()) {	 
				 responsiveVoice.speak("주인님 너무 눈부셔요~ 다시한번 거울아~ 해주세요.","Korean Female");
			}
		}
		
		
	}
	//------------------------------------storege face pic delete----------------------------------
				
		function del_Face(){
				// The name of the bucket to access, e.g. "my-bucket"
				var bucketName = 'smartmirrortest'

				// The name of the file to delete, e.g. "file.txt"
				 const filename = formatted+'face.jpg';

				// Instantiates a client
			

				// Deletes the file from the bucket
				gcs
				  .bucket(bucketName)
				  .file(filename)
				  .delete()
				  .then(() => {
					console.log(`gs://${bucketName}/${filename} deleted.`);
				  })
				  .catch((err) => {
					console.error('ERROR:', err);
				  });
			}
		//-----------------------------------------------------------------------------------------------
	function emotionCheck(){
		var top = Math.max.apply(null,config.faceDetection.emotion);
		console.log(top);
		if(config.faceDetection.emotion.anger>=0.5) {
			
			  $scope.face = "화가 나셨네요 왜 그런지 모르겠지만 기분 푸세요~";
		  
		}
	}

	function faceidentifyInterval(){
	
	mscsfa.identifyFace(personGroupId,confidenceThreshold);

	}
	function email(){
	
		
		
	}

	
	//트레이닝
	



		//여기 까지
	

		setTimeout(interval, 2000);
		
		$scope.face = "얼굴인식 중";
		
		Focus.change("face_detection");
	});
	
}

angular.module('SmartMirror')
    .controller('Face_Detection', Face_Detection);
