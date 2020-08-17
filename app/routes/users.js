let express = require('express');
let router = express.Router();

let business_users = require('../business/business_users');

/* GET users listing. */
router.get('/', function (req, res) {
  res.render('user/userdetails', { title: 'Car Rental Login' });
});

router.get('/getuserdetails/:userid', function (req, res) {
  let userId = req.params.userid;
  if (userId) {
    business_users.getuserdetails(userId, function (err, data) {
      if (err) {
        res.send(err.message);
      } else {
        res.send({
          'username': data[0].username,
          'email': data[0].email,
          'phone': data[0].phone,
          'password': CryptoJS.enc.Base64.parse(data[0].password).toString(CryptoJS.enc.Utf8)
        });
      }
    });
  } else {
    res.redirect('/login');
  }
});

router.get('/getdriverinformation/:userid', function (req, res) {
  let userId = req.params.userid;
  if (userId) {
    business_users.getdriverinformation(userId, function (err, data) {
      if (err) {
        res.send(err.message);
      } else {
        let output = {
          'license_issued_on': data[0].country,
          'dl_number': data[0].license_number,
          'dl_expiry': data[0].expiry_date,
          'address': data[0].address,
          'first_name': data[0].firstname,
          'last_name': data[0].lastname,
          'date_of_birth': data[0].date_of_birth
        };
        res.send(output);
      }
    })
  } else {
    res.redirect('/login');
  }
});

router.get('/getpaymentdetails/:userid', function (req, res) {
  let userId = req.params.userid;
  if (userId) {
    business_users.getpaymentdetails(userId, function (err, data) {
      if (err) {
        res.send(err.message);
      } else {
        res.send({
          'membership_type': data[0].type,
          'membership_name': data[0].name,
          'card_number': data[0].card_number,
          'card_expiry': data[0].expiry_date,
          'cvv': data[0].cvv,
          'card_holder_name': data[0].card_holder_name,
          'membership_expiration_date': data[0].expiration_date
        });
      }
    });
  } else {
    res.redirect('/login');
  }
});


router.get('/getbookinghistory/:userid', function (req, res) {
  let userId = req.params.userid;
  if (userId) {
    business_users.getbookinghistory(userId, function (err, data) {
      if (err) {
        res.send(err.message);
      } else {
        let output = {
          "result": []
        };

        for (let i = 0; i < data.length; i++) {
          let v = {
            'booking_id': data[i].id,
            'booking_time': new Date(data[i].reservation_datetime).getHours() + ':' + new Date(data[i].reservation_datetime).getMinutes(),
            'booking_date': new Date(data[i].reservation_datetime).toDateString(),
            'pickup_place': data[i].location,
            'length_of_booking': data[i].length_of_stay,
            'price': data[i].price,
            'is_returned': data[i].is_returned,
            'vehicle_id': data[i].vehicle_id,
            'booking_hours': data[i].length_of_stay
          };

          output.result.push(v);
        }

        res.send(output);
      }
    });
  } else {
    res.redirect('/login');
  }
});

router.post('/saveuserdetails', function (req, res) {
  let details = {
    username: req['body']['username'],
    password: CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(req['body']['password'])),
    email: req['body']['email'],
    phoneNumber: req['body']['phoneNumber'],
    userId: req['body']['user_id']
  };

  business_users.saveuserdetails(details, function (err) {
    if (err) {
      res.send({ 'message': err.message });
    } else {
      res.send({ 'message': "user details updated successfully." });
    }
  });
});

router.post('/savedriverinformation', function (req, res) {
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

  business_users.savedriverinformation(details, function (err) {
    if (err) {
      res.send({ 'message': err.message });
    } else {
      res.send({ 'message': "driver information updated successfully." });
    }
  });
});

router.post('/savepaymentdetails', function (req, res) {
  let details = {
    membership_type: req['body']['membership_type'],
    card_number: req['body']['cardnumber'],
    card_expiry: req['body']['card_expiry'],
    cvv: req['body']['cvv'],
    car_holder_name: req['body']['car_holder_name'],
    userId: req['body']['userId'],
    old_membership_type: req['body']['old_membership_type']
  };

  business_users.savepaymentdetails(details, function (err) {
    if (err) {
      res.send({ 'message': err.message });
    } else {
      res.send({ 'message': "card details updated successfully." });
    }
  })
});

router.delete('/deleteBooking', function (req, res) {
  let reservation_id = req['body']['reservation_id'];
  business_users.deleteBooking(reservation_id, function (err) {
    if (err) {
      res.send({ 'message': err.message });
    } else {
      res.send({ 'message': "reservation deleted successfully." });
    }
  });
});

router.post('/notifyBookingComplete', function (req, res) {
  let details = {
    'vehicle_Id': req['body']['vehicle_id'],
    'reservation_Id': req['body']['reservation_id'],
    'booking_hours': req['body']['booking_hours']
  };

  business_users.notifyBookingComplete(details, function (err) {
    if (err) {
      res.send({ 'message': err.message });
    } else {
      res.send({ 'message': "reservation notification completed successfully." });
    }
  });
});

router.delete('/terminateMembership', function (req, res) {
  let userId = req['body']['user_id'];
  business_users.terminateMembership(userId, function (err) {
    if (err) {
      res.send({ 'message': err.message });
    } else {
      req.session.destroy();
      res.send({ 'message': "successful" });
    }
  });
});

router.post('/renewMembership', function (req, res) {
  let userId = req['body']['user_id'];
  business_users.renewMembership(userId, function (err) {
    if (err) {
      res.send({ 'message': err.message });
    } else {
      res.send({ 'message': "successful" });
    }
  });
});

module.exports = router;
