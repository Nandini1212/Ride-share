let mysql = require('../database/mysql');

function addAdminUser(details, callback) {
    let query1 = "INSERT INTO users(firstname, lastname, email, username, password, phone, date_of_birth, is_admin) VALUES('" + details.firstname + "', '" + details.lastname + "', '" + details.email + "', '" + details.username + "', '" + details.password + "', '" + details.phoneNumber  + "', '" + details.dob + "', 1);";
    console.log(query1);
    mysql.executeQuery(query1, function (err) {
        if (err){
            callback(err);
        }else {
            let query2 = "SELECT id from users WHERE email like '%" + details.email + "%' AND username like '%" + details.username + "%'";
            console.log(query2);
            mysql.executeQuery(query2, function (err, result) {
                if (err){
                    callback(err, null);
                }else {
                    callback(null, result);
                }
            });
        }
    });
}

function addRentalLocation(details, callback){
    let query1 = "INSERT INTO rental_location(name, address, rental_vehicle_capacity) VALUES('" + details.rentalname + "', '" + details.rentaladdress + "', '" + details.rentalcapacity + "')";
    console.log(query1);
    mysql.executeQuery(query1, function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null)
        }
    });
}
function addVehicleType(details, callback){
    let query1 = "INSERT INTO vehicle_type(name) VALUES('" + details.vehicleType + "')";
    console.log(query1);
    mysql.executeQuery(query1, function (err,result) {
        if (err) {
            callback(err);
        } else {
            let query2 = "SELECT * from vehicle_type where name = '"+details.vehicleType +"'";
            console.log(query2);
            mysql.executeQuery(query2, function(err,result){
                if(err){
                    callback(err);
                }
                else{
                     let vehicleTypeId = result[0].id;
                     console.log(vehicleTypeId);
                     let query3 = "INSERT into price(price_type,price,vehicle_type_id, late_fee, min_range, max_range) VALUES('USD',20,'"+vehicleTypeId+"',10,0,24),('USD',15,'"+vehicleTypeId+"',10,25,49),('USD',10,'"+vehicleTypeId+"',10,49,72)";
                     console.log(query3)
                     mysql.executeQuery(query3, function(err,result){
                         if(err){
                             callback(err);
                         }
                         else{
                             callback(null);
                         }
                     });
                }
            });

        }
    });
}
function addVehiclePrice(details, callback){
    let query1 = "INSERT INTO price(price_type,price,vehicle_type_id) VALUES('" + details.priceType + "', '" + details.vehiclePrice + "', '" + details.vehicleTypeId + "')";
    console.log(query1);
    mysql.executeQuery(query1, function (err,result) {
        if (err) {
            callback(err);
        } else {
            callback(null)
        }
    });
}

function  getCurrentCapacityForVehicle(details){
    let query1 = "SELECT rental_location_id from vehicle where id = '"+details.vehicleId +"'";
    let query2 =  "SELECT rental_vehicle_capacity as capacity, id as id from rental_location where id =("+query1+")";
    let res = {};
    mysql.executeQuery(query2, function (err, result) {
       if(err){
           console.log(err);
       }
       let currentRentalId = result[0].id;
       let currentCapacity = result[0].capacity;
       console.log(currentRentalId);
       console.log(currentCapacity);
       res = {currentRentalId:currentRentalId,currentCapacity:currentCapacity};
       console.log(res);

});
    return res;
}
function  getNewCapacityForVehicle(details){

    let newCapacity;
    let query2 =  "SELECT rental_vehicle_capacity as capacity from rental_location where id ='"+details.rentalLocationId +"'";
    mysql.executeQuery(query2, function (err, result) {
        if(err){
            console.log(err);
        }
        newCapacity = result[0].capacity;

    });
    return newCapacity;
}
function reassignVehicle(details, callback) {
    let query4 = "UPDATE vehicle set rental_location_id = '" + details.rentalLocationId + "' where id = '" + details.vehicleId + "'";
    mysql.executeQuery(query4, function (err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
}



function addVehicle(details, callback) {

                let query1 = "INSERT INTO vehicle(name,vehicle_type_id,make,model,year,registration,mileage,last_time_of_service,rental_location_id) VALUES('" + details.autoName + "', '" + details.autoTypeId + "', '" + details.autoMake + "', '" + details.autoModel + "', '" + details.autoYear + "','" + details.regNum + "','" + details.mileage + "','" + details.lastService + "','" + details.renLoc + "')";
                console.log(query1);
                mysql.executeQuery(query1, function (err, result) {
                    if (err) {
                        callback(err);
                    } else {

                                console.log(query1);
                                callback(null);
                            }
                        });
}


function getVehicleTypeId(callback){
    let query1 = "SELECT * from vehicle_type";
    mysql.executeQuery(query1,function(err,result){
        if (err) {
            callback(err);
        } else {
            callback(null,result)
        }
    });
}
function getVehicleTypeIdInPrice(callback){
    let query1 = "SELECT * from vehicle_type where id IN(SELECT DISTINCT(vehicle_type_id) from price)";
    mysql.executeQuery(query1,function(err,result){
        if (err) {
            callback(err);
        } else {
            callback(null,result)
        }
    });
}
function getRentalLocations(callback){
    let query1 = "SELECT id,name from rental_location";
    mysql.executeQuery(query1,function(err,result){
        if (err) {
            callback(err);
        } else {
            callback(null,result)
        }
    });
}
/*for reassigning vehicle location*/
function getRentalLocationId(callback){
    let query1 = "   select rl.id, rl.name from rental_location rl where rl.rental_vehicle_capacity > (select count(rental_location_id) from vehicle where rental_location_id = rl.id);";
    mysql.executeQuery(query1,function(err,result){
        if (err) {
            callback(err);
        } else {
            callback(null,result)
        }
    });
}

function getRentalLocationNotInVehicle(callback){
    let query1 = "SELECT id,name,rental_vehicle_capacity from rental_location where id NOT IN(SELECT DISTINCT(rental_location_id) from vehicle)";
    mysql.executeQuery(query1,function(err,result){
        if (err) {
            callback(err);
        } else {
            callback(null,result)
        }
    });
}
function getRentalLocationIdNotinVehicleReserved(callback){
    let query1 = "SELECT id,name,rental_vehicle_capacity from rental_location where id NOT IN(SELECT DISTINCT(rental_location_id) from vehicle where id NOT IN(SELECT DISTINCT(vehicle_id) from reservation where is_returned = 0))";
    mysql.executeQuery(query1,function(err,result){
        if (err) {
            callback(err);
        } else {
            callback(null,result)
        }
    });
}

function deleteVehicle(details,callback) {

                    let query3 = "DELETE from vehicle where id = '" + details.vehId + "'";
                    mysql.executeQuery(query3, function (err, result) {
                        if (err) {
                            callback(err);
                        }
                                else{
                                    callback(null);
                                }
                            });
}


function deleteRental(details,callback){
    let query1 = "DELETE from rental_location where id = '"+ details.rentalLocId+"'";
    mysql.executeQuery(query1,function(err,result){
        if(err){
            callback(err);
        }
        else{
            callback(null);
        }
    });
}
function getVehicleId(callback){
    let query1 = "SELECT id,name from vehicle where id NOT IN(select DISTINCT(vehicle_id) from reservation where is_returned = 0)";
    mysql.executeQuery(query1,function(err,result){
        if (err) {
            callback(err);
        } else {
            callback(null,result)
        }
    });
}

function getMembership(callback){
    let query1 = "SELECT * from membership";
    mysql.executeQuery(query1,function(err,result){
        if (err) {
            callback(err);
        } else {
            callback(null,result)
        }
    });
}
function updateMemPrice(details, callback){
    let query1 = "UPDATE membership set price = '" + details.memPrice + "' where name = '" + details.membershipName + "'";
    console.log(query1);
    mysql.executeQuery(query1, function (err,result) {
        if (err) {
            callback(err);
        } else {
            callback(null)
        }
    });
}
function updateVehPrice(details, callback){
    if(details.range == 1) {
        let query1 = "UPDATE price set price = '" + details.vPrice + "' where vehicle_type_id = '" + details.vehTypeId + "' and min_range = 0 and max_range = 24";
        console.log(query1);
        mysql.executeQuery(query1, function (err, result) {
            if (err) {
                callback(err);
            } else {
                callback(null)
            }
        });
    }
    else if(details.range == 2){
        let query2 = "UPDATE price set price = '" + details.vPrice + "' where vehicle_type_id = '" + details.vehTypeId + "' and min_range = 25 and max_range = 48";
        mysql.executeQuery(query2, function (err, result) {
            if (err) {
                callback(err);
            } else {
                callback(null)
            }
        });
    }
    else if(details.range == 3){
        let query3 = "UPDATE price set price = '" + details.vPrice + "' where vehicle_type_id = '" + details.vehTypeId + "' and min_range = 49 and max_range = 72";
        mysql.executeQuery(query3, function (err, result) {
            if (err) {
                callback(err);
            } else {
                callback(null)
            }
        });
    }
}
function updateVehFee(details, callback){
    let query1 = "UPDATE price set late_fee = '" + details.vFee + "' where vehicle_type_id = '" + details.vehTypeId + "'";
    console.log(query1);
    mysql.executeQuery(query1, function (err,result) {
        if (err) {
            callback(err);
        } else {
            callback(null)
        }
    });
}
function updateVehMile(details, callback){
    let query1 = "UPDATE vehicle set mileage = '" + details.vMile + "' where id = '" + details.upVehicleId + "'";
    console.log(query1);
    mysql.executeQuery(query1, function (err,result) {
        if (err) {
            callback(err);
        } else {
            callback(null)
        }
    });
}

function updateRenName(details, callback){
    let query1 = "UPDATE rental_location set name = '" + details.vName + "' where id = '" + details.upRentalId + "'";
    console.log(query1);
    mysql.executeQuery(query1, function (err,result) {
        if (err) {
            callback(err);
        } else {
            callback(null)
        }
    });
}

function updateRenAddr(details, callback){
    let query1 = "UPDATE rental_location set address = '" + details.vAddr + "' where id = '" + details.upRentalId + "'";
    console.log(query1);
    mysql.executeQuery(query1, function (err,result) {
        if (err) {
            callback(err);
        } else {
            callback(null)
        }
    });
}

function updateRenCap(details, callback){
    let query1 = "SELECT count(rental_location_id) as count from vehicle where rental_location_id = '"+  details.upRentalId +"'";
    console.log(query1);
    mysql.executeQuery(query1, function (err,result) {
        if (err) {
            callback(err);
        } else {

                let  count = result[0].count;
                console.log(count);
                if(details.vCap > count) {
                    let query2 = "UPDATE rental_location set rental_vehicle_capacity = '" + details.vCap + "' where id = '" + details.upRentalId + "' ";
                    mysql.executeQuery(query2, function (err, result) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null)
                        }
                    });
                }
                else{
                        callback(new Error('Change location for vehicles assigned to this location before updating capacity'));
                    }
        }
    });
}
function getUserIdForMembershipTermination(callback){
    let query1  = "select * from user_membership where DATE(expiration_date) < DATE(SYSDATE()) and is_terminated = 0";
    mysql.executeQuery(query1, function (err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result)
        }
    });

}
function terminateMembership(details,callback){
    let query1 = "UPDATE user_membership set is_terminated = 1 where user_id = '"+ details.userid +"'";
    mysql.executeQuery(query1, function(err,result){
        if(err){
            callback(err);
        }
        else{
            callback(null);
        }
    });

}
function updateVehServ(details, callback){
    let query1 = "UPDATE vehicle set last_time_of_service = '" + details.vServ + "' where id = '" + details.upVehicleId + "'";
    console.log(query1);
    mysql.executeQuery(query1, function (err,result) {
        if (err) {
            callback(err);
        } else {
            callback(null)
        }
    });
}
function updateVehRegNum(details, callback){
    let query1 = "UPDATE vehicle set registration = '" + details.vRegNum + "' where id = '" + details.upVehicleId + "'";
    console.log(query1);
    mysql.executeQuery(query1, function (err,result) {
        if (err) {
            callback(err);
        } else {
            callback(null)
        }
    });
}
function getVehicleTypeIdNotInPrice(callback){
    let query1 = "SELECT id from vehicle_type where id NOT IN(SELECT DISTINCT(vehicle_type_id) from price)";
    mysql.executeQuery(query1,function(err,result){
        if (err) {
            callback(err);
        } else {
            callback(null,result)
        }
    });
}

function getUserIdForDeletion(callback){
    let query1 = "select * from users where id NOT IN (select DISTINCT(user_id) from reservation where is_completed !=1 and is_returned != 1 and cancellled !=1)  and is_admin !=1";
    mysql.executeQuery(query1,function(err,result){
        if (err) {
            callback(err);
        } else {
            callback(null,result);
        }
    });
}
function deleteuser(details,callback){
    let query1 = "UPDATE users set is_deleted = 1 where id = '"+details.useridfordel +"'";
    mysql.executeQuery(query1,function(err,result){
        if (err){
            callback(err);

        }
        else {
            let query2 = "UPDATE user_membership set is_terminated = 1 where id = '" + details.useridfordel + "'";
            mysql.executeQuery(query2, function (err, result) {
                if (err) {
                    callback(err);

                } else {
                    callback(null);
                }
            });
        }
    })
}
function getCurPrice(details,callback){
    if(details.range == 1){
        let query1= "select price from price where vehicle_type_id = '"+ details.vehTypeId+"' and min_range = 0 and max_range = 24";
        mysql.executeQuery(query1, function(err,result){
            if(err){
                callback(err);
            }
            else{
                callback(null,result);
            }
        })
    }
    else if(details.range == 2){
        let query2 = "select price from price where vehicle_type_id = '"+ details.vehTypeId+"' and min_range = 25 and max_range = 48";
        mysql.executeQuery(query2, function(err,result){


        if(err){
            callback(err);
        }
        else{
            callback(null,result);
        }
        });
    }
    else if(details.range == 3){
        let query3= "select price from price where vehicle_type_id = '"+ details.vehTypeId+"' and min_range = 49 and max_range = 72";
        mysql.executeQuery(query3, function(err,result){


            if(err){
                callback(err);
            }
            else{
                callback(null,result);
            }
        });
    }
}
module.exports.addRentalLocation = addRentalLocation;
module.exports.addVehicleType = addVehicleType;
module.exports.getVehicleTypeId = getVehicleTypeId;
module.exports.addVehiclePrice = addVehiclePrice;
module.exports.getRentalLocations = getRentalLocations;
module.exports.addVehicle = addVehicle;
module.exports.getMembership = getMembership;
module.exports.updateMemPrice = updateMemPrice;
module.exports.updateVehPrice = updateVehPrice;
module.exports.updateVehFee = updateVehFee;
module.exports.updateVehRegNum = updateVehRegNum;
module.exports.updateVehServ = updateVehServ;
module.exports.updateVehMile = updateVehMile;
module.exports.updateRenName = updateRenName
module.exports.updateRenAddr = updateRenAddr
module.exports.updateRenCap = updateRenCap

module.exports.getVehicleTypeIdNotInPrice = getVehicleTypeIdNotInPrice;
module.exports.getVehicleTypeIdInPrice = getVehicleTypeIdInPrice;
module.exports.getRentalLocationId = getRentalLocationId;
module.exports.reassignVehicle = reassignVehicle;
module.exports.deleteVehicle = deleteVehicle;
module.exports.deleteRental = deleteRental;
module.exports.getVehicleId = getVehicleId;
module.exports.getRentalLocationNotInVehicle = getRentalLocationNotInVehicle;
module.exports.getRentalLocationIdNotinVehicleReserved = getRentalLocationIdNotinVehicleReserved;
module.exports.getUserIdForMembershipTermination = getUserIdForMembershipTermination;
module.exports.terminateMembership = terminateMembership;
module.exports.getUserIdForDeletion = getUserIdForDeletion;

module.exports.deleteuser = deleteuser;
module.exports.getCurPrice = getCurPrice;
module.exports.addAdminUser = addAdminUser;
