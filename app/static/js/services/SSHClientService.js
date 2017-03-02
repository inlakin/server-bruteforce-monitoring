angular.module('myApp.SSHClientService', [])

.factory('SSH', ['$q', '$timeout', '$http', function($q, $timeout, $http){

    var clients = [];

    return {
        addServer: addServer,
        connect: connect,
        disconnect: disconnect,
        getServers: getServers
    };

    function addServer(hostname, password, username, port){
        var deferred = $q.defer();

        $http.post('/addserver', {
            hostname:hostname,
            username: username,
            password:password,
            port: port
        })
        .success(function(data, status){
            if (status == 200 && data.result){
                deferred.resolve();
            } else {
                deferred.reject("Error : Server already exist in DB")
            }
        })
        .error(function(data){
            deferred.reject();
        });

        return deferred.promise;
    }

    function connect(hostname, username, password, port){
        var deferred = $q.defer();

        $http.post('/connect', {
            hostname: hostname, 
            username:username,
            password:password,
            port:port
        })
        .success(function(data, status){
            if (status == 200 && data.result){
                client_id = data.id;
                clients.push({'id':client_id})
                console.log("[*] Connected to " + client_id)
                deferred.resolve();      
            } else {
                deferred.reject();
            }
        })
        .error(function(data){
            deferred.reject();
        });

        return deferred.promise;
    }

    function getServers(){
        var deferred = $q.defer();

        $http.get('/getservers')
        .success(function(data, status){
            if(status == 200 && data.result){
                console.log(JSON.stringify(data.client))
                console.log("So far so good")
                deferred.resolve(data.client)
            } else {
                deferred.reject()
                console.log("Not so good " + data.result )
                console.log(JSON.stringify(data, null, 2))
            }
        })
        .error(function(data){
            deferred.reject()
        })

        return deferred.promise;

    }
    function disconnect(hostname){
        var deffered = $q.defer();

        $http.post('/disconnect/'+hostname)
        .success(function(data, result){
            if (status == 200 && data.result){
                client_id = data.id
                client.pop({'id': client_id})
                deferred.resolve();
            }else{
                deferred.reject();
            }
        })
        .error(function(data){
            deffered.reject();
        });

        return deferred.promise;
    }
}])