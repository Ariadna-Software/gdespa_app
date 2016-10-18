// util.js
// some utilities for all modules
var moment = require('moment');

var utilAPI = {
    serverParseDate: function(d){
        if (!d) return null;
        return moment(d).format('YYYY-MM-DD');
    }
}

module.exports = utilAPI;