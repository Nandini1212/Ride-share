let express = require('express');
let router = express.Router();

let admin = require('../business/business_admin');

/* GET admin dashboard. */
router.get('/', function(req, res, next) {
    admin.getUserIdForMembershipTermination(function (err, result) {
        if (err) {
            res.end();
        }
        admin.getUserIdForDeletion(function (err, values) {
            if (err) {
                callback(err);
            }
            res.render('admin/admin', {title: 'ADMIN DASHBOARD', userRows: result, userIds: values});
        });
    });
});

/* GET users listing. */
router.get('/dashboard', function(req, res) {
    admin.getUserIdForMembershipTermination(function (err, result) {
        if (err) {
            res.end();
        }
        admin.getUserIdForDeletion(function (err, values) {
            if (err) {
                callback(err);
            }
            res.render('admin/admin', {title: 'ADMIN DASHBOARD', userRows: result, userIds: values});
        });
    });
});

router.get('/signup', function(req, res) {
    res.render('admin/admin_signup', { title: 'Car Rental' });
});

router.post('/signup', function(req, res) {
    let details = {
        firstname: req['body']['firstName'],
        lastname: req['body']['lastName'],
        email: req['body']['email'],
        username: req['body']['username'],
        password: CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(req['body']['password'])),
        phoneNumber: req['body']['phoneNumber'],
        dob: req['body']['dob']
    };

    admin.addAdminUser(details, function (err, result) {
        if (err) {
            res.send({ 'message': err.message, 'userId': null });
        } else {
            res.send({ 'message': "successful", 'userId': result[0].id });
        }
    });
});

/* get manage rental page */
router.get('/managerental', function(req,res,next) {
    admin.getRentalLocationNotInVehicle(function (err, result) {
        if (err) {
            res.end()
        }
        admin.getRentalLocationIdNotinVehicleReserved(function (err, data) {
            if(err){
                res.end();
            }
            res.render('admin/adminrental', {title: 'ADMIN DASHBOARD', rows: result, rentalVals: data});
        });
    });
});

/*get manage pricing page */
router.get('/managepricing', function(req,res,next){
    admin.getMembership(function(err,data){
        if (err){
            res.end();
        }
        console.log(data);
        admin.getVehicleTypeIdNotInPrice(function(err,result){
            if (err) {
                res.end();
            }
            admin.getVehicleTypeIdInPrice(function(err,vehValues){
                if (err) {
                    res.end();
                }
                res.render('admin/adminpricing', { title: 'ADMIN DASHBOARD', rows: result, output:data, vehTypes: vehValues});
            });
        });
    });
});

/*get manage vehicles page */
router.get('/managevehicles', function(req,res,next) {
    let output=
    admin.getVehicleTypeId(function(err,data) {
        if (err) {
            res.end();
        }

        admin.getRentalLocations(function (err, result) {
            if (err) {
                res.end();
            }
            admin.getVehicleId(function(err,vehicleIds){
                if(err){
                    res.end();
                }
                admin.getRentalLocationId(function(err,rentalLocationIds) {
                    if (err) {
                        res.end();
                    }

                    res.render('admin/adminvehicle', {title: 'ADMIN DASHBOARD', rows: result, output: data, vehicleValues: vehicleIds, rentalValues: rentalLocationIds});
                });
            });
        });
    });
});

/*add new rental location */
router.post('/addNewRental', function (req, res,next) {
    console.log("inside add");
    let details = {
        rentalname: req['body']['rentalname'],
        rentaladdress: req['body']['rentaladdress'],
        rentalcapacity: req['body']['rentalcapacity'],

    };

    admin.addRentalLocation(details, function (err, result) {
        if (err) {
            res.send({ 'message': err.message});
        } else {
            //req.session.loggedInUserId = result[0].id;
            res.send({ 'message': "New rental location added" });
        }
    });
});

/* add new vehicle type*/
router.post('/addNewVehicleType', function (req, res,next) {
    console.log("inside add");
    let details = {
        vehicleType: req['body']['vehicleType'],

    };

    admin.addVehicleType(details, function (err, result) {
        if (err) {
            res.send({ 'message': err.message});
        } else {
            //req.session.loggedInUserId = result[0].id;
            res.send({ 'message': "New Vehicle Type Added" });
        }
    });
});

router.get('/getCurPrice',function(req,res,next){
   let details = {
       vehTypeId: req['query']['vehTypeId'],
       range: req['query']['range']
   } ;
   admin.getCurPrice(details, function (err,result){
       if(err){
           res.end();
       }
       else{
           res.send({'price': result[0].price})
       }
   });
});

router.post('/terminateMembership', function (req, res,next) {

    let details = {
        userid: req['body']['userid'],

    };

    admin.terminateMembership(details, function (err, result) {
        if (err) {
            res.send({ 'message': err.message});
        } else {
            //req.session.loggedInUserId = result[0].id;
            res.send({ 'message': "User Membership terminated" });
        }
    });
});

router.post('/deleteuser', function (req, res,next) {

    let details = {
        useridfordel: req['body']['useridfordel'],

    };

    admin.deleteuser(details, function (err, result) {
        if (err) {
            res.send({ 'message': err.message});
        } else {
            //req.session.loggedInUserId = result[0].id;
            res.send({ 'message': "User Deleted" });
        }
    });
});

router.post('/deleteVehicle', function (req, res,next) {

    let details = {
        vehId: req['body']['vehId'],

    };

    admin.deleteVehicle(details, function (err, result) {
        if (err) {
            res.send({ 'message': err.message});
        } else {
            //req.session.loggedInUserId = result[0].id;
            res.send({ 'message': "Vehicle Deleted" });
        }
    });
});

router.post('/deleteRental', function (req, res,next) {

    let details = {
        rentalLocId: req['body']['rentalLocId'],

    };

    admin.deleteRental(details, function (err, result) {
        if (err) {
            res.send({ 'message': err.message});
        } else {
            //req.session.loggedInUserId = result[0].id;
            res.send({ 'message': "Location Deleted" });
        }
    });
});

router.post('/reassignVehicle', function (req, res,next) {

    let details = {
        vehicleId: req['body']['vehicleId'],
        rentalLocationId: req['body']['rentalLocationId']

    };

    admin.reassignVehicle(details, function (err, result) {
        if (err) {
            res.send({ 'message': err.message});
        } else {
            //req.session.loggedInUserId = result[0].id;
            res.send({ 'message': "Vehicle Location Reaasigned" });
        }
    });
});

/*addNewVehiclePrice*/
router.post('/addNewVehiclePrice', function (req, res,next) {
    console.log("inside add");
    let details = {
       priceType: req['body']['priceType'],
        vehicleTypeId: req['body']['vehicleTypeId'],
        vehiclePrice: req['body']['vehiclePrice']

    };

    admin.addVehiclePrice(details, function (err, result) {
        if (err) {
            res.send({ 'message': err.message});
        } else {
            //req.session.loggedInUserId = result[0].id;
            res.send({ 'message': "New Vehicle Pricing Added" });
        }
    });
});

/*update Membership Price*/
router.post('/updateMemPrice', function (req, res,next) {
    console.log("inside add");
    let details = {

        memPrice: req['body']['memPrice'],
        membershipName: req['body']['membershipName']


    };

    admin.updateMemPrice(details, function (err, result) {
        if (err) {
            res.send({ 'message': err.message});
        } else {
            //req.session.loggedInUserId = result[0].id;
            res.send({ 'message': "Membership price updated" });
        }
    });
});

router.post('/updateVehPrice', function (req, res,next) {
    console.log("inside add");
    let details = {
        vehTypeId: req['body']['vehTypeId'],
        vPrice: req['body']['vPrice'],
        range: req['body']['range']
    };

    admin.updateVehPrice(details, function (err, result) {
        if (err) {
            res.send({ 'message': err.message});
        } else {
            //req.session.loggedInUserId = result[0].id;
            res.send({ 'message': "Vehicle price updated" });
        }
    });
});

router.post('/updateVehMile', function (req, res,next) {
    let details = {
        upVehicleId: req['body']['upVehicleId'],
        vMile: req['body']['vMile']
    };

    admin.updateVehMile(details, function (err, result) {
        if (err) {
            res.send({ 'message': err.message});
        } else {
            //req.session.loggedInUserId = result[0].id;
            res.send({ 'message': "Vehicle mileage updated" });
        }
    });
});

router.post('/updateVehRegNum', function (req, res,next) {
    let details = {
        upVehicleId: req['body']['upVehicleId'],
        vRegNum: req['body']['vRegNum']
    };

    admin.updateVehRegNum(details, function (err, result) {
        if (err) {
            res.send({ 'message': err.message});
        } else {
            //req.session.loggedInUserId = result[0].id;
            res.send({ 'message': "Vehicle registration updated" });
        }
    });
});

router.post('/updateRenName', function (req, res,next) {
    let details = {
        upRentalId: req['body']['upRentalId'],
        vName: req['body']['vName']
    };

    admin.updateRenName(details, function (err, result) {
        if (err) {
            res.send({ 'message': err.message});
        } else {
            //req.session.loggedInUserId = result[0].id;
            res.send({ 'message': "Location name updated" });
        }
    });
});

router.post('/updateRenAddr', function (req, res,next) {
    let details = {
        upRentalId: req['body']['upRentalId'],
        vAddr: req['body']['vAddr']
    };

    admin.updateRenAddr(details, function (err, result) {
        if (err) {
            res.send({ 'message': err.message});
        } else {
            //req.session.loggedInUserId = result[0].id;
            res.send({ 'message': "Location address updated" });
        }
    });
});

router.post('/updateRenCap', function (req, res,next) {
    let details = {
        upRentalId: req['body']['upRentalId'],
        vCap: req['body']['vCap']
    };

    admin.updateRenCap(details, function (err, result) {
        if (err) {
            res.send({ 'message': err.message});
        } else {
            //req.session.loggedInUserId = result[0].id;
            res.send({ 'message': "Location capacity updated" });
        }
    });
});

router.post('/updateVehServ', function (req, res,next) {
    let details = {
        upVehicleId: req['body']['upVehicleId'],
        vServ: req['body']['vServ']
    };

    admin.updateVehServ(details, function (err, result) {
        if (err) {
            res.send({ 'message': err.message});
        } else {
            //req.session.loggedInUserId = result[0].id;
            res.send({ 'message': "Vehicle service updated" });
        }
    });
});



router.post('/updateVehFee', function (req, res,next) {
    console.log("inside add");
    let details = {


        vehTypeId: req['body']['vehTypeId'],
        vFee: req['body']['vFee']


    };

    admin.updateVehFee(details, function (err, result) {
        if (err) {
            res.send({ 'message': err.message});
        } else {
            //req.session.loggedInUserId = result[0].id;
            res.send({ 'message': "Vehicle late return fee updated" });
        }
    });
});

router.post('/addNewVehicle', function (req, res,next) {
    console.log("inside add");
    let details = {
        autoTypeId: req['body']['autoTypeId'],
        autoName: req['body']['autoName'],
        autoMake: req['body']['autoMake'],
        autoModel: req['body']['autoModel'],
        autoYear: req['body']['autoYear'],
        regNum: req['body']['regNum'],
        renLoc: req['body']['renLoc'],
        mileage: req['body']['mileage'],
        lastService: req['body']['lastService'],

    };

    admin.addVehicle(details, function (err, result) {
        if (err) {
            res.send({ 'message': err.message});
        } else {
            //req.session.loggedInUserId = result[0].id;
            res.send({ 'message': "New Vehicle added" });
        }
    });
});

/* GET vehicle type listing. */

module.exports = router;