angular.module('myApp')

.controller('PanelCtrl', [
    '$scope',
    '$http',
    'ProfilesService',
    'AuthService',
    function($scope, $http, ProfilesService, AuthService){
    
    $scope.server          = "default.vps.fr"
    $scope.user            = AuthService.getUser()
    $scope.bruteforce_list = []

    var isFetched = false;

    $scope.options = {
            "bruteforce_attempts": false,
            "map_active":false
    }
    
    console.log("[DEBUG] Options: ")
    console.log("\tBruteforce attempts : " + $scope.options.bruteforce_attempts)
    console.log("\tMap Active          : " + $scope.options.map_active)

    $scope.showMap = function(){
        $scope.options.map_active = ($scope.options.map_active) ? false : true;
    }

    $scope.fetchBruteforceList = function(){
        var error = false;
        console.log("[DEBUG] isfetched : " + isFetched)
        if (!isFetched){
            ProfilesService.setBruteforceList($scope.user, $scope.server)
            .then(function(data){
                console.log("[DEBUG] Success fetching attemps")
                $scope.options.bruteforce_attempts = ($scope.options.bruteforce_attempts) ? false : true;
                isFetched = true;
            })
            .catch(function(){
                console.log("[DEBUG] failed fetching attemps")
                $scope.options.bruteforce_attempts = false;
                error = true;
            })    
        } else {
            $scope.options.bruteforce_attempts = ($scope.options.bruteforce_attempts) ? false : true;
        }

        if(!error){
            $scope.bruteforce_list = []
            $scope.bruteforce_list = ProfilesService.getBruteforceList();
        }
        
    }
//   get_profiles = ProfilesService.getProfiles();
//   $scope.profiles = get_profiles


//   $scope.markers = []

//   idKey = 0


//   $scope.map = {
//     center: {
//       latitude: 48.8628,
//       longitude: 2.3292
//     },
//     zoom: 3
//   };

//   $scope.markers = [];

//     $scope.clickMarker = function(marker) {
//       alert(marker.ip); 
//     };


//   $scope.createMarkers = function(){
//     for (var i = 1; i <= 100; i++) {
//         var m = {
//             id: i,
//             coord:{
//               latitude: $scope.profiles[i].latitude,
//               longitude: $scope.profiles[i].longitude  
//             },
//             icon: "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png",
//             ip:$scope.profiles[i].ip
//         }

//         $scope.markers.push(m);
//     }  
//   }

    
//   $scope.createMarkers();
}])