var fb = new Firebase("https://vivid-inferno-9711.firebaseio.com/");
console.log('fb: ', fb);
var tentacleApp = angular.module('starter.controllers', ['ionic', 'starter.services', 'ngCordova', 'firebase'])

//-----------splash------------------------------------------
// $scope variable, which is connected to the form fields we created in the login
tentacleApp.controller('SplashCtrl', function($scope, LoginService, $ionicPopup, $state) {
    $scope.data = {};

    $scope.enter = function() {
        $state.go('login');
    };
});
//-----------splash------------------------------------------

//-----------login------------------------------------------
// $scope variable, which is connected to the form fields we created in the login
tentacleApp.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state, $firebaseAuth) {
    $scope.data = {};
    var fbAuth = $firebaseAuth(fb);
    $scope.login = function(username, password) {

        fbAuth.$authWithPassword({
            email: username,
            password: password
        }).then(function(authData) {
            $state.go("tab.events");
        }).catch(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });

    }


    $scope.register = function(username, password) {

        fbAuth.$createUser({email: username, password: password}).then(function(userData) {
            // return login info:
            return fbAuth.$authWithPassword({
                email: username,
                password: password
            });
        }).then(function(authData) {
            $state.go("tab.events");
        }).catch(function(data) {
          console.log(data);
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
    }

});
//-----------login------------------------------------------

tentacleApp.controller('CameraCtrl', function($scope, Camera) {

  $scope.getPhoto = function() {
    Camera.getPicture().then(function(imageURI) {
      console.log(imageURI);
      $scope.lastPhoto = imageURI;
    }, function(err) {
      console.err(err);
    }, {
      quality: 75,
      targetWidth: 320,
      targetHeight: 320,
      saveToPhotoAlbum: false
    });
  };
});


tentacleApp.controller('CreateCtrl', function($scope) {
});


tentacleApp.controller('EventsCtrl', function($scope, Events, $firebaseArray, $firebaseAuth){


var fbAuth = $firebaseAuth(fb);

  $scope.event = {
    title: '',
    description: '',
    date: '',
    time: '',
    pics: [],
    users: [],
    admin: {}
  };

  $scope.createEvent = function(title, description, date, time){
          var ref = new Firebase("https://vivid-inferno-9711.firebaseio.com/events");

          $scope.eventsRef = $firebaseArray(ref);


          $scope.event.title = title;
          $scope.event.description = description;
          $scope.event.date = date;
          $scope.event.time = time;



          if(fbAuth) {
              $scope.eventsRef.$add($scope.event).then(function() {
                  alert("Event has been uploaded");
                  console.log($scope.event);
              }).catch(function(error){
                console.log('error while $add()', error);
              });

              $scope.event = {
                title: '',
                description: '',
                date: '',
                time: '',
                pics: [],
                users: [],
                admin: {}
              };
          } else {
              $state.go("login");
          }
      }

  $scope.events = (function(){
    var ref = new Firebase("https://vivid-inferno-9711.firebaseio.com/events");
    var events = $firebaseArray(ref);
    return events;
  })();

  // $scope.eventshow = function(event){
  //   $state.go("tab.event-detail")
  // }

});

<<<<<<< HEAD
tentacleApp.controller('EventDetailCtrl', function($scope, $stateParams, Events, $ionicHistory, $firebaseArray, $cordovaCamera, $cordovaCapture, $ionicModal, $ionicSlideBoxDelegate, $ionicScrollDelegate) {
    $scope.event = Events.get($stateParams.eventId);

    // $ionicHistory.clearHistory(); // cannot go backwards

    $scope.images = []; // empty array if NO images saved in firebase

    var imageTakenArray = [];

    var fbAuth = fb.getAuth();
    if(fbAuth) {
        //                      nav into specific user node
        var userReference = fb.child("users/" + fbAuth.uid);
        // binding a specific node in firebase to array obj in image array
        var syncArray = $firebaseArray(userReference.child("images"));
        $scope.images = syncArray;
    } else {
        $state.go("login"); // goto firebase.html if fbAuth = false
    }
=======

tentacleApp.controller('EventDetailCtrl', function($scope, $stateParams, Events, $ionicHistory, $firebaseArray, $cordovaCamera, $cordovaCapture) {
  $scope.event = Events.get($stateParams.eventId);

  console.log($scope.event);

  $scope.images = []; // empty array if NO images saved in firebase

  var fbAuth = fb.getAuth();
  if(fbAuth) {
      //                      nav into specific user node
      var userReference = fb.child("users/" + fbAuth.uid);
      // var userReference = fb.child("events/" + fbAuth.uid);
      // binding a specific node in firebase to array obj in image array
      var syncArray = $firebaseArray(userReference.child("images"));
      $scope.images = syncArray;
  } else {
      $state.go("login"); // goto firebase.html if fbAuth = false
  }
>>>>>>> master

  // upoad the picture:-------------------------------------------------------
  $scope.upload = function() {
      // camera options (more available):
      var options = {
          quality : 75,
          destinationType : Camera.DestinationType.DATA_URL, // 64bit data in fb
          sourceType : Camera.PictureSourceType.CAMERA,
          allowEdit : true,
          encodingType: Camera.EncodingType.JPEG,
          popoverOptions: CameraPopoverOptions,
          targetWidth: 300,
          targetHeight: 300,
          saveToPhotoAlbum: false
      };
      $cordovaCamera.getPicture(options).then(function(imageData) {
          // add pic to firebase:
          syncArray.$add({image: imageData}).then(function() {
              //alert(imageData);
              alert("Image has been uploaded");
          });
      }, function(error) {
          console.error(error);
      });
  }

  //-------------------------MODAL Zoom----------------------------------
    $scope.zoomMin = 1;

    $scope.showImages = function(image, index) {
        $scope.image = image;
        $scope.activeSlide = index;
        // console.log("$scope.activeSlide = ");
        // console.log($scope.activeSlide);
        $scope.showModal('templates/gallery-zoom.html');
    };

    $scope.showModal = function(templateUrl) {
        $ionicModal.fromTemplateUrl(templateUrl, {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    }

    $scope.closeModal = function() {
        $scope.modal.hide();
        $scope.modal.remove()
    };

    $scope.updateSlideStatus = function(slide) {
        var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;

        if (zoomFactor == $scope.zoomMin) {
            $ionicSlideBoxDelegate.enableSlide(true);
        } else {
            $ionicSlideBoxDelegate.enableSlide(false);
        }
    };
    //-------------------------MODAL Zoom---------------------------------------
});

tentacleApp.controller('AccountCtrl', function($scope, $stateParams, $state) {
  $scope.settings = {
    enableFriends: true
  };

  $scope.logout = function(){
    console.log("log out please")
    $state.go("splash")
  }

});
