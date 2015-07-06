'use strict';
angular.module('blogApp', [
    'blogApp.controllers',
    'blogApp.services',
    'ngRoute'
]).config(['$routeProvider', function($routeProvider) {
  $routeProvider.
 	when("/login", {templateUrl: "login.html", controller: "blogsController"}).
	when("/blogs", {templateUrl: "partials/bloglist.html", controller: "blogsController"}).
	when("/blogs/:id", {templateUrl: "partials/blog.html", controller: "blogController"}).
	otherwise({redirectTo: '/blogs'});
}]);