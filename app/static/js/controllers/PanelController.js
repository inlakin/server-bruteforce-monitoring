angular.module('myApp')

.controller('PanelCtrl', [
    '$scope',
    '$http',
    'ProfilesService',
    'AuthService',
    '$stateParams',
    'SERVER',
    '$state',
    function($scope, $http, ProfilesService, AuthService, $stateParams, SERVER, $state){
    
    $scope.server          = $stateParams.hostname
    $scope.user            = AuthService.getUser()
    $scope.bruteforce_list = []
    $scope.isUp            = false;
    
    var verified           = false;
    var isFetched          = false;

    $scope.options = {
            "bruteforce_attempts": false,
            "map_active":false,
            "bruteforce_stats":false
    }

    $scope.countries = [
        {
            'name':"France",
            'attempts': 21
        },
        {
            'name':"China",
            'attempts': 107
        },
        {
            'name':"Russia",
            'attempts': 43
        },
        {
            'name':"United States of America",
            'attempts': 2
        }
    ]
    $scope.cities = [
        {
            'name': 'Budapest',
            'attempts':98
        },
        {
            'name': 'Paris',
            'attempts':8
        },
        {
            'name': 'Hong-Kong',
            'attempts':43
        },
        {
            'name': 'New-York',
            'attempts':49
        },
        {
            'name': 'Shangai',
            'attempts':29
        }
    ]
    $scope.days = [
        {
            'name':'Monday',
            'attempts': 3
        },
        {
            'name':'Tuesday',
            'attempts': 6
        },
        {
            'name':'Wednesday',
            'attempts': 2
        },
        {
            'name':'Thursday',
            'attempts': 1
        },
        {
            'name':'Friday',
            'attempts': 9
        },
        {
            'name':'Saturday',
            'attempts': 29
        },
        {
            'name':'Sunday',
            'attempts': 54
        }
    ]

    $scope.verifyServer = function(){
        SERVER.verify($scope.server, $scope.user)
        .then(function(){
            console.log("[DEBUG] Server Found")
            verified = true;

            SERVER.isConnected($scope.server, $scope.user)
            .then(function(){
                $scope.isUp = true;
            })
            .catch(function(){
                $scope.isUp = false;
            })
        })
        .catch(function(){
            console.log("[DEBUG] 404 Server Not Found")
            verified = false;
        })
        .finally(function(){
            if(!verified){
                $state.go('profil')
            }
        })
    }

    $scope.verifyServer()

    $scope.changeServerStatus = function(){
        if ($scope.isUp){
            // handle disconnection
            $scope.isUp = false;

        } else {
            // Handle connection
            $scope.isUp = true;
        }
    }
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

    $scope.showStats = function(){
        $scope.options.bruteforce_stats = ($scope.options.bruteforce_stats) ? false:true; 
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