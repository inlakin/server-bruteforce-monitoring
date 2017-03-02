angular.module('myApp.Authentication', [])

.controller('AuthCtrl', [
    '$scope', 
    '$state', 
    '$http', 
    'AuthService',
    function($scope, $state, $http, AuthService){


    $scope.login = function(){
        $scope.disabled = false
        $scope.error    = false

        AuthService.login($scope.loginForm.email, $scope.loginForm.password)
        .then(function(){
            $state.go('profil');
            $scope.disabled  = false;
            $scope.loginForm = {}
            console.log('Logged in ')
        })

        .catch(function(){
            $scope.error        = true;
            $scope.errorMessage = "Invalid email or password";
            $scope.disabled     = false;
            $scope.loginForm    = {}
            console.log('Failed to log in ')
        })
    };

    $scope.register = function(){
        $scope.disabled = false;
        $scope.error = false;

        AuthService.register($scope.registerForm.email, $scope.registerForm.password)
        .then(function(){
            $state.go('home');
            $scope.disabled     = false;
            $scope.registerForm = {}
            console.log('Registration successful')
        })
        .catch(function(err){
            $scope.error        = true;
            $scope.errorMessage = err;
            $scope.disabled     = false;
            $scope.registerForm = {}
            console.log(err)
        })
    }

    $scope.logout = function () {

        AuthService.logout()
        .then(function () {
            $state.go('login');
        });
    };

}])

