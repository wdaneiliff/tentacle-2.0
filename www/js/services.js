angular.module('starter.services', [])

//-----------login------------------------------------------
.service('LoginService', function($q) {
    return {
        loginUser: function(name, pw) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            if (name == 'user' && pw == 'secret') {
                deferred.resolve('Welcome ' + name + '!');
            } else {
                deferred.reject('Wrong credentials.');
            }
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
})
//-----------login------------------------------------------

//-----------Camera------------------------------------------
.factory('Camera', ['$q', function($q) {

    return {
        getPicture: function(options) {
            var q = $q.defer();
            navigator.camera.getPicture(function(result) {
                // Do any magic you need
                q.resolve(result);
            }, function(err) {
                q.reject(err);
            }, options);

            return q.promise;
        }
    }
}]) //-----------Camera------------------------------------------

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Jimmys Birthday Party!',
    lastText: 'Come celebrate jimmys 21st birthday',
    face: 'img/octoman.png'
  }, {
    id: 1,
    name: 'Tonys Tea Party',
    lastText: 'Lets get wierd',
    face: 'img/octoman.png'
  }, {
    id: 2,
    name: 'Graduation event',
    lastText: 'Graduation event fun',
    face: 'img/octoman.png'
  }, {
    id: 3,
    name: 'Night out on the town',
    lastText: 'Lets explore the town bitches',
    face: 'img/octoman.png'
  }, {
    id: 4,
    name: 'House Party',
    lastText: 'Come to my house',
    face: 'img/octoman.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
