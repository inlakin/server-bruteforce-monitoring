angular.module('myapp.Logout',['$scope', '$state', 'AuthService'])

.controller('logoutCtrl',[
    '$scope', 
    '$state',
    'AuthService',
    function ($scope, $state, AuthService) {

    $scope.logout = function () {

      // call logout from service
      AuthService.logout()
        .then(function () {
          $state.go('login');
        });

    };

}]);