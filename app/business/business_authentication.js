let mysql = require('../database/mysql');
let reservation = require('../business/business_reservation');

function addSignUpDetails(details, callback){
    let query1 = "SELECT email from users WHERE email='" + details.email + "'";
    mysql.executeQuery(query1, function (err, result) {
        if (err){
            callback(err, null);
        }else {
            if (result.length !== 1){
                let query2 = "SELECT username from users WHERE username='" + details.username + "'";
                mysql.executeQuery(query2, function (err, result) {
                    if (err){
                        callback(err, null);
                    }else {
                        if (result.length !== 1){
                            let query3 = "INSERT INTO users(email, username, password, phone) VALUES('" + details.email + "', '" + details.username + "', '" + details.password + "', '" + details.phoneNumber + "')";
                            console.log(query3);
                            mysql.executeQuery(query3, function (err) {
                                if (err){
                                    callback(err);
                                }else {
                                    let query4 = "SELECT id from users WHERE email like '%" + details.email + "%' AND username like '%" + details.username + "%'";
                                    console.log(query4);
                                    mysql.executeQuery(query4, function (err, result) {
                                        if (err){
                                            callback(err, null);
                                        }else {
                                            callback(null, result);
                                        }
                                    });
                                }
                            });
                        }else {
                            let error = {};
                            error.message = "username already in use";
                            callback(error, null);
                        }
                    }
                });
            }else {
                let error = {};
                error.message = "email already in use";
                callback(error, null);
            }
        }
    });
}

function checkLoginCredentials(details, callback){
    let query = "SELECT id, is_admin FROM users WHERE username = '" + details.username + "' AND password = '" + details.password + "' AND is_deleted=0";
    console.log(query);
    mysql.executeQuery(query, function (err, result) {
        if (err) {
            callback(err, false);
        }

        if (result.length > 0){
            callback(null, result);
        }else {
            let error = {};
            error["message"] = "No records found with username " + details.username;
            callback(error, false);
        }
    });
}

function addDriverInformation(details, callback){
    let query1 = "INSERT INTO driver_information(license_number, country, expiry_date, address, user_id) VALUES('" + details.dl_number + "', '" + details.country + "', '" + details.dl_expiry + "', '" + details.address + "', " + details.userId+ ")";
    console.log(query1);
    mysql.executeQuery(query1, function (err) {
        if (err){
            callback(err);
        }else {
            let query2 = "UPDATE users SET firstname='" + details.firstname + "', lastname='" + details.lastname + "', date_of_birth='" + details.dob + "' WHERE id=" + details.userId;
            console.log(query2);
            mysql.executeQuery(query2, function (err) {
                if (err){
                    callback(err);
                }

                callback(null);
            });
        }
    });
}

function addPaymentInformation(details, callback){
    let query1 = "INSERT INTO payment(card_number, expiry_date, cvv, card_holder_name, user_id) VALUES('" + details.card_number + "', '" + details.card_expiry + "', '" + details.cvv + "', '" + details.car_holder_name + "', " + details.userId+ ")";
    console.log(query1);
    mysql.executeQuery(query1, function (err) {
        if (err){
            callback(err);
        }else {
            let membershipId = details.membership_type === "6" ? 1 : 2;
            let det = {
                'membership_id': membershipId
            };
            reservation.calculateMembershipFeeForUser(det, function (err, result) {
                if (err){
                    callback(err);
                }else {
                    let query2 = "";
                    let futureDate = "";
                    let date = new Date();
                    if (membershipId === 1){
                        futureDate = new Date(date.setMonth(date.getMonth() + 6));
                        futureDate = reservation.GetFormattedDate(futureDate);
                        query2 = "INSERT INTO user_membership(user_id, membership_id, creation_date, expiration_date, price) VALUES(" + details.userId + ", " + membershipId+ ", NOW(), '" + futureDate + "', " + result + ");";
                    }else {
                        futureDate = new Date(date.setMonth(date.getMonth() + 12));
                        futureDate = reservation.GetFormattedDate(futureDate);
                        query2 = "INSERT INTO user_membership(user_id, membership_id, creation_date, expiration_date, price) VALUES(" + details.userId + ", " + membershipId+ ", NOW(), '" + futureDate + "', " + result + ");";
                    }

                    console.log(query2);
                    mysql.executeQuery(query2, function (err) {
                        if (err){
                            callback(err);
                        }else {
                            callback(null);
                        }
                    });
                }
            });
        }
    });
}

module.exports.addSignUpDetails = addSignUpDetails;
module.exports.checkLoginCredentials = checkLoginCredentials;
module.exports.addDriverInformation = addDriverInformation;
module.exports.addPaymentInformation = addPaymentInformation;