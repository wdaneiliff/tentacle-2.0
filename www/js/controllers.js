var fb = new Firebase("https://vivid-inferno-9711.firebaseio.com/");

var tentacleApp = angular.module('starter.controllers', ['ionic', 'starter.services', 'ngCordova', 'firebase'])

//-----------splash------------------------------------------
// $scope variable, which is connected to the form fields we created in the login
tentacleApp.controller('SplashCtrl', function($scope, LoginService, $ionicPopup, $state) {
    $scope.data = {};

    $scope.enter = function() {
        $state.go('login');
    }
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
            $state.go("tab.dash"); // go to secure.html if auth is true
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
            $state.go("tab.dash");
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


tentacleApp.controller('DashCtrl', function($scope) {})

tentacleApp.controller('EventsCtrl', function($scope, Events) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.events = Events.all();
  $scope.remove = function(event) {
    Events.remove(event);
  };
});

tentacleApp.controller('EventDetailCtrl', function($scope, $stateParams, Events, $ionicHistory, $firebaseArray, $cordovaCamera, $cordovaCapture) {
  $scope.event = Events.get($stateParams.eventId);

  // $ionicHistory.clearHistory(); // cannot go backwards

  $scope.images = []; // empty array if NO images saved in firebase

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
              alert("Image has been uploaded");
              console.log(imageData);
          });
      }, function(error) {
          console.error(error);
      });
  }


});

tentacleApp.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
