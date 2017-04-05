// $scope.initScope = function(){
//      // Do Stuff
//      $scope.user = "";
//      $scope.isLoggedIn = true;
// }
// 
// 
// $scope.on('$routeChangeUpdate', initScope)
// $scope.on('$routeChangeSuccess', initScope)
// 

/**
* myApp.UserProfil Module
*
* Description
*/
angular.module('myApp.Servers', ['angular-terminal'])

.run(function ($rootScope) {

    var terminal_help = 
        'List of commands:\n ' +
        '\thelp\t\tprint this menu\n' +
        '\twhoami\t\tprint user info\n' +
        '\tSERVER\t\tSERVER command\n' +
        '\tpwd\t\tprint this page\n';
    
    // console.log(terminal_help)

    $rootScope.$on('terminal.main', function (e, input, terminal) {
        // $rootScope.$emit('terminal.main.echo', 'input received: ' + input)

        if(input === 'help'){
            $rootScope.$emit('terminal,main.echo', terminal_help)
        } else if(input === 'whoami'){
            $rootScope.$emit('terminal.main.echo', 'michel')
        } else if(input === 'pwd'){
            $rootScope.$emit('terminal.main.echo', '/server-monitoring/dashboard')
        } else {
            $rootScope.$emit('terminal.main.echo', '[*] Error: unknow command: ' + input )
        }

    });
})

.controller('ServersCtrl', [
    '$scope',
    '$state',
    '$http',
    'SERVER',
    'AuthService',
    function($scope, $state, $http, SERVER, AuthService){
    
    $scope.user             = "";
    errorMessage            = "";
    successMessage          = "";
    $scope.connected        = true;
    $scope.noServers        = true;
    $scope.connectionFailed = false;
    $scope.connection_error = "";
    $scope.servers          = [];
    $scope.serversUp        = [];
    $scope.form             = {};

    $scope.getServers = function(){

        SERVER.getServers($scope.user)
        .then(function(data){
            $scope.noServers = false;
            console.log(JSON.stringify(data, null, 2))
            console.log("data[0] "+JSON.stringify(data[0], null, 2))
            console.log("data[1] "+JSON.stringify(data[0], null, 2))
            console.log("data[2] "+JSON.stringify(data[0], null, 2))
            $scope.servers   = [];
            $scope.serversUp = [];

            for (var i=1; i < data.length;i++){
                s = []
                s['name']      = data[i]['name'];
                s['hostname']  = data[i]['hostname'];
                s['username']  = data[i]['username'];
                s['port']      = data[i]['port'];

                if (data[i]['up']){
                    s['connected'] = true;
                    $scope.serversUp.push({'hostname':s['hostname']})
                } else {
                    s['connected'] = false;
                }

                $scope.servers.push(s)
            }
        })
        .catch(function(data){
            if (data != null){
                console.log(data)
                $scope.noServers = true;
            }else{
                console.log("[-] Failed to fetch servers")

            }
        })
    }
    
    $scope.addServer = function(){

        // Need to check first connection before adding 
        // 
       SERVER.addServer($scope.serverForm.name, $scope.serverForm.hostname, $scope.serverForm.username, $scope.serverForm.port, $scope.user, $scope.serverForm.password)
        .then(function(){
            $scope.success        = true;
            $scope.successMessage = "Server added"
            $scope.serverForm     = {}
            $scope.disabled       = false

            console.log("[*] Server added");
            $scope.noServers = false;
            $scope.getServers()
        })
        .catch(function(){
            $scope.error        = true;
            $scope.errorMessage = "Failed to add server"
            $scope.serverForm   = {}
            $scope.disabled     = false;

            console.log("[*] Failed to add server")
        })
    }

    $scope.serverUp = function(hostname){
        for(var i = 0; i < $scope.servers.length; i++){
            console.log('[DEBUG] Looking for a match with ' + $scope.servers[i].hostname)
            if($scope.servers[i].hostname === hostname){
                $scope.servers[i].connected = true;
                $scope.serversUp.push({'hostname':hostname})
                break;
            }
        }
    }

    $scope.serverDown = function(hostname){
        for (var i = 0; i < $scope.servers.length; i++){
            if($scope.servers[i].hostname === hostname){
                for(var j = 0; j < $scope.serversUp.length; j++){
                    if($scope.serversUp[j].hostname === hostname){
                        $scope.serversUp.splice(j,1)
                        $scope.servers[i].connected = false;
                        break;
                    }
                }
                break;
            }
        }
    }
    
    $scope.connect = function(username, hostname, port){
        connect                 = false;
        email                   = $scope.user;
        $scope.connectionFailed = false;        
        
        console.log(username + " " + hostname + " " + port + " " + $scope.form.server_password)
        $scope.connectionFailed = false;
        if ($scope.serversUp.length == 0){

            SERVER.connect(hostname, username, port, email, $scope.form.server_password)
            .then(function(){
                console.log("[DEBUG] Connected")
                $scope.serverUp(hostname)
            })
            .catch(function(data){
                console.log("[DEBUG] Not connected " + data)
                $scope.connectionFailed = true;
                $scope.connection_error = data;
            });
        } else {

            for (var i = 0; i < $scope.serversUp.length; i++){
                if ($scope.serversUp[i].hostname == hostname){
                    connect = true
                    break;
                }
            }

            if (!connect){
                console.log("[*] Connecting to " + username + "@" + hostname + ":" + port + " for " + email)
                
                SERVER.connect(hostname, username, port, email)
                .then(function(){
                    console.log("[DEBUG] Connected")
                    $scope.serverUp(hostname)
                })
                .catch(function(){
                    console.log("[DEBUG] Not connected")
                });
            } else {
                console.log('[DEBUG] Already connected to ' + hostname)
            }
        }
    }

    $scope.disconnect = function(hostname){
        disconnected = false;
        
        if ($scope.serversUp.length !== 0){
            var i = 0;
            while (disconnected == false && i < $scope.serversUp.length){

                if ($scope.serversUp[i] !== undefined){
                    if($scope.serversUp[i].hostname == hostname){
                        SERVER.betaDisconnect(hostname, $scope.user)
                        .then(function(){
                            $scope.serverDown(hostname)
                            disconnected = true;    
                        })
                    }
                }
                i++;   
            }
        } 
    }

    $scope.deleteServer = function(hostname){
        console.log("[*] Deleting " + hostname + " for user " + $scope.user)

        SERVER.deleteServer(hostname, $scope.user)
        .then(function(){
            $scope.getServers()
            console.log("[DEBUG] Remove " +hostname+" : success")
        })
    }

    // $scope.accessPanel = function(hostname){
    //     console.log('[DEBUG] Accessing panel for ' + hostname)

    //     $state.go('panel/' + hostname)

    // }
    
    $scope.user = AuthService.getUser()

    if ($scope.user !== "") {
        console.log("[*] getUser() : "+ AuthService.getUser());
        $scope.getServers()
    } else {
        console.log("[*] User not found");
        $state.go('home');
    }
    
}])