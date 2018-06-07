
/* MODULE / MIDDLEWARE INSTALLED FOR INDEX */
var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

var url = 'mongodb://localhost:27017/myDatabase';

/* GET HOME PAGE */
router.get('/', ensureAuthenticated, function(req, res, next) {
  res.render('index');
});

/* GET REGISTER ASSETS PAGE */
router.get('/Reg-Asset', ensureAuthenticated, function(req, res, next) {
    res.render('regAsset');
});

/* GET REGISTER ASSETS PAGE */
router.get('/Edit-Asset', ensureAuthenticated, function(req, res, next) {
    res.render('editAsset');
});

/* GET REGISTER ASSETS PAGE */
router.get('/View-Asset', ensureAuthenticated, function(req, res, next) {
    res.render('index');
});
/* GET ASSET DATA FROM ASSETS COLLECTION */
router.get('/get-data', ensureAuthenticated, function(req, res, next) {
  var resultArray = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('Assets').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      db.close();
      res.render('viewAssets', {items: resultArray});
    });
  });
});

/* INSERT ASSET VALUES FROM 'index.hbs' INTO ASSET COLLECTION */
router.post('/insert', ensureAuthenticated, function(req, res, next) {
  var Asset = {
    AssetID: req.body.AssetID,
    SerialNo: req.body.SerialNo,
    Media: req.body.Media,
    CopyNo: req.body.CopyNo,
    Location: req.body.Location,
    Description: req.body.Description,
    RegisteredBy: req.body.RegisteredBy,
    RegisteredDate: req.body.RegisteredDate,
    ProtectiveMarking: req.body.ProtectiveMarking,
    Status: req.body.Status
  };

    /* MONGODB CONNECTION FOR INSERTING VALUES */
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

/* UPDATE ASSET VALUES FROM 'index.hbs' INTO ASSET COLLECTION */
router.post('/update', ensureAuthenticated, function(req, res, next) {
  var Asset = {
      AssetID: req.body.AssetID,
      SerialNo: req.body.SerialNo,
      Media: req.body.Media,
      CopyNo: req.body.CopyNo,
      Location: req.body.Location,
      Description: req.body.Description,
      RegisteredBy: req.body.RegisteredBy,
      RegisteredDate: req.body.RegisteredDate,
      ProtectiveMarking: req.body.ProtectiveMarking,
      Status: req.body.Status
  };
  var id = req.body.id;

    /* MONGODB CONNECTION FOR UPDATING VALUES */
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

/* DELETE ASSET VALUES FROM 'index.hbs' ON ASSET COLLECTION */
router.post('/delete', ensureAuthenticated, function(req, res, next) {
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

/* ENSURES THE USER IS LOGGED IN BEFORE THE CAN ACCESS INTERNAL APPLICATION PAGES */
/* THIS FUNCTION IS CALLED WITHIN ALL ROUTER.POSTS */
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');
    }
}

module.exports = router;
