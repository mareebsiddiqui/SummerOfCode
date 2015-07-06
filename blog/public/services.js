angular.module('blogApp.services', []).factory('ergastAPIservice', function($http) {  
  var ergastAPI = {};

  ergastAPI.getBlogs = function() {
    return $http({
      method: 'GET', 
      url: '/blogs'
    });
  };

  ergastAPI.getBlog = function(id) {
    return $http({
      method: 'GET', 
      url: 'blog/'+id
    });
  };
  
  return ergastAPI;
});