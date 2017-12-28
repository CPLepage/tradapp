angular.module('coinController', [])

// inject the Todo service factory into our controller
.controller('mainController', ['$scope','$http','Coins', '$interval', function($scope, $http, Coins, $interval) {
    $scope.formData = {};
    // GET =====================================================================
    
    Coins.get()
        .success(function(data) {
            $scope.coins = data;
            $('#status > span').addClass('paused').text('Running...Next tick in 300s');
        });
    
    var n = 300;
    $interval(function() {
        n--;
        $('#loading').css('width', n / 300 * 100 + '%');
        $('#status > span').text('Running...Next tick in '+ n + 's');
        if(n == 0){
            $('#loading').css('width', 0);
            $('#status > span').removeClass('paused').text('Updating...');
            Coins.get()
                .success(function(data) {
                    $scope.coins = data;
                    $('#status > span').addClass('paused').text('Running...Next tick in 300s');
                });
            n = 300;
        }
    },1000)
    
    $scope.color = function(value){
        if (value < 0)
            return 'text-danger';
        else
            return 'text-success';
    }
        
}]);