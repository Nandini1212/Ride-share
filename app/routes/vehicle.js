var express = require('express');
var mysql = require('../database/mysql');
var router = express.Router();

/* GET vehicle type listing. */
router.get('/getVehicleType', function(req, res) {
    let query = "select * from vehicle_type;";
    mysql.executeQuery(query, function (err, result) {
        if (err){
            res.send(JSON.stringify({ error: err.message, result: null }));
        }

        res.send(JSON.stringify({ error: null, result: result }));
    });
});

module.exports = router;
