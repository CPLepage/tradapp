angular.module('coinService', [])

    // super simple service
	// each function returns a promise object 
	.factory('Coins', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/coins');
			},
            tickers : function(symbol) {
                return $http.get('/api/coins/' + symbol);
            },
            tick : function(symbol) {
                return $http.get('/api/coins/latest/' + symbol);
            },
            coinmarketcap : function() {
				return $http.get('https://api.coinmarketcap.com/v1/ticker/?limit=0');
			},
            update : function(coin){
                var url = coin.title.replace('/',' ') + '/' + coin.CMC_btc + '/' + coin.CMC_usd + '/' + coin.EMAcross + '/' + coin.VolAvg1 + '/' + coin.VolAvg3 + '/' + coin.oneHour + '/' + coin.oneDay + '/' + coin.sevenDays + '/' + coin.order + '/' + coin.symbol + '/' + coin.price + '/' + coin.rank;
                return $http.put('/api/coins/' + url);
            }
		}
	}]);