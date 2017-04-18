var express = require('express');
var router = express.Router();
var Location = require('./../model/Location.js')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/locations', function (req, res, next) {
  if (req.success)
    Location.find({}).exec(function (err, location) {
      if (err) throw err;
      res.render('locations', { location: location, success: true });
    });
  else
    Location.find({}).exec(function (err, location) {
      if (err) throw err;
      res.render('locations', { location: location, success: false });
    });
});

router.get('/location/new', function (req, res, next) {
  res.render('newLocation', { csrfToken: req.csrfToken(), success: false });
});

router.post('/location/new', function (req, res, next) {
  var location = new Location({
    name: req.body.name,
    category: req.body.category,
    address: {
      latitude: parseFloat(req.body.latitude),
      longitude: parseFloat(req.body.longitude),
    }
  });
  req.assert('name', 'Name is required').notEmpty();
  req.assert('category', 'Category is required').notEmpty();
  req.assert('latitude', 'Latitude is required').notEmpty();
  req.assert('longitude', 'Longitude is required').notEmpty();
  const errors = req.validationErrors();

  if (errors) {
    res.render('newLocation', { success: false, location: location });
  } else {
    location.save(function (err) {
      if (err) throw err;
      res.success = true;
      res.redirect('/locations');
    });
  }
});


router.post('/location/search', function (req, res, next) {
  Location.find({ $or: [{ name: req.body.name }, { category: req.body.category }, { 'address.longitude': req.body.longitude }, { 'address.latitude': req.body.latitude }] }).limit(3).exec(function (err, location) {
    if (err) throw err;
    res.render('locations', { location: location, success: false });
  });
});

router.get('/location/edit/:locationId', function (req, res, next) {
  Location.findById(req.params.locationId, function (err, location) {
    if (err) throw err;
    res.render('editLocation', { location: location });
  });
});

router.post('/location/edit/', function (req, res, next) {
  var location = new Location({
    name: req.body.name,
    category: req.body.category,
    address: {
      latitude: parseFloat(req.body.latitude),
      longitude: parseFloat(req.body.longitude),
    }
  });
  req.assert('name', 'Name is required').notEmpty();
  req.assert('category', 'Category is required').notEmpty();
  req.assert('latitude', 'Latitude is required').notEmpty();
  req.assert('longitude', 'Longitude is required').notEmpty();
  const errors = req.validationErrors();

  if (errors) {
    res.render('newLocation', { success: false, location: location });
  } else {
    location.save(function (err) {
      if (err) throw err;
      res.success = true;
      res.redirect('/locations');
    });
  }
});

router.get('/location/delete/:locationId', function (req, res, next) {
  Location.findByIdAndRemove(req.params.locationId, function (err) {
    if (err) throw err;
    console.log('User successfully deleted!');
    res.success = true;
    res.redirect('/locations');
  });
});

module.exports = router;
