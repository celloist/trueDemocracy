angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, auth) {})

.controller('ChatsCtrl', function($scope, Chats, auth) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats, auth, $ionicModal) {
  $scope.chat = Chats.get($stateParams.chatId);


        $scope.polls = [];

        // Create and load the Modal
        $ionicModal.fromTemplateUrl('add-poll.html', function(modal) {
            $scope.pollModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });

        // Called when the form is submitted
        $scope.addPoll = function(poll) {
            if (!poll.title && poll.title != "") {
                $http.post('http://localhost:8080/api/users' + auth.profile.user_id + '/polls', {title: poll.title})
                    .success(function (data) {
                        $scope.polls.push({
                            title: poll.title
                        });
                        $scope.pollModal.hide();
                        poll.title = "";
                        console.log($scope.polls);
                        //TODO flash message poll has been created
                    })
                    .error(function (data) {
                        //TODO flash error that something went wrong
                        console.log(data);
                    })
            }
        };

        // Open our new task modal
        $scope.newPoll= function() {
            $scope.pollModal.show();
        };

        // Close the new task modal
        $scope.closeNewPoll = function() {
            $scope.pollModal.hide();
        };
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends, auth) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope, auth, $state) {
  $scope.settings = {
    enableFriends: true
  };

   $scope.logout = function() {
     auth.signout();
     store.remove('profile');
     store.remove('token');
     $state.go('login'); //TODO fix redirect when logging out
   }
})

.controller('LoginCtrl', function($scope, auth, $state, store) {
        auth.signin({
            authParams: {
                // This asks for the refresh token
                // So that the user never has to log in again
                scope: 'openid offline_access',
                // This is the device name
                device: 'Mobile device'
            },
            // Make the widget non closeable
            standalone: true
        }, function(profile, token, accessToken, state, refreshToken) {
            // Login was successful
            // We need to save the information from the login
            store.set('profile', profile);
            store.set('token', token);
            store.set('refreshToken', refreshToken);
            $state.go('tab.dash');
        }, function(error) {
            // Oops something went wrong during login:
            console.log("There was an error logging in", error);
        });
    })

    .controller('AddPollCtrl', function($scope, $ionicModal) {
        // Array to store the movies in
        $scope.polls = [];

        // Create and load the Modal
        $ionicModal.fromTemplateUrl('add-poll.html', function(modal) {
            $scope.pollModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });

        // Called when the form is submitted
        $scope.addPoll = function(poll) {
            if (!poll.title && poll.title != "") {
                $http.post('http://localhost:8080/api/users' + auth.profile.user_id + '/polls', {title: poll.title})
                    .success(function (data) {
                        $scope.polls.push({
                            title: poll.title
                        });
                        $scope.pollModal.hide();
                        poll.title = "";
                        console.log($scope.polls);
                        //TODO flash message poll has been created
                    })
                    .error(function (data) {
                        //TODO flash error that something went wrong
                        console.log(data);
                    })
            }
        };

        // Open our new task modal
        $scope.newPoll= function() {
            $scope.pollModal.show();
        };

        // Close the new task modal
        $scope.closeNewPoll = function() {
            $scope.pollModal.hide();
        };

        //$scope.deleteMovie = function(movie) {
        //    var index = $scope.movies.indexOf(movie)
        //    $scope.movies.splice(index, 1);
        //};
    });
