var mysql = require("../database/mysql");
var async = require("async");

function getVehicles(callback) {
    let query = "select *, vehicle.id as id from vehicle left join rental_location on vehicle.rental_location_id=rental_location.id";
    mysql.executeQuery(query, function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            console.log(result);
            callback(null, result);
        }
    });
}

function getLocations(callback) {
    let query = "select * from rental_location";
    mysql.executeQuery(query, (err, result) => {
        if (err) {
            console.log("error: ", err);
            callback(err, null);
        }
        else {
            console.log("result:", result)
            callback(null, result);
        }
    })
}

function bookVehicle(data, callback) {

    let query = "select * from reservation where vehicle_id='" + data.id + "'";
    mysql.executeQuery(query, (err, result) => {
        if (err) {
            console.log("---error==>>>>", err);
            callback(err, null)
        } else {
            console.log("data: ", data)
            console.log("result: ", result);
            let start_time, end_time, end_date;
            let flag = false;
            async.forEachOf(result, (row, i, callback1) => {
                let reservation_datetime = new Date(row.reservation_datetime);
                let estimated_datetime = new Date(row.estimated_return_datetime);
                start_time = new Date(data.date);
                end_time = new Date(start_time.getTime() + data.stay * 3600 * 1000);
                console.log("inside for each")
                if (start_time > reservation_datetime && start_time < estimated_datetime) {
                    console.log("vehicle is already reserved");
                    flag = true;
                    callback1("vehicle is already reserved");
                } else if (i === result.length - 1 && flag === false) {
                    callback1("Successfully Registered");
                }

            }, (msg) => {
                if (msg === "vehicle is already reserved") {
                    console.log("INSIDE CALLBACK")
                    callback(null, msg);
                }
                else if (msg === "Successfully Registered") {
                    end_date = new Date(end_time.getTime() - 7 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');
                    console.log("start time: ", start_time, " end time: ")
                    let vehicleQuery = "select * from vehicle where id='" + data.id + "'";
                    mysql.executeQuery(vehicleQuery, (err, result) => {
                        if (err) {
                            console.log("---vehicle error==>>>>", err);
                            callback(err, null)
                        }
                        else {
                            let vehicle = result[0];

                            console.log("vehicle:", vehicle);
                            mysql.executeQuery("select price from price where vehicle_type_id = '" + vehicle.vehicle_type_id + "' and min_range <= '" + data.stay + "' and max_range >= '" + data.stay + "'", (err, result) => {
                                if (err) {
                                    console.log("---price error==>>>>", err);
                                    callback(err, null)
                                }
                                else {
                                    let price = result[0].price;
                                    console.log("price", price);
                                    let charge = data.stay * price;
                                    console.log("charge", charge)
                                    mysql.executeQuery("select name from rental_location where id =" + vehicle.rental_location_id + " ", (err, result) => {
                                        if (err) {
                                            console.log("---insert error==>>>>", err);
                                            callback(err, null)
                                        } else {
                                            let location = result[0].name;
                                            console.log("end_date: ", end_date)
                                            mysql.executeQuery("INSERT INTO `reservation` (vehicle_type_id, vehicle_id, reservation_datetime, location, length_of_stay , charge, user_id, rental_location_id, price, estimated_return_datetime) VALUES('" + vehicle.vehicle_type_id + "','" + vehicle.id + "','" + data.date + "','" + location + "','" + data.stay + "','" + charge + "','" + data.user_id + "','" + vehicle.rental_location_id + "','" + price + "','" + end_date + "')  ", (err, result) => {
                                                if (err) {
                                                    console.log("---insert error==>>>>", err);
                                                    callback(err, null)
                                                }
                                                else {
                                                    callback(null, msg);
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}

function getVehiclesOfLocation(data, callback) {
    let query = "select * from vehicle where rental_location_id = '" + data.id + "' ";
    mysql.executeQuery(query, (err, result) => {
        if (err) {
            console.log("---error==>>>>", err);
            callback(null, false);
        }
        else {
            console.log("result:", result)
            callback(null, result)
        }
    })
}

module.exports.getVehicles = getVehicles;
module.exports.getLocations = getLocations;
module.exports.bookVehicle = bookVehicle;
module.exports.getVehiclesOfLocation = getVehiclesOfLocation;