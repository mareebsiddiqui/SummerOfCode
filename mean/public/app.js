'use strict';

angular.module('blogApp', [
    'blogApp.controllers',
    'blogApp.services',
    'ngRoute'
]);

// .config(['$routeProvider', function($routeProvider) {
//   $routeProvider.
// 	when("/drivers", {templateUrl: "partials/list.html", controller: "driversController"}).
// 	when("/drivers/:id", {templateUrl: "partials/item.html", controller: "driverController"}).
// 	otherwise({redirectTo: '/drivers'});
// }]);