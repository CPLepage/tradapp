var Coin = require('./models/coins');


module.exports = function (app) {
    // api --------------------------------------------------------------------
    app.get('/api/coins/results', function (req, res) {
       Coin.find({}, function (err, coins) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err) {
                res.send(err);
            }

            res.json(coins);// return all todos in JSON format
        });
    });
    
    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};

