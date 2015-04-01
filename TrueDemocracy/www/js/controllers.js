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


.controller('PollsCtrl', function($scope, Polls, auth, $ionicSideMenuDelegate, $ionicPopup, Socket, store) {

        $scope.hasSelectedPoll = false;
        $scope.hasVotedOn = false;
        $scope.polls = [];
        $scope.votedOn = [];

        console.log(store.get('showOwnPolls'));
        Socket.on('poll:increment', function (data) {
            console.log(data);
            for(var i = 0; i < $scope.polls.length; i++){
                if($scope.polls[i]._id == data.pollId){
                    switch (data.ratingType){
                        case "yay" :
                            $scope.yays += 1;
                            $scope.polls[i].yays.push(true);
                            break;
                        case "nay" :
                            $scope.nays += 1;
                            $scope.polls[i].nays.push(true);
                            break;
                        case "neutral" :
                            $scope.neutral += 1;
                            $scope.polls[i].neutral.push(true);
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


    .controller('MapCtrl', function($scope, $ionicLoading) {
       //user position
       var long;
       var lat;


        $scope.mapCreated = function(map) {
            $scope.map = map;
        };
        var bounds = new google.maps.LatLngBounds();
        var map = $scope.map

       //markers user markers come here TODO
       var markers = [
            ['London Eye, London', 51.503454,-0.119562],
            ['Palace of Westminster, London', 51.499633,-0.124755]
       ];

       //info about user TODO
       var infoWindowContent = [
            ['<div class="info_content">' +
            '<h3>London Eye</h3>' +
            '<p>The London Eye is a giant Ferris wheel situated on the banks of the River Thames. The entire structure is 135 metres (443 ft) tall and the wheel has a diameter of 120 metres (394 ft).</p>' +        '</div>'],
            ['<div class="info_content">' +
            '<h3>Palace of Westminster</h3>' +
            '<p>The Palace of Westminster is the meeting place of the House of Commons and the House of Lords, the two houses of the Parliament of the United Kingdom. Commonly known as the Houses of Parliament after its tenants.</p>' +
            '</div>']
       ];

       // Loop through our array of markers & place each one on the map
       for(var i = 0; i < markers.length; i++ ) {
            var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
            bounds.extend(position);
            marker = new google.maps.Marker({
                position: position,
                map: map,
                title: markers[i][0]
            });

            // Allow each marker to have an info window
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infoWindow.setContent(infoWindowContent[i][0]);
                    infoWindow.open(map, marker);
                }
            })(marker, i));

            // Automatically center the map fitting all markers on the screen

       }



        $scope.centerOnMe = function () {
            console.log("Centering");
            if (!$scope.map) {
                return;
            }

            $scope.loading = $ionicLoading.show({
                content: 'Getting current location...',
                showBackdrop: false
            });



            //TODO add long and lat to user
            navigator.geolocation.getCurrentPosition(function (pos) {
                console.log('Got pos', pos);
                long = pos.coords.longitude;
                lat = pos.coords.latitude
                $scope.map.setCenter(new google.maps.LatLng(lat, long));
                $scope.loading.hide();
            }, function (error) {
                alert('Unable to get location: ' + error.message);
            });
        };
    });
