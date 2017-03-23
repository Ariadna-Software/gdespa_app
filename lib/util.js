// util.js
// some utilities for all modules
var moment = require('moment');

var utilAPI = {
    serverParseDate: function (d) {
        if (!d) return null;
        return moment(d).format('YYYY-MM-DD');
    },
    roundToTwo: function (num) {
        return +(Math.round(num + "e+2") + "e-2");
    }
}

module.exports = utilAPI;