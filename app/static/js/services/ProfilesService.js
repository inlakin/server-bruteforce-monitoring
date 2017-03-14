angular.module('myApp.ProfilesService', [])
.factory('ProfilesService', [
    '$q',
    '$timeout',
    '$http',
    function ($q, $timeout, $http) {
    
    var bruteforce_list = [];

    return {
        setBruteforceList: setBruteforceList,
        getBruteforceList: getBruteforceList,
    };

    function setBruteforceList(email, hostname){
        
        var deferred = $q.defer();
        $http.post('/exec_cmd', {

        })
        .success(function(data){
            if (data[0].result) {
                for(var i = 0; i<data[1].length; i++){
                    bf_obj = []
                    bf_obj['ip']          = data[1][i]['ip']
                    // bf_obj['country']     = data.result[i]['country']
                    // bf_obj['city']        = data.result[i]['city']
                    // bf_obj['postal_code'] = data.result[i]['postal_code']
                    // bf_obj['latitude']    = data.result[i]['latitude']
                    // bf_obj['longitude']   = data.result[i]['longitude']
                    // To add : Timestamp + Target
                    
                    bruteforce_list.push(bf_obj)
                }
                deferred.resolve()
            } else {
                deferred.reject()
            }
        })
        .error(function(){
            deferred.reject()
        })

        return deferred.promise;
    }
    
    function getBruteforceList(){
        return bruteforce_list;
    }
}]);