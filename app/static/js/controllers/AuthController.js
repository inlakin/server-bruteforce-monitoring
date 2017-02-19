angular.module('myApp.Authentication', [])

.controller('AuthCtrl', function($scope, $http){

    $scope.login = function(){
        user = {}
        user['username'] = $scope.username
        user['password'] = $scope.password

        console.log($scope.username + " " + $scope.password)

        $http.post('/login', user).success(function(data){
            console.log(data);
        }).error(function(err){
            console.log(err);
        })
    }   

    $scope.register = function(){
        user                    = {}
        
        user['username']        = $scope.username
        user['password']        = $scope.password
        // user['ssh']             = {}
        // user['ssh']['hostname'] = $scope.ssh_hostname
        // user['ssh']['username'] = $scope.ssh_username
        // user['ssh']['password'] = $scope.ssh_password
        // user['ssh']['port']     = $scope.ssh_port

        console.log("Basic info")
        console.log($scope.username + " " + $scope.password)
        // console.log("SSH info")
        // console.log($scope.ssh_username+"@"+$scope.ssh_hostname+":"+$scope.ssh_port+" PASS: " + $scope.ssh_password)
        
        $http.post('/register', user).success(function(data){
            console.log(data);
        }).error(function(err){
            console.log(err);
        })        
    }    
})