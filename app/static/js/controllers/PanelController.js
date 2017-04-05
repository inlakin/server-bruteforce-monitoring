angular.module('myApp')

.controller('PanelCtrl', [
    '$scope',
    '$http',
    'ProfilesService',
    'AuthService',
    '$stateParams',
    'SERVER',
    '$state',
    'orderByFilter',
    function($scope, $http, ProfilesService, AuthService, $stateParams, SERVER, $state, orderBy){
    
    $scope.server          = $stateParams.hostname
    $scope.user            = AuthService.getUser()
    $scope.bruteforce_list = []
    $scope.isUp            = false;
    $scope.getinfo         = false;
    var verified           = false;
    var isFetched          = false;

    $scope.myDataSource = {
        chart: {
            caption: "Harry's SuperMart",
            subCaption: "Top 5 stores in last month by revenue",
        },
        data:[{
            label: "Bakersfield Central",
            value: "880000"
        },
        {
            label: "Garden Groove harbour",
            value: "730000"
        },
        {
            label: "Los Angeles Topanga",
            value: "590000"
        },
        {
            label: "Compton-Rancho Dom",
            value: "520000"
        },
        {
            label: "Daly City Serramonte",
            value: "330000"
        }]
      };
    $scope.options = {
        "bruteforce_attempts": false,
        "map_active":false,
        "bruteforce_stats":false
    }

    countries = [
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
            'name':"USA",
            'attempts': 2
        },
        {
            'name':"Taiwan",
            'attempts': 20
        },
        {
            'name':"Viet Nam",
            'attempts': 36
        },
        {
            'name':"Ukraine",
            'attempts': 1
        },
        {
            'name':"Laos",
            'attempts': 93
        },
        {
            'name':"Brasil",
            'attempts': 23
        },
        {
            'name':"Canada",
            'attempts': 56
        }
    ]
    cities    = [
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
        },
        {
        'name': 'Zaghreb',
        'attempts':29
        },
        {
        'name': 'Moscou',
        'attempts':29
        },
        {
        'name': 'Lima',
        'attempts':29
        },
        {
        'name': 'Abu Dhabi',
        'attempts':29
        },
        {
        'name': 'Marseille',
        'attempts':29
        }
    ]
    usernames = [
        {
        'name':'root',
        'attempts': 3
        },
        {
        'name':'mother',
        'attempts': 6
        },
        {
        'name':'ftp',
        'attempts': 2
        },
        {
        'name':'mongo',
        'attempts': 1
        },
        {
        'name':'john',
        'attempts': 9
        },
        {
        'name':'lol',
        'attempts': 29
        },
        {
        'name':'rosie',
        'attempts': 54
        },
        {
        'name':'mickael',
        'attempts': 54
        },
        {
        'name':'goa',
        'attempts': 54
        },
        {
        'name':'hello',
        'attempts': 54
        }
    ]

    property = 'attempts';

    $scope.countries = orderBy(countries, property, true)
    $scope.cities    = orderBy(cities, property, true)
    $scope.usernames = orderBy(usernames, property, true)

    $scope.verifyServer = function(){
        SERVER.verify($scope.server, $scope.user)
        .then(function(){
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

    $scope.getInfo = function(host){
       console.log("[DEBUG] Getting more info about " + host)
       $scope.getinfo = ($scope.getinfo) ? false : true;
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


        // Process stats for attempts by countries
        if (ProfilesService.setAttemptsByCountries()){
            console.log("[*] [DEBUG] Attempts by Countries available")
        } else {
            console.log("[!] [DEBUG] Attempts by Countries unavailable")
        }
        // for 

        // Process stats for attempts by cities
        // process stats for attempts by username

        $scope.options.bruteforce_stats = ($scope.options.bruteforce_stats) ? false:true; 
    }

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