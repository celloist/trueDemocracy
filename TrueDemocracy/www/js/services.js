angular.module('starter.services', [])

.factory('superCache', ['$cacheFactory', function($cacheFactory) {
        return $cacheFactory('super-cache');
}])

.factory('MyPolls', ['auth', '$http', function(auth, $http) {

        var polls = [];

        return {
            all : function($scope){
                $http.get('https://sleepy-reaches-3503.herokuapp.com/api/users/' + 'auth0|55008768f9ffe30c45cf506b' + '/polls')
                    .success(function(data){
                        $scope.polls = data;
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
                    $http.post('https://sleepy-reaches-3503.herokuapp.com/api/users/' + 'auth0|55008768f9ffe30c45cf506b' + '/polls', {title: poll.title, shortDescription: poll.shortDescription, longDescription: poll.longDescription})
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
            all : function($scope){
                //Gets all the polls a specific user voted on
                $http.get('https://sleepy-reaches-3503.herokuapp.com/api/polls?userId='+'auth0|55008768f9ffe30c45cf506b')
                    .success(function(data){
                        polls = data.data;
                        $scope.polls = polls;
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
}])

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
    }]);
