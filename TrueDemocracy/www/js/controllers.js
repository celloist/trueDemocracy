angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, auth, Polls, MyPolls) {
        Polls.all();
        MyPolls.all();
    })

.controller('ChatsCtrl', function($scope, Polls, auth) {
  $scope.polls = Polls.all();

        $scope.onRelease = function(data){
            console.log(data.range); //TODO Refresh the list with the current according to the current range,
                                     // use this range in a url query string to get the correct polls(Needs the Google Earth API and Geolocation)
        }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Polls, MyPolls, auth, $ionicModal, $ionicPopup, $ionicLoading) {
    $scope.poll = Polls.get($stateParams.pollId);
        var poll = $scope.poll;
        console.log($stateParams.pollId);
        console.log("Poll: " + $scope.poll.longDescription);
        $scope.polls = [];
        var tempModal;

        console.log($scope.poll.yays.length)
        $scope.yays = $scope.poll.yays.length;
        $scope.nays = $scope.poll.nays.length;
        $scope.neutral = $scope.poll.neutral.length;

        $scope.showConfirmRating = function(poll, ratingType) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Vote',
                template: 'Are you sure you want to vote "' + ratingType + '" on this poll?'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    Polls.addRating(poll, ratingType, $scope);
                }else{

                }
            });
        };
})

.controller('FriendsCtrl', function($scope, MyPolls, $ionicPopup,  $ionicModal, $ionicLoading) {
  $scope.polls = MyPolls.all();

        // Create and load the Modal
        $ionicModal.fromTemplateUrl('add-poll.html', function(modal) {
            $scope.pollModal = modal;
            tempModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });

        // Called when the form is submitted
        $scope.addPoll = function(poll) {
            $ionicLoading.show({
                content: '<i class="icon ion-loading-b"></i>',
                animation: 'fade-in',
                showBackdrop: false,
                maxWidth: 50,
                showDelay: 0
            });

            MyPolls.insert(poll, $scope, $ionicLoading);
        };

        // Open our new task modal
        $scope.newPoll= function() {
            $scope.pollModal.show();
        };

        // Close the new task modal
        $scope.closeNewPoll = function() {
            $scope.pollModal.hide();
        };

        $scope.showConfirm = function(poll) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete poll',
                template: 'Are you sure you want to delete this poll?'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    $ionicLoading.show({
                        content: '<i class="icon ion-loading-b"></i>',
                        animation: 'fade-in',
                        showBackdrop: false,
                        maxWidth: 50,
                        showDelay: 0
                    });
                    MyPolls.remove(poll, $scope ,$ionicLoading);
                }else{

                }
            });
        };
})

.controller('PollDetailCtrl', function($scope, $stateParams, MyPolls, auth) {
  $scope.poll = MyPolls.get($stateParams.pollId);

        $scope.yays = $scope.poll.yays.length;
        $scope.nays = $scope.poll.nays.length;
        $scope.neutral = $scope.poll.neutral.length;

  console.log(  $scope.poll);
})

.controller('AccountCtrl', function($scope, auth, $ionicPopup, $state, Camera) {
  $scope.settings = {
    enableFriends: true
  };

        $scope.showConfirmLogout = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Logout',
                template: 'Are you sure you want to logout?'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    auth.signout();
                    store.remove('profile');
                    store.remove('token');
                    $state.go('login')
                } else {

                }
            });
        };

        $scope.getPhoto = function() {
            Camera.getPicture().then(function (imageURI) {
                $scope.lastPhoto = imageURI;
            }, function (err) {
                console.err(err);
            }, {
                quality: 75,
                targetWidth: 320,
                targetHeight: 320,
                saveToPhotoAlbum: false
            });
        };
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

    .controller('AddPollCtrl', function($scope, $ionicModal, MyPolls) {
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
           // console.log(poll);
           // MyPolls.insert(poll);
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
