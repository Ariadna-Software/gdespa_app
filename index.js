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
var config = require('./config.json');


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

// -- registering routes
// registering routes
app.use('/api/echo', require('./controllers/echo'));
app.use('/api/user_group', require('./controllers/user_group'));
app.use('/api/user', require('./controllers/user'));
app.use('/api/login', require('./controllers/login'));

// general API to export

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