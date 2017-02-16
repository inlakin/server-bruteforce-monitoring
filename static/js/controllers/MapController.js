angular.module('myApp')

.controller('MapCtrl', function($scope, $http, ProfilesService){

  console.log('Map Controller')
  get_profiles = ProfilesService.getProfiles();
  $scope.profiles = get_profiles
  $scope.markers = []

  idKey = 0

  $scope.map = {
    center: {
      latitude: 48.8628,
      longitude: 2.3292
    },
    zoom: 3,
    bounds: {
      northeast: {
        latitude: 45.1451,
        longitude: -80.6680
      },
      southwest: {
        latitude: 30.000,
        longitude: -120.6680
      }
    }
  };
  $scope.options = {
    scrollwheel: false
  };

  $scope.createMarkers = function(){
    for (var i = 0; i < $scope.profiles.length-1; i++) {
        var ret = {
            id: i+1,
            coord:{
              latitude: $scope.profiles[i].latitude,
              longitude: $scope.profiles[i].longitude  
            }
        }

        $scope.markers.push(ret);
    }  
  }
    
  $scope.createMarkers();
})