angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/',{
        controller : "homeController",
        templateUrl : "views/home.html"
    });
    $routeProvider.when('/about',{
        controller : "aboutController",
        templateUrl : "views/about.html"
    });
    $routeProvider.when('/map',{
        controller : "mapController",
        templateUrl : "views/map.html"
    });
    $routeProvider.otherwise({
        redirectTo : "/"
    });
    $locationProvider.html5Mode(true);

}]); 