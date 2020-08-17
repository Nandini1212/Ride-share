let mysql = require('../database/mysql');
let reservation = require('../business/business_reservation');

function getuserdetails(userid, callback) {
    let query = "SELECT username, email, phone, password FROM users WHERE id=" + userid;
    mysql.executeQuery(query, function (err, result) {
        if (err) {
            callback(err, null);
        }

        if (result.length > 0) {
            callback(null, result);
        } else {
            let error = {};
            error["message"] = "No records found with userId " + userid;
            callback(error, false);
        }
    });
}

function getdriverinformation(userid, callback) {
    let query = "SELECT u.firstname, u.lastname, u.date_of_birth, d.license_number, d.country, d.expiry_date, d.address FROM users AS u";
    query = query + " INNER JOIN driver_information AS d ON u.id = d.user_id WHERE u.id=" + userid;
    mysql.executeQuery(query, function (err, result) {
        if (err) {
            callback(err, null);
        }

        if (result.length > 0) {
            callback(null, result);
        } else {
            let error = {};
            error["message"] = "No records found with userId " + userid;
            callback(error, false);
        }
    });
}

function getpaymentdetails(userid, callback) {
    let query = "SELECT p.card_number, p.expiry_date, p.cvv, p.card_holder_name, m.name, m.type, um.expiration_date FROM payment AS p";
    query = query + " INNER JOIN user_membership AS um ON p.user_id = um.user_id";
    query = query + " INNER JOIN membership AS m ON m.id = um.membership_id  WHERE um.user_id=" + userid;
    mysql.executeQuery(query, function (err, result) {
        if (err) {
            callback(err, null);
        }

        if (result.length > 0) {
            callback(null, result);
        } else {
            let error = {};
            error["message"] = "No records found with userId " + userid;
            callback(error, false);
        }
    });
}

function getbookinghistory(userid, callback) {
    let query = "SELECT id, vehicle_id, reservation_datetime, reservation_time, location, length_of_stay, price, is_returned FROM reservation WHERE user_id=" + userid + " AND is_deleted=0";
    mysql.executeQuery(query, function (err, result) {
        if (err) {
            callback(err, null);
        }

        if (result.length > 0) {
            callback(null, result);
        } else {
            let error = {};
            error["message"] = "No records found with userId " + userid;
            callback(error, false);
        }
    });
}

function saveuserdetails(details, callback) {
    let query = "UPDATE users SET username='" + details.username + "', email='" + details.email + "', phone='" + details.phoneNumber + "', password='" + details.password + "' WHERE id=" + details.userId;
    mysql.executeQuery(query, function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, null);
        }
    });
}

function savedriverinformation(details, callback) {
    let query1 = "UPDATE users SET firstname='" + details.firstname + "', lastname='" + details.lastname + "', date_of_birth='" + details.dob + "' WHERE id=" + details.userId;
    mysql.executeQuery(query1, function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            let query2 = "UPDATE driver_information SET license_number='" + details.dl_number + "', country='" + details.country + "', expiry_date='" + details.dl_expiry + "', address='" + details.address + "' WHERE user_id=" + details.userId;
            mysql.executeQuery(query2, function (err, result) {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, null);
                }
            });
        }
    });
}

function savepaymentdetails(details, callback) {
    let membershipId = details.membership_type === "6" ? 1 : 2;
    details['membership_id'] = membershipId;
    reservation.calculateMembershipFeeForUser(details, function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            let query1 = "SELECT creation_date FROM user_membership WHERE user_id = " + details.userId + ";";
            mysql.executeQuery(query1, function (err, output) {
                if (err) {
                    callback(err);
                } else {
                    if (output.length > 0) {
                        let creation_date = output[0].creation_date;
                        let futureDate = "";
                        let date = new Date(creation_date);
                        if (details.membership_type === "6") {
                            futureDate = new Date(date.setMonth(date.getMonth() + 6));
                        } else {
                            futureDate = new Date(date.setMonth(date.getMonth() + 12));
                        }

                        futureDate = reservation.GetFormattedDate(futureDate);
                        let query2 = "UPDATE user_membership SET membership_id=" + membershipId + ", change_membership_fee=" + result + ", expiration_date='" + futureDate + "' WHERE user_id=" + details.userId;
                        if (details.old_membership_type !== details.membership_type) {
                            query2 = "UPDATE user_membership SET membership_id=" + membershipId + ", change_membership_fee=" + result + ", expiration_date='" + futureDate + "', is_payed=0 WHERE user_id=" + details.userId;
                        }

                        mysql.executeQuery(query2, function (err, result) {
                            if (err) {
                                callback(err, null);
                            } else {
                                let query3 = "UPDATE payment SET card_number='" + details.card_number + "', expiry_date='" + details.card_expiry + "', cvv='" + details.cvv + "', card_holder_name='" + details.car_holder_name + "' WHERE user_id=" + details.userId;
                                mysql.executeQuery(query3, function (err, result) {
                                    if (err) {
                                        callback(err, null);
                                    } else {
                                        callback(null, null);
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    });
}

function notifyBookingComplete(details, callback) {
    let query = "UPDATE reservation, vehicle SET reservation.is_returned=1, reservation.is_completed=1, reservation.return_datetime=NOW(), vehicle.reserved=0 WHERE reservation.id=" + details.reservation_Id + " AND reservation.vehicle_id = vehicle.id ";
    mysql.executeQuery(query, function (err) {
        if (err) {
            callback(err);
        } else {
            reservation.calculateLateFeesForReservation(details, function (err, result) {
                if (err) {
                    callback(err);
                } else {
                    let query1 = "UPDATE reservation SET charge=" + result + ", price=" + result + ", fee_charged=" + result + " WHERE reservation.id=" + details.reservation_Id + " AND vehicle_id=" + details.vehicle_Id;
                    mysql.executeQuery(query1, function (err) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null);
                        }
                    });
                }
            });
        }
    });
}

function deleteBooking(reservation_Id, callback) {
    let query = "UPDATE reservation, vehicle SET reservation.is_deleted=1, vehicle.reserved=0 WHERE reservation.id=" + reservation_Id + " AND reservation.vehicle_id = vehicle.id ";
    mysql.executeQuery(query, function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
}

function terminateMembership(userId, callback) {
    let query = "UPDATE users, user_membership SET users.is_deleted=1, user_membership.is_terminated=1 WHERE users.id=" + userId + " AND users.id = user_membership.user_id ";
    mysql.executeQuery(query, function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
}

function renewMembership(userId, callback) {
    let query1 = "SELECT expiration_date, membership_id FROM user_membership WHERE user_id = " + userId;
    mysql.executeQuery(query1, function (err, result) {
        if (err) {
            callback(err);
        } else {
            if (result[0].expiration_date) {
                let output = result[0].expiration_date;
                let date1 = new Date(output.toString());
                let date2 = new Date();
                let hours = Math.abs(date1 - date2) / 36e5;
                if (hours > 120) {
                    let error = {};
                    error.message = "You cannot renew your membership now. It can be renewed in last 5 days. Membership expires on " + output;
                    callback(error);
                } else {
                    let membershipId = result[0].membership_id;
                    let details = {
                        'membership_id': membershipId
                    };
                    let date = new Date();
                    let type = "";
                    if (membershipId === 1 || membershipId === "1") {
                        type = "6";
                    } else {
                        type = "12";
                    }

                    reservation.calculateMembershipFeeForUser(details, function (err, results) {
                        if (err) {
                            callback(err);
                        } else {
                            let query2 = "UPDATE user_membership SET creation_date=NOW(), expiration_date=DATE_ADD(NOW(), INTERVAL " + type + " MONTH), price=" + results + ", is_payed=0, change_membership_fee=0 WHERE user_id=" + userId + ";";
                            mysql.executeQuery(query2, function (err) {
                                if (err) {
                                    callback(err);
                                } else {
                                    callback(null);
                                }
                            });
                        }
                    });
                }
            }
        }
    });
}

module.exports.getuserdetails = getuserdetails;
module.exports.getdriverinformation = getdriverinformation;
module.exports.getpaymentdetails = getpaymentdetails;
module.exports.getbookinghistory = getbookinghistory;
module.exports.deleteBooking = deleteBooking;
module.exports.notifyBookingComplete = notifyBookingComplete;

module.exports.saveuserdetails = saveuserdetails;
module.exports.savedriverinformation = savedriverinformation;
module.exports.savepaymentdetails = savepaymentdetails;
module.exports.terminateMembership = terminateMembership;
module.exports.renewMembership = renewMembership;
