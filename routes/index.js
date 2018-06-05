var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

var url = 'mongodb://localhost:27017/myDatabase';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/get-data', function(req, res, next) {
  var resultArray = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('Assets').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      db.close();
      res.render('index', {items: resultArray});
    });
  });
});

router.post('/insert', function(req, res, next) {
  var Asset = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('Assets').insertOne(Asset, function(err, result) {
      assert.equal(null, err);
      console.log('Asset inserted');
      db.close();
    });
  });

  res.redirect('/get-data');
});

router.post('/update', function(req, res, next) {
  var Asset = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };
  var id = req.body.id;

    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection('Assets').updateOne({"_id": objectId(id)}, {$set: Asset}, function(err, result) {
            assert.equal(null, err);
            console.log('Asset updated');
            db.close();
        });
    });

    res.redirect('/');
});

router.post('/delete', function(req, res, next) {
  var id = req.body.id;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('Assets').deleteOne({"_id": objectId(id)}, function(err, result) {
      assert.equal(null, err);
      console.log('Item Deleted');
      db.close();
    });
  });

    res.redirect('/get-data');
});

module.exports = router;
