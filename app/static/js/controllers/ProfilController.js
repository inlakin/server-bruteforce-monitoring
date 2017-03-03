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
    'AuthService',
    function($scope, $state, $http, SSH, AuthService){
    
    errorMessage   = ""
    successMessage = ""

    $scope.servers = []
    $scope.user = ""

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


    if (AuthService.getUser() == "") {
        console.log("[*] getUser() : "+AuthService.getUser());
    } else {
        $scope.user = AuthService.getUser();
        console.log("[*] getUser() " + $scope.user);
        $scope.getServer($scope.user);
    }
    
}])