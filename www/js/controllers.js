var fb = new Firebase("https://vivid-inferno-9711.firebaseio.com/");

angular.module('starter.controllers', ['ionic', 'starter.services', 'ngCordova', 'firebase'])

//-----------splash------------------------------------------
// $scope variable, which is connected to the form fields we created in the login
.controller('SplashCtrl', function($scope, LoginService, $ionicPopup, $state) {
    $scope.data = {};

    $scope.enter = function() {
        $state.go('login');
    }
})
//-----------splash------------------------------------------

//-----------login------------------------------------------
// $scope variable, which is connected to the form fields we created in the login
.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state, $firebaseAuth) {
    $scope.data = {};
    var fbAuth = $firebaseAuth(fb);

    $scope.login = function(username, password) {

        fbAuth.$authWithPassword({
            email: username,
            password: password
        }).then(function(authData) {
            $state.go("secure"); // go to secure.html if auth is true
        }).catch(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });

    }
})
//-----------login------------------------------------------

.controller('CameraCtrl', function($scope, Camera) {

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
})


.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
