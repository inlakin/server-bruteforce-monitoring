angular.module('myApp.ProfilesService', [])
.factory('ProfilesService', [
    '$q',
    '$timeout',
    '$http',
    function ($q, $timeout, $http) {
    
    var bruteforce_list = [];
    var countries       = [];
    var cities          = [];
    var usernames       =[];

    return {
        setBruteforceList: setBruteforceList,
        getBruteforceList: getBruteforceList,
        setAttemptsByCountries: setAttemptsByCountries,
        getAttemptsByCountries: getAttemptsByCountries,
        setAttemptsByCities: setAttemptsByCities,
        getAttemptsByCities: getAttemptsByCities,
        setAttemptsByUsername: setAttemptsByUsername,
        getAttemptsByUsername: getAttemptsByUsername
    };

    function setBruteforceList(email, hostname){
        
        var deferred = $q.defer();
        $http.post('/exec_cmd', {

        })
        .success(function(data){
            if (data[0].result) {
                console.log('[DEBUG] Length data[1] : ' + data[1].length)
                for(var i = 0; i<data[1].length; i++){
                    bf_obj = []
                    bf_obj['ip']          = data[1][i]['ip']
                    bf_obj['country']     = data[1][i]['country']
                    bf_obj['city']        = data[1][i]['city']
                    bf_obj['postal_code'] = data[1][i]['postal_code']
                    bf_obj['latitude']    = data[1][i]['latitude']
                    bf_obj['longitude']   = data[1][i]['longitude']
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
    
    function setAttemptsByCountries(){
        if (bruteforce_list.length != 0){
        //     var deferred = $q.defer()

        //     $http.post('/process-bruteforce-attempts', {
        //         request:'country'
        //     })
        //     .success(function(data){
        //         if (data.result){
        //             countries = data[1]
        //         } else {
        //             deferred.reject()
        //         }
        //     })
            for (var i=0; i<bruteforce_list.length; i++){
                console.log("[DEBUG] " + bruteforce_list[i]['country'])

            }

            return true;
        } else {
            console.log("[DEBUG] Empty bruteforce_list")
            return false;
        }
    }

    function getAttemptsByCountries(){
        return countries;
    }

    function setAttemptsByCities(){

    }

    function getAttemptsByCities(){
        return cities;
    }

    function setAttemptsByUsername(){

    }

    function getAttemptsByUsername(){
        return usernames;
    }
}]);