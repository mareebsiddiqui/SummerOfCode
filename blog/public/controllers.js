angular.module('blogApp.controllers', []).controller('blogsController', function($scope, $rootScope, $location, ergastAPIservice) {
    $rootScope.location = $location.path();
    $scope.blogs = [];
    $scope.searchText = "";
    ergastAPIservice.getBlogs().success(function(data) {
    	if(typeof data == "object") $scope.blogs = data;
    });
}).controller('blogController', function($scope, $routeParams, $rootScope, $location, ergastAPIservice) {
	$scope.location = $location.path();
    ergastAPIservice.getBlog($routeParams.id).success(function(data) {
      $scope.blog = data;
    });
});