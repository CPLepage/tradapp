var mongoose = require('mongoose');

module.exports = mongoose.model('coins', {
    CMC_btc: {
        type: String
    },
    CMC_usd:{
        type: String
    },
    EMAcross:{
        type: Number
    },
    VolAvg1 : {
        type: Number
    },
    VolAvg3 : {
        type: Number
    },
    oneDay : {
        type: String
    },
    oneHour : {
        type: String
    },
    sevenDays : {
        type: String
    },
    order : {
        type: Number
    },
    price : {
        type: String
    },
    symbol : {
        type: String
    },
    title : {
        type: String
    },
    rank:{
        type: Number
    },
    time:{
        type: Date
    }
});