angular.module('myApp')

.controller('MapCtrl', function($scope, $http){

  console.log('Map Controller')
  $scope.profiles = [];

    $scope.map = {
      center: {
        latitude: 48.8628,
        longitude: 2.3292
      },
      zoom: 3
      // bounds: {
      //   northeast: {
      //     latitude: 45.1451,
      //     longitude: -80.6680
      //   },
      //   southwest: {
      //     latitude: 30.000,
      //     longitude: -120.6680
      //   }
      // }
    };
    $scope.options = {
      scrollwheel: false
    };
        // var createRandomMarker = function(i, bounds, idKey) {
        //     var lat_min = bounds.southwest.latitude,
        //         lat_range = bounds.northeast.latitude - lat_min,
        //         lng_min = bounds.southwest.longitude,
        //         lng_range = bounds.northeast.longitude - lng_min;

        //       if (idKey == null) {
        //         idKey = "id";
        //       }

        //     var latitude = lat_min + (Math.random() * lat_range);
        //     var longitude = lng_min + (Math.random() * lng_range);
        //     var ret = {
        //         latitude: latitude,
        //         longitude: longitude,
        //         title: 'm' + i
        //     };
        //     ret[idKey] = i;
        //     return ret;
        // };
        // var markers = [];
    for (var i = 0; i < $scope.profiles.length-1; i++) {
        var ret = {
            latitude: $scope.profiles[i].latitude,
            longitude: $scope.profiles[i].longitude
        }
        ret[idKey] = i
        $scope.randomMarkers.append(ret);

      // markers.push(createRandomMarker(i, $scope.map.bounds))
    }
        
        // $scope.randomMarkers = markers;

    $scope.getIP = function(){
        $http.get('/getprofiles').then(function(response){
            $scope.profiles = response.data;
            console.log($scope.profiles[0])
            console.log('fetched profiles')
        }, function(err){
            console.log(err);
        })
    }

    $scope.createMarkers = function(){
        for (var i = 0; i < ($scope.profiles.length) - 1; i++){

            var ret = {
                latitude: $scope.profiles[i].latitude,
                longitude: $scope.profiles[i].longitude
            }
            console.log(JSON.stringify(ret, null, 2))
            $scope.markers.append(ret);

        } 
    }

    $scope.getIP();
    $scope.createMarkers();
})