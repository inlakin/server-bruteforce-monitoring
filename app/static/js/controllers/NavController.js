angular.module('myApp')

.controller('NavCtrl', [
    '$scope',
    '$http',
    '$state',
    'AuthService',
    'SERVER',
    function($scope, $http, $state, AuthService, SERVER){
    
    $scope.loggedIn = false;

    if (AuthService.getUser() == ""){
        $scope.loggedIn = false;
        $scope.userEmail = "";

    } else {
        $scope.loggedIn = true;
        $scope.userEmail = AuthService.getUser();
    }

    $scope.logout = function () {
        AuthService.logout()
        .then(function () {
            $state.go('login');
        });
    };
}])