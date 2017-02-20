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

        // user = {}
        // user['email'] = $scope.email
        // user['password'] = $scope.password

        // console.log($scope.email + " " + $scope.password)

        // $http.post('/login', user).success(function(data){
        //     console.log(data);
        // }).error(function(err){
        //     console.log(err);
        // })
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

    // $scope.register = function(){
    //     user                    = {}
        
    //     user['email']        = $scope.email
    //     user['password']        = $scope.password
    //     // user['ssh']             = {}
    //     // user['ssh']['hostname'] = $scope.ssh_hostname
    //     // user['ssh']['email'] = $scope.ssh_email
    //     // user['ssh']['password'] = $scope.ssh_password
    //     // user['ssh']['port']     = $scope.ssh_port

    //     console.log("Basic info")
    //     console.log($scope.email + " " + $scope.password)
    //     // console.log("SSH info")
    //     // console.log($scope.ssh_email+"@"+$scope.ssh_hostname+":"+$scope.ssh_port+" PASS: " + $scope.ssh_password)
        
    //     $http.post('/register', user).success(function(data){
    //         console.log(data)
    //         if (data['login'] === True) {
    //             $state.go('profil')
    //         } else {
    //             console.log("Failed logging in")
    //         }
    //     }).error(function(err){
    //         console.log(err);
    //     })        
    // }    
    $scope.logout = function () {

        AuthService.logout()
        .then(function () {
            $state.go('login');
        });
    };

}])

