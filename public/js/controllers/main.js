angular.module('coinController', [])

// inject the Todo service factory into our controller
.controller('mainController', ['$scope','$http','Coins', '$interval', function($scope, $http, Coins, $interval) {
    $scope.formData = {};
    // GET =====================================================================
    
    Coins.get()
        .success(function(data) {
            var last = new Date(data[0].time);
            var now = Date.now();
            if(now - last.getTime() >= 700000){
                $('#status > span').addClass('offline').text('Offline');
                $('#loading').css('backgroundColor', '#F65058');
            }else{
                $('#online').show();
                $scope.coins = data;
                $('#status > span').addClass('paused').text('Running...Next tick in 300s');
                var n = 300;
                var tick = $interval(function() {
                    n--;
                    $('#loading').css('width', n / 300 * 100 + '%');
                    $('#status > span').text('Running...Next tick in '+ n + 's');
                    if(n == 0){
                        $('#loading').css('width', 0);
                        $('#status > span').removeClass('paused').text('Updating...');
                        Coins.get()
                            .success(function(data) {
                                var last = new Date(data[0].time);
                                var now = Date.now();
                                console.log(now - last.getTime());
                                if(now - last.getTime() >= 700000){
                                    $('#online').hide();
                                    $('#status > span').addClass('offline').text('Offline');
                                    $('#loading').css('backgroundColor', '#F65058');
                                    $interval.cancel(tick);
                                }
                                else{
                                    $scope.coins = data;
                                    $('#status > span').addClass('paused').text('Running...Next tick in 300s');
                                }
                            });
                        n = 300;
                    }
                },1000);
            }
            
        });
    
    $scope.propertyName = 'order';
    $scope.reverse = false;
    
    var ema = 1;
    var vol = 0;
    $scope.sortBy = function(propertyName) {
        if(propertyName == 'EMA'){
            if(ema == 0){
                $scope.propertyName = 'EMAcross';
                $scope.reverse = 'false';
                $(".EMAsort").html('<i class="fa fa-sort-desc" aria-hidden="true"></i>');
                ema++;
            }
            else if(ema == 1){
                $scope.propertyName = 'order';
                $(".EMAsort").html('<i class="fa fa-crosshairs" aria-hidden="true"></i><i class="fa fa-sort-desc" aria-hidden="true"></i>');
                $scope.reverse = 'false';
                ema++;
            }
            else if(ema == 2){
                $scope.propertyName = 'order';
                $(".EMAsort").html('<i class="fa fa-crosshairs" aria-hidden="true"></i><i class="fa fa-sort-asc" aria-hidden="true"></i>');
                $scope.reverse = 'true';
                ema++;
            }
            else if(ema == 3){
                $scope.propertyName = 'EMAcross';
                $scope.reverse = 'true';
                $(".EMAsort").html('<i class="fa fa-sort-asc" aria-hidden="true"></i>');
                ema = 0;
            }
        }
        else if(propertyName == 'vol'){
            if(vol == 0){
                $scope.propertyName = 'VolAvg3';
                $scope.reverse = 'false';
                $(".VOLsort").html('3d.<i class="fa fa-sort-desc" aria-hidden="true"></i>');
                vol++;
            }
            else if(vol == 1){
                $scope.propertyName = 'VolAvg3';
                $scope.reverse = 'true';
                $(".VOLsort").html('3d.<i class="fa fa-sort-asc" aria-hidden="true"></i>');
                vol++;
            }
            else if(vol == 2){
                $scope.propertyName = 'VolAvg1';
                $scope.reverse = 'false';
                $(".VOLsort").html('1d.<i class="fa fa-sort-desc" aria-hidden="true"></i>');
                vol++;
            }
            else if(vol == 3){
                $scope.propertyName = 'VolAvg1';
                $scope.reverse = 'true';
                $(".VOLsort").html('1d.<i class="fa fa-sort-asc" aria-hidden="true"></i>');
                vol = 0;
            }
            
        }
        else{
            $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
        }
    };
    
    $scope.color = function(value){
        if (value < 0)
            return 'text-danger';
        else
            return 'text-success';
    }
        
}]);