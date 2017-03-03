/**
* AuthService Module
*
* Description
*/
angular.module('myApp.AuthenticationService', [])

.factory('AuthService', [
    '$q',
    '$timeout', 
    '$http', 
    function($q, $timeout, $http){


    var user = null;
    var user_email = "";

    return ({
        isLoggedIn: isLoggedIn,
        login: login,
        logout: logout,
        register: register,
        getUserStatus: getUserStatus,
        getUser: getUser
    });

    function isLoggedIn(){
        if(user){
            return true;
        } else {
            return false;
        }
    }

    function login(email, password){
        var deferred = $q.defer();

        $http.post('/auth/login', {email:email, password:password})
        .success(function(data, status) {
            if (status === 200 && data.result){
                user = true;
                localStorage.setItem('email', data.email)
                deferred.resolve();
            } else {
                console.log('[-] Failed to log in')
                user = false;
                localStorage.setItem('email', "")
                deferred.reject();
            }
        })
        .error(function(data){
            console.log('[-] Error on login')
            user = false;
            deferred.reject()
        });

        return deferred.promise;
    }

    function logout(){
        var deferred = $q.defer();

        $http.get('/auth/logout')
        .success(function(data){
            user = false;
            deferred.resolve()
        })
        .error(function(data){
            user = false;
            deferred.reject()
        });

        return deferred.promise;
    }

    function register(email, password){
        var deferred = $q.defer();

        $http.post('/auth/register', {email:email, password:password})
        .success(function(data, status){
            if (status === 200 && data.result){
                deferred.resolve();
            } else {
                deferred.reject("Error: email already taken")
            }
        })
        .error(function(data){
            deferred.reject();
        });

        return deferred.promise;
    }

    function getUserStatus(){

        return $http.get('/auth/status')
            .success(function(data){
                if (data.status) {
                    user = true;
                } else {
                    user = false;
                }
            })
            .error(function(data){
                user = false;
            })
    }

    function getUser(){
        
        user_email = localStorage.getItem('email');
        if (user_email != ""){
            return user_email
        } else {
            return ""
        }
    }

    //     var deferred = $q.defer()

    //     $http.get('/getuser')
    //     .success(function(data, status){
    //         if (status == 200 && data.result){
    //             deferred.resolve(data.user_id)
    //             console.log('[*] User fetched ' + data.user_id)
    //         } else {
    //             deferred.reject()
    //             console.log('[*] Failed to fetch user id')
    //         }
    //     })
    //     .error(function(data){
    //         deferred.reject()
    //         console.log('[*] Oups something went wrong while fetching user')            
    //     })
    // }
}]);