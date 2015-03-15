angular.module('starter.services', [])

//.factory('Chats', function() {
//  // Might use a resource here that returns a JSON array
//
//  // Some fake testing data
//  var chats = [{
//    id: 0,
//    name: 'Ben Sparrow',
//    lastText: 'You on your way?',
//    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
//  }, {
//    id: 1,
//    name: 'Max Lynx',
//    lastText: 'Hey, it\'s me',
//    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
//  }, {
//    id: 2,
//    name: 'Andrew Jostlin',
//    lastText: 'Did you get the ice cream?',
//    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
//  }, {
//    id: 3,
//    name: 'Adam Bradleyson',
//    lastText: 'I should buy a boat',
//    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
//  }, {
//    id: 4,
//    name: 'Perry Governor',
//    lastText: 'Look at my mukluks!',
//    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
//  }];
//
//  return {
//    all: function() {
//      return chats;
//    },
//    remove: function(chat) {
//      chats.splice(chats.indexOf(chat), 1);
//    },
//    get: function(chatId) {
//      for (var i = 0; i < chats.length; i++) {
//        if (chats[i].id === parseInt(chatId)) {
//          return chats[i];
//        }
//      }
//      return null;
//    }
//  }
//})

///**
// * A simple example service that returns some data.
// */
//.factory('Friends', function() {
//  // Might use a resource here that returns a JSON array
//
//  // Some fake testing data
//  var friends = [{
//    id: 0,
//    name: 'Ben Sparrow',
//    notes: 'Enjoys drawing things',
//    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
//  }, {
//    id: 1,
//    name: 'Max Lynx',
//    notes: 'Odd obsession with everything',
//    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
//  }, {
//    id: 2,
//    name: 'Andrew Jostlen',
//    notes: 'Wears a sweet leather Jacket. I\'m a bit jealous',
//    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
//  }, {
//    id: 3,
//    name: 'Adam Bradleyson',
//    notes: 'I think he needs to buy a boat',
//    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
//  }, {
//    id: 4,
//    name: 'Perry Governor',
//    notes: 'Just the nicest guy',
//    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
//  }];

//
//  return {
//    all: function() {
//      return friends;
//    },
//    get: function(friendId) {
//      // Simple index lookup
//      return friends[friendId];
//    }
//  }
//})

.factory('MyPolls', ['auth', '$http', function(auth, $http) {

        var polls = [];

        return {
            all : function(){
                $http.get('https://sleepy-reaches-3503.herokuapp.com/api/users/' + 'auth0|55008768f9ffe30c45cf506b' + '/polls')
                    .success(function(data){
                        polls = data;
                    })
                    .error(function(data){
                        console.log(data);
                    });
                return polls;
            },
            remove: function(poll, $scope, loadingIndicator) {
                $http.delete('https://sleepy-reaches-3503.herokuapp.com/api/polls/' + poll._id)
                    .success(function(status){
                        $scope.polls.splice($scope.polls.indexOf(poll), 1);
                        loadingIndicator.hide();
                    })
                    .error(function(status){
                       console.log(status);
                    });

            },
            get : function(pollId){
                return polls[pollId];
            },
            insert : function(poll, $scope, loadingIndicator){
                if (poll.title != "") {
                    $http.post('https://sleepy-reaches-3503.herokuapp.com/users/' + 'auth0|55008768f9ffe30c45cf506b' + '/polls', {title: poll.title})
                        .success(function (data) {
                            loadingIndicator.hide();
                            $scope.pollModal.hide();
                            poll.title = "";
                            $scope.polls.push(data.data);
                        })
                        .error(function (data) {
                            //TODO flash error that something went wrong
                            console.log(data);
                        })
                }
            },
            update : function(poll){
                $http.put('https://sleepy-reaches-3503.herokuapp.com/polls/' + poll._id, {title: poll.title})
                    .succes(function(){

                    })
            }
        }
}])

.factory('Polls',['auth', '$http', function(auth, $http) {

        var polls = [];

        return {
            all : function(){
                //Gets all the polls a specific user voted on
                $http.get('https://sleepy-reaches-3503.herokuapp.com/api/polls?userId='+'auth0|55008768f9ffe30c45cf506b')
                    .success(function(data){
                        polls = data.data;
                    })
                    .error(function(data){
                        console.log(data);
                    });
                return polls;
            },
            remove: function(poll) {
                //TODO add url when the routes are finished
                $http.delete('url to delete specific poll')
                    .success(function(status){
                        polls.splice(polls.indexOf(poll), 1);
                    })
                    .error(function(status){
                        console.log(status);
                    });
            },
            get : function(pollId){
                return polls[pollId];
            },
            addRating : function(poll, ratingType, $scope){
               // console.log(ratingType);
                $http.put('https://sleepy-reaches-3503.herokuapp.com/api/polls/' + poll._id + '/addRating', {ratingType: ratingType})
                    .success(function(status){
                        switch(ratingType){
                            case "yay" :
                                $scope.yays += 1;
                                break;
                            case "nay" :
                                $scope.nays += 1;
                                break;
                            case "neutral" :
                                $scope.neutral += 1;
                                break;
                        }
                    }).error(function(status){

                    });
            }
        }
}]);
