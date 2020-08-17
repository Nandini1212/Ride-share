let express = require('express');
let router = express.Router();

let business_feedback = require('../business/business_feedback');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('feedback/feedback', { title: 'Car Rental Application' });
});

router.get('/getBookingForFeedback/:userid', function(req, res) {
    let userId = req.params.userid;
    if (userId){
        business_feedback.getBookingForFeedback(userId, function (err, data) {
            if (err){
                res.send(err.message);
            }else {
                let output = {
                    "result": []
                };

                for (let i=0; i<data.length; i++){
                    let v = {
                        'booking_id': data[i].id,
                        'reservation_details': data[i].reservation_details,
                    };

                    output.result.push(v);
                }

                res.send(output);
            }
        });
    }else {
        res.redirect('/login');
    }
});

router.post('/saveFeedback', function (req, res) {
    let details = {
        car_condition: req['body']['car_condition'],
        comments: req['body']['comments'],
        reservation_id: req['body']['reservation_id'],
        experience: req['body']['experience'],
        userid: req['body']['userid']
    };

    business_feedback.saveFeedback(details, function (err) {
        if (err){
            res.send({'message': err.message});
        }else {
            res.send({'message': "successful"});
        }
    });
});

module.exports = router;