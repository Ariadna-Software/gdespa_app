//=======================================
// GDES PANAMA (index.js)
// API to communicate to GDES PANAMA
//========================================
// Author: Rafael Garcia (rafa@myariadna.com)
// 2015 [License CC-BY-NC-4.0]


// required modules
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var serveIndex = require('serve-index');
var moment = require('moment');


var pack = require('./package.json');
// read app parameters (host and port for the API)
var cfg = require('./config.json');


// starting express
var app = express();
// to parse body content
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// using cors for cross class
app.use(cors());

// servidor html estático
app.use(express.static(__dirname+"/public"));
app.use('/ficheros', serveIndex(__dirname + '/public/ficheros',{'icons': true, 'view': 'details'}));
app.use('/docs', serveIndex(__dirname + '/public/docs',{'icons': true, 'view': 'details'}));



// mounting routes
var router = express.Router();

// -- common to all routes
router.use(function(req, res, next) {
    // go on (by now)
    next();
});


// -- general GET (to know if the server is up and runnig)
router.get('/', function(req, res) {
    res.json('GDES PANAMA API / SERVER -- runnig');
});

app.use('/utility', require('./controllers/utility'));
// -- registering routes
// registering routes
app.use('/api/echo', require('./controllers/echo'));
app.use('/api/user_group', require('./controllers/user_group'));
app.use('/api/user', require('./controllers/user'));
app.use('/api/login', require('./controllers/login'));
app.use('/api/worker', require('./controllers/worker'));
app.use('/api/company', require('./controllers/company'));
app.use('/api/store', require('./controllers/store'));
app.use('/api/unit', require('./controllers/unit'));
app.use('/api/item', require('./controllers/item'));
app.use('/api/cunit', require('./controllers/cunit'));
app.use('/api/cunit_line', require('./controllers/cunit_line'));
app.use('/api/status', require('./controllers/status'));
app.use('/api/pw', require('./controllers/pw'));
app.use('/api/pw_line', require('./controllers/pw_line'));
app.use('/api/wo', require('./controllers/wo'));
app.use('/api/wo_line', require('./controllers/wo_line'));
app.use('/api/item_stock', require('./controllers/item_stock'));
app.use('/api/item_in', require('./controllers/item_in'));
app.use('/api/item_in_line', require('./controllers/item_in_line'));
app.use('/api/item_out', require('./controllers/item_out'));
app.use('/api/item_out_line', require('./controllers/item_out_line'));
app.use('/api/closure', require('./controllers/closure'));
app.use('/api/closure_line', require('./controllers/closure_line'));
app.use('/api/pw_worker', require('./controllers/pw_worker'));
app.use('/api/wo_worker', require('./controllers/wo_worker'));
app.use('/api/zone', require('./controllers/zone'));
app.use('/api/delivery', require('./controllers/delivery'));
app.use('/api/delivery_line', require('./controllers/delivery_line'));
app.use('/api/report', require('./controllers/report'));
app.use('/api/inventory', require('./controllers/inventory'));
app.use('/api/inventory_line', require('./controllers/inventory_line'));
app.use('/api/chapter', require('./controllers/chapter'));
app.use('/api/resourceType', require('./controllers/resourceType'));
app.use('/api/streport', require('./report-controller/reportdb'));
app.use('/api/team', require('./controllers/team'));
app.use('/api/team_line', require('./controllers/team_line'));
app.use('/api/mea', require('./controllers/mea'));
app.use('/api/mo', require('./controllers/mo'));
app.use('/api/mo_line', require('./controllers/mo_line'));
app.use('/api/mo_worker', require('./controllers/mo_worker'));
app.use('/api/day_type', require('./controllers/day_type'));
app.use('/api/mea_type', require('./controllers/mea_type'));
app.use('/api/parameters', require('./controllers/parameters'));
app.use('/api/work_type', require('./controllers/work_type'));
app.use('/api/ins_type', require('./controllers/ins_type'));
app.use('/api/area_type', require('./controllers/area_type'));
app.use('/api/doc', require('./controllers/doc'));
app.use('/api/upload', require('./controllers/upload'));
app.use('/api/invoice', require('./controllers/invoice'));
app.use('/api/doc_type', require('./controllers/doc_type'));
app.use('/api/pl', require('./controllers/pl'));
app.use('/api/pl_line', require('./controllers/pl_line'));
app.use('/api/holiday', require('./controllers/holiday'));
app.use('/api/abs_type', require('./controllers/abs_type'));
app.use('/api/abs', require('./controllers/abs'));

// general API to export

app.use('/pwbi1', require('./controllers/pwbi1'));

var appAPI = {
    app: app,
    init: function (config) {
        // we use default o passed config
        if (config) {
            cfg = config;
        }
        // start listeninig
        app.listen(cfg.apiPort);
        // -- console message
        console.log("-------------------------------------------");
        console.log(" GDES PANAMA ", moment(new Date()).format('DD/MM/YYYYY HH:mm:ss'));
        console.log("-------------------------------------------");
        console.log(' VERSION: ' + pack.version);
        console.log(' PORT: ' + cfg.apiPort);
        console.log("-------------------------------------------");
    }
}

if (process.env.NODE_ENV != "TEST"){
    appAPI.init();
}


module.exports = appAPI;
