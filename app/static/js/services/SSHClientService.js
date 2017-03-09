angular.module('myApp.SSHClientService', [])

.factory('SSH', [
    '$q',
    '$timeout', 
    '$http', 
    function($q, $timeout, $http){

    var clients = [];

    return {
        addServer: addServer,
        connect: connect,
        disconnect: disconnect,
        getServers: getServers,
        betaDisconnect: betaDisconnect,
        getClientsList: getClientsList
    };

    function addServer(name, hostname, username, port, email){
        var deferred = $q.defer();

        $http.post('/addserver', {
            name: name, 
            hostname: hostname,
            username: username,
            port: port,
            email: email
        })
        .success(function(data, status){
            if (status == 200 && data.result){
                deferred.resolve();
            } else {
                deferred.reject()
            }
        })
        .error(function(){
            deferred.reject();
        });

        return deferred.promise;
    }

    function getServers(email){
        var deferred = $q.defer();

        $http.post('/getservers', {email:email})
        .success(function(data, status){
            if(status == 200 && data[0].result){
                deferred.resolve(data)
            } else {
                deferred.reject()
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

    function connect(hostname, username, port, email){
        console.log("[DEBUG] Processing " + hostname + " " + username)
        var deferred = $q.defer();

        c = {
            'hostname':hostname, 
            'username':username, 
            'port':port,
            'email': email
        }

        $http.post('/connect', c)
        .success(function(data){
            if (data.result){
                console.log("[*] Adding " + c.hostname + " to clients list")
                clients.push(c);
                deferred.resolve()    
            } else {
                deferred.reject();
            }
        })
        .error(function(){
            deferred.reject()
        })

        return deferred.promise;
    }

    function betaDisconnect(hostname, email){
        
        var deferred = $q.defer()

        $http.post('/betadisconnect', {'hostname':hostname, 'email':email})
        .success(function(data){
            if (data.result){
                console.log('[DEBUG] Disconnected')
                deferred.resolve()
            }else {
                deferred.reject()
                console.log("[DEBUG] Not connected to this server")
            }
        })
        .error(function(){
            console.log('[DEBUG] Fail disconnecting')
            deferred.reject()
        })

        return deferred.promise;
    }

    function getClientsList(email){
        var deferred = $q.defer();
        clients = [] 
        $http.post('/getclientslist', {'email':email})
        .success(function(data){
            if(data[0].result){
                var i = 0;
                for (i = 1 ; i < data.length; i++){
                    c = [];

                    c['name']     = data[i]['name'];
                    c['hostname'] = data[i]['hostname'];
                    c['username'] = data[i]['username'];
                    c['port']     = data[i]['port'];

                    clients.push(c);
                }    
                deferred.resolve(clients)
            } else {
                console.log('[DEBUG] Clients list empty')
                deferred.reject()
            }
        })
        .error(function(){
            deferred.reject()
        })

        return deferred.promise;

        // if (clients.length == 0){
        //     deferred.reject();
        //     console.log("[*] Not connected to any clients")
        // } else {
        //     deferred.resolve(clients);
        //     console.log("[*] Clients sent")
        // }
        // return deferred.promise;
    }
}])