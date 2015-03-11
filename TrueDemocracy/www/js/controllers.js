angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, auth) {})

.controller('ChatsCtrl', function($scope, Chats, auth) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats, auth) {
  $scope.chat = Chats.get($stateParams.chatId);
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
     $state.go('login')
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
    });
