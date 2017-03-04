angular.module('myApp')

.controller('NavCtrl', [
    '$scope',
    '$http',
    '$state',
    'AuthService',
    'SSH',
    function($scope, $http, $state, AuthService, SSH){
    
    $scope.loggedIn = false;

    if (AuthService.getUser() == ""){
        $scope.loggedIn = false;
        $scope.userEmail = "";

        console.log("Logged in : " + $scope.loggedIn)
        console.log("User email " + $scope.userEmail)

    } else {
        $scope.loggedIn = true;
        $scope.userEmail = AuthService.getUser();

        console.log("Logged in : " + $scope.loggedIn)
        console.log("User email " + $scope.userEmail)

    }

    $scope.logout = function () {
        AuthService.logout()
        .then(function () {
            $state.go('login');
        });
    };
}])