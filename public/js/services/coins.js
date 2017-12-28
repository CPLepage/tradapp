angular.module('coinService', [])

    // super simple service
	// each function returns a promise object 
	.factory('Coins', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/coins/results');
			}
		}
	}]);