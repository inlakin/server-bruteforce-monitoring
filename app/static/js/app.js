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
    'myApp.Authentication'
])

.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyCktMMX39icwllipmYDMPHXQRFrtgzFXK8',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
})

.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('home', {
            url:'/',
            templateUrl:'/static/partials/index.html',
            controller: 'HomeCtrl'
        })
        .state('map', {
            url:'/map',
            templateUrl:'/static/partials/map.html',
            controller:'MapCtrl'
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

    $urlRouterProvider.otherwise('/');
})


