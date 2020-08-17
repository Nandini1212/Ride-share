var express = require('express');
var router = express.Router();

var booking = require("../business/business_booking");

/* booking apis */
router.get('/', function (req, res) {
    console.log("inside booking api");
    booking.getVehicles(function (err, result) {
        if (err) {
            console.log("error: ", err);
            res.end();
        }
        res.render('vehicle', { vehicles: result });
    });
});

router.get('/locations', function (req, res) {
    console.log("inside rental locations api");
    booking.getLocations(function (err, result) {
        if (err) {
            console.log("error: ", err);
            res.end();
        }
        res.render('rentalLocation', { locations: result, vehicles: [] });
    });
});

router.get('/locations/getVehicles', function (req, res) {
    console.log("inside rental locations get vehicles api");
    let data = {
        id: req.query.id
    };
    booking.getVehiclesOfLocation(data, function (err, result) {
        if (err) {
            console.log("error: ", err);
            res.end();
        }
        res.send(result);
    })
});

router.post('/bookVehicle', function (req, res) {
    console.log("inside bookiVehicle api", req.body.id);
    let data = {
        id: req.body.id,
        date: req.body.datetime,
        stay: req.body.stay,
        user_id: req.body.user_id
    }
    booking.bookVehicle(data, function (err, result) {
        if (err) {
            console.log("error: ", err);
            // res.end();
        }
        console.log("result: ", result);
        res.end(result);
    })


});
module.exports = router;
