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
    
    console.log(terminal_help)

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
    function($scope, $state, $http, SSH){
    
    errorMessage   = ""
    successMessage = ""

    $scope.servers = [
        {
            "name": "Server perso",
            "ip": "vps214516.ovh.net",
            "username": "goa",
            "password": "****"
        },
        {
            "name": "Server pro 1",
            "ip": "frei.berlin.net",
            "username": "edgar",
            "password": "*******"
        },
        {
            "name": "Server pro 2",
            "ip": "achtung.gandhi.fr",
            "username": "sweet",
            "password": "*******"
        }
    ]
    $scope.getServer = function(){
        SSH.getServers()
        .then(function(data){
            console.log(JSON.stringify(data, null, 2))
            console.log("[*] Good job")
        })
        .catch(function(){
            console.log("[-] Failed to fetch servers")
        })
    }
    $scope.addServer = function(){

       SSH.addServer($scope.serverForm.hostname, $scope.serverForm.password, $scope.serverForm.username, $scope.serverForm.port)
        .then(function(){
            $scope.success        = true;
            $scope.successMessage = "Server added"
            $scope.serverForm     = {}
            $scope.disabled       = false
            console.log("[*] Server added");
        })
        .catch(function(){
            $scope.error        = true;
            $scope.errorMessage = "Failed to add server"
            $scope.serverForm   = {}
            $scope.disabled     = false;
            console.log("[*] Failed to add server")
        })

        // console.log(JSON.stringify(server, null, 2))
    }

    $scope.getServer();

    // $scope.getUser = function(){
    //     $http.get('/user/')
    // }
    
}])