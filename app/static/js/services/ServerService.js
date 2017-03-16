angular.module('myApp.ServerService', [])

.factory('SERVER', [
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
        deleteServer: deleteServer,
        betaDisconnect: betaDisconnect,
        verify: verify,
        isConnected: isConnected
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
    
    function deleteServer(hostname, email){
        var deferred = $q.defer()

        $http.post('/deleteServer', {
            hostname:hostname,
            email:email
        })
        .success(function(data){
            if(data.result){
                deferred.resolve();
                console.log("[DEBUG] Removed from DB : " + hostname);
            } else {
                console.log("[DEBUG] Something failed (else)")
                deferred.reject();
            }
        })
        .error(function(err){
            console.log("[DEBUG] Something failed (error) : " + err)
            deferred.reject();
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
                console.log('[DEBUG] Disconnected in DB')
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

    function verify(server, user){
        var deferred = $q.defer()

        console.log('[DEBUG] Veriying ' + user + "@" + server + " ...")
        
        $http.post('/verify', {
            hostname:server,
            email:user
        })
        .success(function(data){
            if(data.result){
                console.log('[DEBUG] Verified !')
                deferred.resolve()    
            } else {
                console.log('[DEBUG] Not verified ... ')
                deferred.reject()
            }
        })
        .error(function(){
            console.log('[DEBUG] Something horrible happened...')
            deferred.reject()
        })

        return deferred.promise;
    }

    function isConnected(server, user){
        var deferred = $q.defer()

        $http.post('/isConnected', {
            hostname: server,
            email: user
        })
        .success(function(data){
            if (data.result){
                console.log('[DEBUG] Server is up')
                deferred.resolve()
            } else {
                console.log('[DEBUG] Server is down')
                deferred.reject()
            }
        })
        .error(function(){
            console.log('[DEBUG] Something horrible happened')
        })

        return deferred.promise;
    }
}])