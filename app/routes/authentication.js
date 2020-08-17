let express = require('express');
let router = express.Router();

let business_authentication = require('../business/business_authentication');

/* GET home page. */
router.get('/main', function (req, res) {
    res.render('index', { title: 'Car Rental Application' });
});

/* GET home page. */
router.get('/', function (req, res) {
    res.render('signin/login', { title: 'Car Rental Login' });
});

/* GET login page. */
router.get('/login', function (req, res) {
    res.render('signin/login', { title: 'Car Rental Login' });
});

router.post('/', function (req, res) {
    let details = {
        username: req['body']['username'],
        password: CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(req['body']['password'])),
    };

    let output = {
        userId: -1,
        isAdmin: -1
    };

    business_authentication.checkLoginCredentials(details, function (err, result) {
        if (err) {
            res.send({ 'message': err.message, 'data': null });
        } else {
            if (result === false) {
                res.send(err.message);
            } else {
                req.session.userId = result[0].id;
                req.session.isAdmin = result[0].is_admin;
                output.userId = result[0].id;
                output.isAdmin = result[0].is_admin;
                res.send({ 'message': "successful", 'data': output });
            }
        }
    });
});

/* GET signup page. */
router.get('/signup', function (req, res) {
    res.render('signup/create_account', { title: 'Car Rental Login' });
});

router.post('/signupUser', function (req, res) {
    let details = {
        username: req['body']['username'],
        password: CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(req['body']['password'])),
        email: req['body']['email'],
        phoneNumber: req['body']['phoneNumber']
    };

    business_authentication.addSignUpDetails(details, function (err, result) {
        if (err) {
            res.send({ 'message': err.message, 'userId': null });
        } else {
            //req.session.loggedInUserId = result[0].id;
            res.send({ 'message': "successful", 'userId': result[0].id });
        }
    });
});

/* GET driver info page. */
router.get('/driverinfo', function (req, res) {
    res.render('signup/driver_info', { title: 'Car Rental Login' });
});

router.post('/driverinformation', function (req, res) {
    let details = {
        country: req['body']['country'],
        dl_number: req['body']['dl_number'],
        dl_expiry: req['body']['dl_expiry'],
        address: req['body']['address'],
        firstname: req['body']['firstname'],
        lastname: req['body']['lastname'],
        dob: req['body']['dob'],
        userId: req['body']['userId']
    };
    business_authentication.addDriverInformation(details, function (err) {
        if (err) {
            res.send(err.message);
        } else {
            res.send({ 'message': "successful" });
        }
    });
});

/* GET payment. */
router.get('/payment', function (req, res) {
    res.render('signup/payment', { title: 'Car Rental Login' });
});

router.post('/paymentInformation', function (req, res) {
    let details = {
        membership_type: req['body']['membership_type'],
        card_number: req['body']['cardnumber'],
        card_expiry: req['body']['card_expiry'],
        cvv: req['body']['cvv'],
        car_holder_name: req['body']['car_holder_name'],
        userId: req['body']['userId']
    };
    business_authentication.addPaymentInformation(details, function (err) {
        if (err) {
            res.send(err.message);
        } else {
            res.send({ 'message': "successful" });
        }
    });
});

/* POST logout page. */
router.post('/logout', function (req, res, next) {
    req.session.destroy();
    res.send({ 'message': "successful" });
});

module.exports = router;