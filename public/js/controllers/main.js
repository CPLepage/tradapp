angular.module('coinController', [])

// inject the Todo service factory into our controller
.controller('mainController', ['$scope','$http','Coins', '$interval', function($scope, $http, Coins, $interval) {
    $scope.formData = {};
    // GET =====================================================================
    // when landing on the page, get all todos and show them
    // use the service to get all the todos
    
    function CMC(coin, infos){
        var symbol = coin.substring(4);
        var title = symbol;
        var CMC_usd = 'Na';
        var CMC_btc = 'Na';
        for(var i = 0; i<infos.length;i++){
            if (symbol == 'BCC') symbol = 'BCH';
            if(infos[i].symbol == symbol) {
                title = infos[i].name;
                rank = infos[i].rank;
                symbol = infos[i].symbol;
                CMC_usd = infos[i].price_usd + '$ USD';
                CMC_btc = infos[i].price_btc + ' btc';
                oneHour = infos[i].percent_change_1h; 
                oneDay = infos[i].percent_change_24h; 
                sevenDays = infos[i].percent_change_7d
            }
        }
        coin = {title : title, symbol : symbol, CMC_usd : CMC_usd, CMC_btc: CMC_btc, oneHour : oneHour, oneDay : oneDay, sevenDays : sevenDays, rank : rank };
        return coin;       
    }
    
    
    /*Coins.get()
        .success(function(data) {
            Coins.coinmarketcap().success(function(infos){
                var coins = [];
                data.map(function(x,i){
                    //if(i < 4){
                        var coin = CMC(x, infos);
                        var symbol = x.substring(4);
                        Coins.tick(symbol).success(function(tick){
                            coin.price = tick.result.Last ;
                        });

                        Coins.tickers(symbol).success(function(tickers){
                            var period = 12;
                            var alpha = 2/(period+1);
                            var prevEMA = tickers[0].C;
                            var EMA = (tickers[1].C - prevEMA) * alpha + prevEMA;
                            for(var i = 2; i<tickers.length; i++){
                                prevEMA = EMA;
                                EMA = (tickers[i].C - prevEMA) * alpha + prevEMA;
                            }
                            var EMA12 = EMA;

                            var period = 72;
                            var alpha = 2/(period+1);
                            var prevEMA = tickers[0].C;
                            var EMA = (tickers[1].C - prevEMA) * alpha + prevEMA;
                            for(var i = 2; i<tickers.length; i++){
                                prevEMA = EMA;
                                EMA = (tickers[i].C - prevEMA) * alpha + prevEMA;
                            }
                            var EMA72 = EMA;

                            coin.EMAcross = EMA12 / EMA72 * 100;
                            coin.order = Math.abs(100 - coin.EMAcross);

                            var sum15 = 0;
                            for(var i = 1; i<=3; i++){
                                sum15 += tickers[tickers.length - i].V;
                            }
                            var avg15 = sum15/3;

                            var sum3d = 0;
                            for(var i = 1; i<=864; i++){
                                sum3d += tickers[tickers.length - i].V;
                            }
                            var avg3d = sum3d/864;

                            coin.VolAvg3 = avg15/avg3d;

                             var sum1d = 0;
                            for(var i = 1; i<=288; i++){
                                sum1d += tickers[tickers.length - i].V;
                            }
                            var avg1d = sum1d/288;

                            coin.VolAvg1 = avg15/avg1d;

                           // Coins.update(coin);
                        });

                        coins.push(coin);
                        $scope.coins = coins;
                    //}
                });
            });
        });*/
    
    
    
    Coins.get()
        .success(function(data) {
            var nbCoins = data.length;
            Coins.coinmarketcap().success(function(infos){
                var coins = [];
                var a = 0;
                function pushCoin(a, data, infos, coins){
                    $('#status > span').text('Initializing... ('+a+'/'+nbCoins+')');
                    $('#loading').css('width', a/nbCoins * 100 + '%');
                    if(a == nbCoins){
                        function ticking(){
                            var n = 300;
                            ticks = $interval(function(){
                                n--;
                                $('#status > span').addClass('paused').text('Next tick in ' + n +'s');
                                $('#loading').css('width', n/300 * 100 + '%');
                                if(n == 0){
                                    $('#status > span').removeClass('paused').text('Updating...(0/'+coins.length+')');
                                    $interval.cancel(ticks);
                                    a = 0;
                                    Coins.coinmarketcap().success(function(infos){
                                        function updateCoin(a, infos, coins){
                                            $('#status > span').removeClass('paused').text('Updating...('+ (a + 1) +'/'+coins.length+')');
                                            $('#loading').css('width', a/(coins.length-1) * 100 + '%');
                                            var x = "xxxx" + coins[a].symbol;
                                            var coin = CMC(x, infos);
                                            var symbol = coin.symbol;
                                            if(coin.symbol == "BCH")
                                                symbol = "BCC";
                                            Coins.tick(symbol).success(function(tick){
                                                coin.price = tick.result[0].C ;
                                                coins[a].data.splice(0, 1);
                                                coins[a].data.push(tick.result[0]);
                                                coin.data = coins[a].data;
                                                var tickers = coin.data;
                                                var period = 12;
                                                var alpha = 2/(period+1);
                                                var prevEMA = tickers[0].C;
                                                var EMA = (tickers[1].C - prevEMA) * alpha + prevEMA;
                                                for(var i = 2; i<tickers.length; i++){
                                                    prevEMA = EMA;
                                                    EMA = (tickers[i].C - prevEMA) * alpha + prevEMA;
                                                }
                                                var EMA12 = EMA;

                                                var period = 72;
                                                var alpha = 2/(period+1);
                                                var prevEMA = tickers[0].C;
                                                var EMA = (tickers[1].C - prevEMA) * alpha + prevEMA;
                                                for(var i = 2; i<tickers.length; i++){
                                                    prevEMA = EMA;
                                                    EMA = (tickers[i].C - prevEMA) * alpha + prevEMA;
                                                }
                                                var EMA72 = EMA;

                                                coin.EMAcross = EMA12 / EMA72 * 100;
                                                coin.order = Math.abs(100 - coin.EMAcross);

                                                var sum15 = 0;
                                                for(var i = 1; i<=3; i++){
                                                    sum15 += tickers[tickers.length - i].V;
                                                }
                                                var avg15 = sum15/3;

                                                var sum3d = 0;
                                                for(var i = 1; i<=864; i++){
                                                    sum3d += tickers[tickers.length - i].V;
                                                }
                                                var avg3d = sum3d/864;

                                                coin.VolAvg3 = avg15/avg3d;

                                                 var sum1d = 0;
                                                for(var i = 1; i<=288; i++){
                                                    sum1d += tickers[tickers.length - i].V;
                                                }
                                                var avg1d = sum1d/288;

                                                coin.VolAvg1 = avg15/avg1d;

                                                //Coins.update(coin).success(function(){
                                                    coins[a] = coin;
                                                    $scope.coins = coins;
                                                    if(a == coins.length-1){
                                                        ticking();
                                                        return;
                                                    }
                                                    else{
                                                        a++;
                                                        updateCoin(a, infos, coins);
                                                    }
                                               //});
                                            });

                                        }
                                        updateCoin(a, infos, coins);
                                    });
                                }
                            }, 1000);
                        }   
                        ticking();
                        return;
                    }
                    var x = data[a];
                    var coin = CMC(x, infos);
                    var symbol = x.substring(4);
                    Coins.tick(symbol).success(function(tick){
                        coin.price = tick.result[0].C ;
                    });

                    Coins.tickers(symbol).success(function(tickers){
                        coin.data = tickers;
                        if(tickers[0] == null){
                            a++;
                            pushCoin(a, data, infos, coins);
                        }
                        else{
                            var period = 12;
                            var alpha = 2/(period+1);
                            var prevEMA = tickers[0].C;
                            var EMA = (tickers[1].C - prevEMA) * alpha + prevEMA;
                            for(var i = 2; i<tickers.length; i++){
                                prevEMA = EMA;
                                EMA = (tickers[i].C - prevEMA) * alpha + prevEMA;
                            }
                            var EMA12 = EMA;

                            var period = 72;
                            var alpha = 2/(period+1);
                            var prevEMA = tickers[0].C;
                            var EMA = (tickers[1].C - prevEMA) * alpha + prevEMA;
                            for(var i = 2; i<tickers.length; i++){
                                prevEMA = EMA;
                                EMA = (tickers[i].C - prevEMA) * alpha + prevEMA;
                            }
                            var EMA72 = EMA;

                            coin.EMAcross = EMA12 / EMA72 * 100;
                            coin.order = Math.abs(100 - coin.EMAcross);

                            var sum15 = 0;
                            for(var i = 1; i<=3; i++){
                                sum15 += tickers[tickers.length - i].V;
                            }
                            var avg15 = sum15/3;

                            var sum3d = 0;
                            for(var i = 1; i<=864; i++){
                                sum3d += tickers[tickers.length - i].V;
                            }
                            var avg3d = sum3d/864;

                            coin.VolAvg3 = avg15/avg3d;

                             var sum1d = 0;
                            for(var i = 1; i<=288; i++){
                                sum1d += tickers[tickers.length - i].V;
                            }
                            var avg1d = sum1d/288;

                            coin.VolAvg1 = avg15/avg1d;

                           //Coins.update(coin).success(function(){
                                coins.push(coin);
                                $scope.coins = coins;
                                a++;
                                pushCoin(a, data, infos, coins);
                           //});
                        }

                    });
                    
                }
                pushCoin(a, data, infos, coins);
            });
        });
    
    $scope.color = function(value){
        if (value < 0)
            return 'text-danger';
        else
            return 'text-success';
    }
        
}]);