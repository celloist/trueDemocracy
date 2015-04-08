angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, auth, Polls, MyPolls, store) {
        $scope.polls = [];
        $scope.votedOn = [];
        $scope.yays = 0;
        $scope.nays = 0;
        $scope.neutral = 0;
        Polls.all($scope);
        $scope.myPolls = [];
        MyPolls.all($scope);
        $scope.amountOfVotablePolls = [];

        $scope.$watchCollection('polls', function(newPolls, oldNames) {
            console.log(newPolls);
            $scope.polls = newPolls;
            $scope.amountOfVotablePolls = ($scope.polls.length - $scope.votedOn.length);
        });

        $scope.$watchCollection('myPolls', function(newPolls, oldNames) {
            $scope.myPolls = newPolls;
            for(i = 0; i < $scope.myPolls.length; i++){
                $scope.yays += $scope.myPolls[i].yays.length;
                $scope.nays += $scope.myPolls[i].nays.length;
                $scope.neutral += $scope.myPolls[i].neutral.length;
            }
        });

        //This initial value has to be checked and set if needed
        if(!store.get('showOwnPolls')){
            store.set('showOwnPolls', false);
        }
    })


.controller('PollsCtrl', function($scope, Polls, auth, $ionicSideMenuDelegate, $ionicPopup, Socket, store, $cordovaVibration) {

        $scope.hasSelectedPoll = false;
        $scope.hasVotedOn = false;
        $scope.polls = [];
        $scope.votedOn = [];

        console.log(store.get('showOwnPolls'));
        Socket.on('poll:increment', function (data) {
            console.log(data);
            $cordovaVibration.vibrate(1000);
            for(var i = 0; i < $scope.polls.length; i++){
                if($scope.polls[i]._id == data.pollId){
                    switch (data.ratingType){
                        case "yay" :
                            $scope.yays += 1;
                            $scope.polls[i].yays.push(true);
                            $cordovaVibration.vibrate(1000);
                            break;
                        case "nay" :
                            $scope.nays += 1;
                            $scope.polls[i].nays.push(true);
                            $cordovaVibration.vibrate(1000);
                            break;
                        case "neutral" :
                            $scope.neutral += 1;
                            $scope.polls[i].neutral.push(true);
                            $cordovaVibration.vibrate(1000);
                            break;
                    }
                    return;
                }
            }
        });

        Polls.all($scope);

        $scope.$watchCollection('votedOn', function(newPolls, oldNames) {
            $scope.votedOn = newPolls;
        })

        $scope.$watchCollection('polls', function(newPolls, oldNames) {
            $scope.polls = newPolls;
        });

        $scope.onRelease = function(data){
            console.log(data.range); //TODO Refresh the list with the current according to the current range,
                                     // use this range in a url query string to get the correct polls(Needs the Google Earth API and Geolocation)
        };

        $scope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };

        $scope.getPoll = function(pollIndex){

            $scope.hasVotedOn = false;

            if(!$scope.hasSelectedPoll){
                $scope.hasSelectedPoll = true;
            }
            $ionicSideMenuDelegate.toggleLeft();

            $scope.pollDetail = $scope.polls[pollIndex];

            $scope.yays = $scope.pollDetail.yays.length;
            $scope.nays = $scope.pollDetail.nays.length;
            $scope.neutral = $scope.pollDetail.neutral.length;

            checkIfUserHasVotedOnPoll($scope.pollDetail._id);
        };

        $scope.showConfirmRating = function(poll, ratingType) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Vote',
                template: 'Are you sure you want to vote "' + ratingType + '" on this poll?'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    Polls.addRating(poll, ratingType, $scope);
                    $scope.hasVotedOn = true;
                    $scope.votedOn.push(poll._id);
                }else{

                }
            });
        };

        function checkIfUserHasVotedOnPoll(pollId){
            for(var i = 0; i < $scope.votedOn.length; i++){
                if(pollId == $scope.votedOn[i]){
                    $scope.hasVotedOn = true;
                    break;
                }
            }
        }
})

.controller('MyPollsCtrl', function($scope, MyPolls, $ionicPopup,  $ionicModal, $ionicLoading, $ionicSideMenuDelegate, store) {

        $scope.poll = {
            title: store.get('newPollTitle'),
            shortDescription: store.get('newPollShortDescription'),
            longDescription: store.get('newPollLongDescription')
        };

        $scope.myPolls = [];
        MyPolls.all($scope);

        $scope.$watchCollection('myPolls', function(newPolls, oldNames) {
            $scope.myPolls = newPolls;
        });

        $scope.hasSelectedPoll = false;

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

            //Clearing modal
            $scope.poll = {
                title: "",
                shortDescription: "",
                longDescription: ""
            };

            //Removing stored data;
            store.remove('newPollTitle');
            store.remove('newPollShortDescription');
            store.remove('newPollLongDescription');

            MyPolls.insert(poll, $scope, $ionicLoading);
        };

        // Open our new task modal
        $scope.newPoll= function() {
            console.log(store.get('newPollTitle'));
            $scope.pollModal.show();
        };

        // Close the new task modal
        $scope.closeNewPoll = function(poll) {
            store.set("newPollTitle", poll.title);
            store.set("newPollShortDescription", poll.shortDescription);
            store.set("newPollLongDescription", poll.longDescription);
            $scope.pollModal.hide();
        };


        // Create and load the Modal
        $ionicModal.fromTemplateUrl('edit-poll.html', function(modal) {
            $scope.pollEditModal = modal;
            tempEditModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });

        // Called when the form is submitted
        $scope.updatePoll = function(poll) {
            $ionicLoading.show({
                content: '<i class="icon ion-loading-b"></i>',
                animation: 'fade-in',
                showBackdrop: false,
                maxWidth: 50,
                showDelay: 0
            });

            MyPolls.update($scope.pollDetail, $scope, $ionicLoading);
        };

        // Open our new task modal
        $scope.editPoll= function() {
            $scope.pollEditModal.show();
        };

        // Close the new task modal
        $scope.closeEditPoll = function() {
            $scope.pollEditModal.hide();
        };


        $scope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();
        };

        $scope.getPoll = function(pollId){
            if(!$scope.hasSelectedPoll){
                $scope.hasSelectedPoll = true;
            }
            $ionicSideMenuDelegate.toggleLeft();
            $scope.pollDetail = $scope.myPolls[pollId];
            $scope.yays = $scope.pollDetail.yays.length;
            $scope.nays = $scope.pollDetail.nays.length;
            $scope.neutral = $scope.pollDetail.neutral.length;
        };

        $scope.showConfirmDelete = function(poll) {
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

.controller('AccountCtrl', function($scope, auth, store, $ionicPopup, $state, Camera, $window, Socket) {
  $scope.settings = {
    showOwnPolls: store.get('showOwnPolls')
  };

        $scope.storeSettings = function (settings) {
            store.set('showOwnPolls', settings.showOwnPolls);
            console.log(store.get('showOwnPolls'));
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
                } else {

                }
            });
        };

        $scope.callDeveloper = function(){
            document.location.href = 'tel:12345678';
        };

        $scope.getPhoto = function() {
            console.log("inside");

            Socket.on('poll:test', 'test', function (data) {
                console.log("inside");
                console.log(data);
            });
            //Camera.getPicture().then(function (imageURI) {
            //    console.log("Image = " + imageURI);
            //
            //    var image = document.getElementById('myImage');
            //    image.src = "data:image/jpeg;base64," + imageURI;
            //
            //   // $scope.lastPhoto = imageURI;
            //}, function (err) {
            //    console.log(err);
            //}, {
            //    quality: 75,
            //    targetWidth: 320,
            //    targetHeight: 320,
            //    saveToPhotoAlbum: false,
            //    destinationType: Camera.DestinationType.DATA_URL,
            //    sourceType: Camera.PictureSourceType.CAMERA
            //});
        };
        $scope.goToMap = function() {
            $state.go('tab.account-map');
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
    })


    .controller('MapCtrl', function($scope, $ionicLoading, Users) {
       //user position
        var user = [];
        $scope.users = [];

        $scope.mapCreated = function(map) {
            $scope.map = map;
        };

        var map = $scope.map;


        $scope.centerOnMe = function () {
            console.log("Centering");
            if (!$scope.map) {
                return;
            }


            $scope.loading = $ionicLoading.show({
                content: 'Getting current location...',
                showBackdrop: false
            });



            ////TODO add long and lat to user
            //navigator.geolocation.getCurrentPosition(function (pos) {
            //    console.log('Got pos', pos.coords.longitude);
            //    user.long = pos.coords.longitude;
            //    user.lat = pos.coords.latitude;
            //
            //    Users.update(user,$scope);
            //
            //    $scope.map.setCenter(new google.maps.LatLng(pos.coords.longitude, pos.coords.latitude));
            //    $scope.loading.hide();
            //
            //    Users.all($scope);
            //    var markers = $scope.users;
            //
            //    markers.forEach(function(mark) {
            //        var position = new google.maps.LatLng(mark.lat, mark.long);
            //        bounds.extend(position);
            //        var marker = new google.maps.Marker({
            //            position: position,
            //            map: map,
            //            title: mark.userID
            //        });
            //
            //    });



            navigator.geolocation.getCurrentPosition(function (pos) {
                console.log('Got pos', pos.coords.latitude);
                    user.long = pos.coords.longitude;
                    user.lat = pos.coords.latitude;

                var check = Users.update(user,$scope);
                    console.log(check);

               // var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);


                $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));

                $scope.map.event.addListener(map, 'click', function(event) {
                    marker = new google.maps.Marker({
                        position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                        map: map
                    });
                    $scope.loading.hide();
                });
                $scope.loading.hide();


            }, function (error) {
                alert('Unable to get location: ' + error.message);
            });
        };
    });


