/*
 * chapter.js
 * handles user group related messages
*/
var express = require('express');
var router = express.Router();
var chapterDb = require('../lib/chapter'); // to access mysql db
var midCheck = require('./common').midChkApiKey;

router.get('/', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    chapterDb.get(function (err, groups) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(groups);
        }
    }, test);
});

router.post('/', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == 'true');
    var chapter = req.body;
    chapterDb.post(chapter, function (err, groups) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(groups);
        }
    }, test);
});

router.get('/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    chapterDb.getById(id, function (err, groups) {
        if (err) return res.status(500).send(err.message);
        if (groups.length == 0) return res.status(404).send('Store not found');
        res.json(groups);
    }, test);
});

router.get('/newline/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    chapterDb.getNewLineNumber(id, function (err, lines) {
        if (err) return res.status(500).send(err.message);
        res.json(lines);
    }, test);
});

router.get('/chaptersByPwId/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    chapterDb.getChaptersByPwId(id, function (err, lines) {
        if (err) return res.status(500).send(err.message);
        res.json(lines);
    }, test);
});

router.put('/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var chapter = req.body;
    chapterDb.put(chapter, function (err, group) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(group);
        }
    }, test);
});

router.delete('/:id', midCheck, function (req, res) {
    var test = req.query.test && (req.query.test == "true");
    var id = req.params.id;
    var chapter = req.body;
    if (!chapter.id) {
        return res.status(400).send('Store with id in body needed');
    }
    chapterDb.delete(chapter, function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(null);
        }
    }, test);
});

module.exports = router;