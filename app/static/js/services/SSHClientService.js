angular.module('myApp.SSHClientService', [])

.factory('SSH', ['$q', '$timeout', '$http', function($q, $timeout, $http){

    var clients = [];

    return {
        addServer: addServer,
        connect: connect,
        disconnect: disconnect,
        getServers: getServers
    };

    function addServer(name, hostname, username, port){
        var deferred = $q.defer();

        $http.post('/addserver', {
            name: name, 
            hostname: hostname,
            username: username,
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
            console.log(data[0])
            console.log(data[2])

            console.log()
            if(status == 200 && data[0].result){
                // console.log(JSON.stringify(data.clients))
                console.log("So far so good")
                deferred.resolve(data)
            } else {
                deferred.reject()
                console.log("Not so good " + data['result'] )
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