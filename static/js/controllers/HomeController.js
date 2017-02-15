/**
*  Module
*
* Description
*/

angular.module('myApp')

.controller('HomeCtrl', function($scope, $http){
    $scope.title='VPS - GeoIP';
    
    console.log('Home Controller')
    $scope.ssh_connect = function(){
        var ssh_object = {}
        
        ssh_object['user'] = $scope.username;
        ssh_object['password'] = $scope.password;
        ssh_object['hostname'] = $scope.hostname;
        ssh_object['port'] = 22;

        console.log(JSON.stringify(ssh_object, null, 2));

        // console.log($scope.username+"@"+$scope.hostname+":"+$scope.port)
        // console.log('password:' +$scope.password)
        $http.post('/ssh', ssh_object).success(function(data){

        }).error(function(err){
            console.log(err);
        });
    }
})

