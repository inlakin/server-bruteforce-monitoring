angular.module('myApp.SSHCmdService', [])

.factory('SSH_Cmd', [
    '$q',
    '$timeout',
    '$http',
    '$scope',
     function($q, $timeout, $http, $scope){

        return{
            ssh_cmd_list: function(){
                var cmd_list = []

                cmd_list['zgrep'] = "zgrep 'Failed password for' /var/log/auth.log* | grep -Po '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' | sort | uniq"

                return cmd_list
            }
        };
    
}])