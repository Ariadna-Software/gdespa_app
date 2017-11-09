var mysql = require('mysql'),
    dbCon = require('./db_connection');

// -------------------- MAIN API
var statusAPI = {
    get: function (done, test) {
        dbCon.getConnection(function (err, res) {
            if (err) return done(err);
            var con = res; // mysql connection
            var sql = "SELECT * FROM `status`";
            con.query(sql, function (err, res) {
                dbCon.closeConnection(con);
                var status = [];
                for (var i=0; i < res.length; i++){
                    status.push({
                        id: res[i].statusId,
                        name: res[i].name
                    });
                }
                if (err) return done(err);
                done(null, status);
            });
        }, test);
    }
}

module.exports = statusAPI;