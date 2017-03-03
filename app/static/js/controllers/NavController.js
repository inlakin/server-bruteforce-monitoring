angular.module('myApp')

.controller('NavCtrl', [
    '$scope',
    '$http',
    '$state',
    'AuthService',
    'SSH',
    function($scope, $http, $state, AuthService, SSH){
    
    $scope.loggedIn = false;
    $scope.user_email = "";

    if (AuthService.getUser() == ""){
        $scope.loggedIn = false;
        $scope.user_email = "";

        console.log("Logged in : " + $scope.loggedIn)
        console.log("User email " + $scope.user_email)

    } else {
        $scope.loggedIn = true;
        $scope.user_email = AuthService.getUser();

        console.log("Logged in : " + $scope.loggedIn)
        console.log("User email " + $scope.user_email)

    }

    $scope.logout = function () {

        AuthService.logout()
        .then(function () {
            $state.go('login');
        });
    };
}])