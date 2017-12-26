var Coin = require('./models/coins');
var apiBittrex = require("api-bittrex");


module.exports = function (app) {
    // api ---------------------------------------------------------------------
    // get all todos
    app.put('/api/coins/:coin/:CMC_btc/:CMC_usd/:EMAcross/:VolAvg1/:VolAvg3/:oneHour/:oneDay/:sevenDays/:order/:symbol/:price/:rank', function(req,res){
        Coin.update({ title : req.params.coin }, { 
            CMC_btc : req.params.CMC_btc,
            CMC_usd : req.params.CMC_usd,
            EMAcross : req.params.EMAcross,
            VolAvg1 : req.params.VolAvg1,
            VolAvg3 : req.params.VolAvg3,
            oneHour : req.params.oneHour,
            oneDay : req.params.oneDay,
            sevenDays : req.params.sevenDays,
            order : req.params.order,
            symbol : req.params.symbol,
            price : req.params.price,
            rank : req.params.rank
        }, { upsert : true },     
         function (err, coin) {
            if (err)
                res.send(err);
            
            res.send(coin);
            });
        
    });
    
    app.get('/api/coins', function (req, res) {
        /*
        // use mongoose to get all todos in the database
        Coin.find(function (err, coins) {
            
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err) {
                res.send(err);
            }

            res.json(coins);
        });
        */
        
        
        //use Bittrex to get available coins for trade
        apiBittrex.getmarketsummaries( function( data, err ) {
              if (err) {
                return console.error(err);
              }
                var bittrexCoins = [];
              for( var i in data.result ) {
            //for( var i = 0;i<12;i++) {
                  if(data.result[i].MarketName.match(/^BTC/)) bittrexCoins.push(data.result[i].MarketName);
              }
                res.send(bittrexCoins);
        });
        
        /*
        //use json file for coins
        var coins = JSON.parse(readFile('coins_title.json'));
        console.log(coins[0]);
        res.send(coins);
        */
            /*
            var titles = [];
            bittrexCoins.map(function(x){
                titles.push({symbol : x, title: ""});
            });
            writeFile('coins_title.json', JSON.stringify(titles));
            */
        
    });
    app.get('/api/coins/latest/:symbol', function(req, res){
        apiBittrex.sendCustomRequest( 'https://bittrex.com/Api/v2.0/pub/market/GetLatestTick?marketName=BTC-'+req.params.symbol+'&tickInterval=fiveMin', function( data, err ) {
          res.send(data);
        }, true );
        /* apiBittrex.getticker( { market : 'BTC-'+req.params.symbol }, function( data, err ) {
          res.send(data);
        });*/
    });
   app.get('/api/coins/:symbol', function (req, res) {
        /*
        // use mongoose to get all todos in the database
        Coin.find({symbol : req.params.symbol}, function (err, coins) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err) {
                res.send(err);
            }
            
            var url = 'https://bittrex.com/Api/v2.0/pub/market/GetTicks?marketName='+ coins[0].market +'&tickInterval=fiveMin';
            apiBittrex.sendCustomRequest( url, function( data, err ) {
                var infos = [];
                for(var i = 0;i<2015;i++){
                    infos.push(data.result[data.result.length - i]);
                }
                infos.reverse().pop();
                res.json(infos);
            }); 
            
            
        });
        */
       //bypass database
       apiBittrex.getcandles({
          marketName: 'BTC-'+req.params.symbol,
          tickInterval: 'fiveMin', // intervals are keywords
        }, function( data, err ) {
            var infos = [];
            for(var i = 0;i<2015;i++){
                infos.push(data.result[data.result.length - i]);
            }
            infos.reverse().pop();
            res.json(infos);
        });
    });
    
    
    
    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};

