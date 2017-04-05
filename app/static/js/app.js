/**
* myApp Module
*
* Description
*/

angular.module('myApp', [
    'uiGmapgoogle-maps', 
    'datatables',
    'ui.router',
    'myApp.ProfilesService',
    'myApp.AuthenticationService',
    'myApp.ServerService',
    'myApp.Authentication',
    'myApp.SSHCmdService',
    'myApp.Servers',
    'angular-terminal',
    "ng-fusioncharts"
])

.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyCktMMX39icwllipmYDMPHXQRFrtgzFXK8',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
})

.run(function ($rootScope, $state, AuthService) {
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    
    AuthService.getUserStatus()
    .then(function(){
        if (toState.authenticate && !AuthService.isLoggedIn()){
          // User isn’t authenticated
          $state.transitionTo("login");
          event.preventDefault(); 
        }
    });
  });
})

.config(['$stateProvider', 
        '$urlRouterProvider', 
        '$locationProvider', 
        function($stateProvider, $urlRouterProvider, $locationProvider){
    $stateProvider
        .state('home', {
            url:'/',
            templateUrl:'/static/partials/index.html',
            controller: 'HomeCtrl'
        })
        .state('login', {
            url:'/login',
            templateUrl:'/static/partials/login.html',
            controller:'AuthCtrl'
        })
        .state('register', {
            url:'/register',
            templateUrl:'/static/partials/register.html',
            controller:'AuthCtrl'
        })
        .state('servers', {
            url:'/servers',
            templateUrl: '/static/partials/servers.html',
            controller:'ServersCtrl',
            authenticate: true
        })
        .state('panel', {
            url:'/panel/:hostname',
            params: {
                hostname:{
                    value:'default',
                    squash:false
                }
            },
            templateUrl:'/static/partials/panel.html',
            controller:'PanelCtrl',
            authenticate: true
        })

    $urlRouterProvider.otherwise('/');
    // $locationProvider.html5Mode(true);
}])


