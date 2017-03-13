angular.module('myApp')

.controller('PanelCtrl', [
    '$scope',
    '$http',
    'ProfilesService',
    'AuthService',
    function($scope, $http, ProfilesService, AuthService){

    $scope.server    = ""
    $scope.user      = AuthService.getUser()
    $scope.isFetched = false;
    $scope.showMap   = false;

    console.log("PanelCtrl : "+$scope.user)

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