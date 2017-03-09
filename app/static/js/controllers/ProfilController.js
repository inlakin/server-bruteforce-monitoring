/**
* myApp.UserProfil Module
*
* Description
*/
angular.module('myApp.UserProfil', ['angular-terminal'])

.run(function ($rootScope) {

    var terminal_help = 
        'List of commands:\n ' +
        '\thelp\t\tprint this menu\n' +
        '\twhoami\t\tprint user info\n' +
        '\tssh\t\tssh command\n' +
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

.controller('ProfilCtrl', [
    '$scope',
    '$state',
    '$http',
    'SSH',
    'AuthService',
    function($scope, $state, $http, SSH, AuthService){
    
    errorMessage   = "";
    successMessage = "";
    
    $scope.connected = true;

    $scope.servers   = [];
    $scope.user      = "";
    $scope.serversUp = [];


    $scope.getServer = function(){
        SSH.getServers($scope.user)
        .then(function(data){

            for (var i=1; i < data.length;i++){
                s = []

                s['name']     = data[i]['name'];
                s['hostname'] = data[i]['hostname'];
                s['username'] = data[i]['username'];
                s['port']     = data[i]['port'];

                $scope.servers.push(s)
            }
        })
        .catch(function(){
            console.log("[-] Failed to fetch servers")
        })
    }
    
    $scope.addServer = function(){

        // Need to check first connection before adding 
        // 
       SSH.addServer($scope.serverForm.name, $scope.serverForm.hostname, $scope.serverForm.username, $scope.serverForm.port, $scope.user)
        .then(function(){
            $scope.success        = true;
            $scope.successMessage = "Server added"
            $scope.serverForm     = {}
            $scope.disabled       = false
            console.log("[*] Server added");
            // Need to dismiss the modal
            //  $state.reload()
        })
        .catch(function(){
            $scope.error        = true;
            $scope.errorMessage = "Failed to add server"
            $scope.serverForm   = {}
            $scope.disabled     = false;
            console.log("[*] Failed to add server")
        })
    }

    $scope.connect = function(username, hostname, port){
        // $scope.connected = true;
        connect = false;
        email = $scope.user;

        if ($scope.serversUp.length == 0){

            SSH.connect(hostname, username, port, email)
            .then(function(){
                console.log("[DEBUG] Connected")
                $scope.serversUp.push({'hostname':hostname});
                $scope.connected = true;
            })
            .catch(function(){
                console.log("[DEBUG] Not connected")
            });
        } else {

            var i = 0;

            for (i = 0; i < $scope.serversUp.length; i++){
                if ($scope.serversUp[i].hostname == hostname){
                    connect = true
                    break;
                }
            }

            if (!connect){
                console.log("[*] Connecting to " + username + "@" + hostname + ":" + port + " for " + email)
                
                SSH.betaConnect(hostname, username, port, email)
                .then(function(){
                    console.log("[DEBUG] Connected")
                    $scope.serversUp.push({'hostname':hostname});
                    $scope.connected = true;
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
        // $scope.connected = false;
        disconnected = false;
        nb_loop = $scope.serversUp.length;
        
        if ($scope.serversUp.length !== 0){
            var i = 0;
            while (disconnected == false && i < nb_loop){

                // Need to fix the poping stuff
                if ($scope.serversUp[i] !== undefined){
                    if($scope.serversUp[i].hostname == hostname){
                        SSH.betaDisconnect(hostname, $scope.user)
                        .then(function(){
                            //  FIX FOLLOWING LINE 
                            $scope.serversUp.pop(i);
                            disconnected = true;    
                        })
                        .catch(function(){
                            console.log("Catched")
                        });
                    }
                }
                i++;   
            }
        } 
    }

    $scope.getServersUp = function(){
        
        SSH.getClientsList($scope.user)
        .then(function(data){
            $scope.serversUp = [];
            for (var i = 0 ; i<data.length; i++){
                var client = {'hostname':data[i].hostname}
                console.log("[DEBUG] Adding " + client.hostname + " to servers up")
                $scope.serversUp.push(client)
            }
        })
        .catch(function(){
            console.log("[*] Failed")
        })
    }

    $scope.deleteServer = function(username, hostname, port){
        console.log("[*] Deleting " + username + "@" + hostname + ":" + port)
    }

    $scope.refreshServer = function(){

        $scope.servers   = [];
        $scope.serversUp = [];

        $scope.getServer();
        $scope.getServersUp();
    }

    $scope.user = AuthService.getUser()

    if ($scope.user !== "") {
        console.log("[*] getUser() : "+ AuthService.getUser());
        $scope.refreshServer()
    } else {
        console.log("[*] User not found");
        $state.go('home');
    }
    
}])