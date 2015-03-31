// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'auth0',
    'angular-storage',
    'angular-jwt'])

    //.config(function (authProvider) {
    //    authProvider.init({
    //        domain: 'ronaldvanduren.auth0.com',
    //        clientID: 'SLyfg8BYEP9RuyhHX4waO7hpAqEyytfQ',
    //        loginStage: 'login'
    //    });
    //})
    //.run(function(auth) {
    //    // This hooks al auth events to check everything as soon as the app starts
    //    auth.hookEvents();
    //})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

//.run(function($rootScope, auth, store, jwtHelper, $location) {
//        // This events gets triggered on refresh or URL change
//        $rootScope.$on('$locationChangeStart', function() {
//            if (!auth.isAuthenticated) {
//                var token = store.get('token');
//                if (token) {
//                    if (!jwtHelper.isTokenExpired(token)) {
//                        auth.authenticate(store.get('profile'), token);
//                    } else {
//                        auth.refreshIdToken(refreshToken).then(function(idToken) {
//                            store.set('token', idToken);
//                            auth.authenticate(store.get('profile'), idToken);
//                            return idToken;
//                        });
//                    }
//                }
//            }
//        });
//    })

.config(function($stateProvider, $urlRouterProvider, authProvider, $httpProvider,
                 jwtInterceptorProvider) {

        ////Authentication setup
        //authProvider.init({
        //    domain: 'ronaldvanduren.auth0.com',
        //    clientID: 'FyLTiPLyCtwnGblxCZeiUSQVrCSVTUCb',
        //    callbackURL: location.href,
        //    loginState: 'login'
        //});
        //
        //jwtInterceptorProvider.tokenGetter = function(store, jwtHelper, auth) {
        //    var idToken = store.get('token');
        //    var refreshToken = store.get('refreshToken');
        //    // If no token return null
        //    if (!idToken || !refreshToken) {
        //        return null;
        //    }
        //    // If token is expired, get a new one
        //    if (jwtHelper.isTokenExpired(idToken)) {
        //        return auth.refreshIdToken(refreshToken).then(function(idToken) {
        //            store.set('token', idToken);
        //            return idToken;
        //        });
        //    } else {
        //        return idToken;
        //    }
        //};
        //
        //$httpProvider.interceptors.push('jwtInterceptor');

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

      //Login state
      .state('login', {
          url: '/login',
          templateUrl: 'templates/login.html',
          controller: 'LoginCtrl'
      })

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"/*,
          data: {
              requiresLogin: true
          }*/
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.polls', {
      url: '/polls',
      views: {
        'tab-polls': {
          templateUrl: 'templates/tab-polls.html',
          controller: 'PollsCtrl'
        }
      }
    })
    .state('tab.poll-detail', {
      url: '/polls/:pollId',
      views: {
        'tab-polls': {
          templateUrl: 'templates/poll-detail.html',
          controller: 'PollsDetailCtrl'
        }
      }
    })

  .state('tab.myPolls', {
      url: '/myPolls',
      views: {
        'tab-myPolls': {
          templateUrl: 'templates/tab-my-polls.html',
          controller: 'MyPollsCtrl'
        }
      }
    })
    .state('tab.myPolls-detail', {
      url: '/myPolls/:pollId',
      views: {
        'tab-myPolls': {
          templateUrl: 'templates/my-polls-detail.html',
          controller: 'MyPollDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

      .state('tab.account.map', {
          url: '/account/map',
          views: {
              'tab-account': {
                  templateUrl: 'templates/tab-account-map.html',
                  controller: 'MapCtrl'
              }
          }
      });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});


