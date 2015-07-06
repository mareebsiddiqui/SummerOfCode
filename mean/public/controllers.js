angular.module('F1FeederApp.controllers', []).controller('blogsController', function($scope, ergastAPIservice) {
    $scope.blogs = [];
    $scope.filter = "";
    $scope.search = function(driver) {
      var keyword = new RegExp($scope.filter, 'i');
      return !$scope.filter || keyword.test(blog.title);
    };
    ergastAPIservice.getBlogs().success(function(data) {
      $scope.blogs = data;
    });
});