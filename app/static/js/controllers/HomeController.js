/**
*  Module
*
* Description
*/

angular.module('myApp')

.controller('HomeCtrl', function($scope, $state, $http, ProfilesService){
    $scope.title='VPS - GeoIP';
    
    $scope.ssh_connect = function(){
        var ssh_object = {}
        
        ssh_object['user']     = $scope.username;
        ssh_object['password'] = $scope.password;
        ssh_object['hostname'] = $scope.hostname;
        ssh_object['port']     = 22;

        console.log(JSON.stringify(ssh_object, null, 2));

        $http.post('/ssh', ssh_object).success(function(data){
            ProfilesService.setProfiles(data);
            $state.go('map');
        }).error(function(err){
            console.log(err);
        });
    }
})