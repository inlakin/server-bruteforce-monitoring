angular.module('myApp.ProfilesService', [])
.service('ProfilesService', function () {
    
    var profiles = [];
    return {
        getProfiles: function () {
            return profiles;
        },
        setProfiles: function(value) {
            profiles = value;
        }
    };
});