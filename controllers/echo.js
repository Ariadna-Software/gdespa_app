/*
 * ECHO CONTROLLER
 * A simple controller that returns text parameters contents
*/
var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
    var txt = "Hi, this is a default echo";
    if (req.query.text) {
        txt = req.query.text;
    }
    res.json(txt);
});

module.exports = router;
