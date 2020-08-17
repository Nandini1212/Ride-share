let mysql = require('../database/mysql');

function calculateLateFeesForReservation(details, callback){
    let query = "SELECT p.late_fee, p.price, r.return_datetime, reservation_datetime FROM reservation as r INNER JOIN price as p on r.vehicle_type_id = p.vehicle_type_id WHERE r.id = " + details.reservation_id + " AND r.vehicle_id = " + details.vehicle_id;
    query = query + " AND p.min_range < " + details.length_of_stay + ";";
    mysql.executeQuery(query, function (err, result) {
        if (err){
            callback(err, null);
        }else {
            if (result.length > 0) {
                let date1 = new Date(result[0].reservation_datetime);
                let date2 = new Date(result[0].return_datetime);
                let diff = date2 - date1;
                let output = Math.round((diff/1000)/60);
                let totalAmount = ((parseInt(result[0].late_fee) * parseInt(output)) / 60) + (parseInt(result[0].price) * parseInt(details.length_of_stay));
                callback(null, totalAmount);
            }
        }
    });
}

function calculatePaymentForReservation(details, callback){
    let query = "SELECT p.price FROM reservation as r INNER JOIN price as p on r.vehicle_type_id = p.vehicle_type_id WHERE r.id = " + details.reservation_id + " AND r.vehicle_id = " + details.vehicle_id;
    query = query + " AND p.min_range < " + details.length_of_stay + ";";
    mysql.executeQuery(query, function (err, result) {
        if (err){
            callback(err, null);
        }else {
            if (result.length > 0) {
                let totalAmount = parseInt(result[0].price) * parseInt(details.length_of_stay);
                callback(null, totalAmount);
            }
        }
    });
}

function calculateMembershipFeeForUser(details, callback){
    let query = "SELECT price FROM membership WHERE id = " + details.membership_id;
    mysql.executeQuery(query, function (err, result) {
        if (err){
            callback(err, null);
        }else {
            callback(null, result[0].price);
        }
    });
}

/**
 * @return {string}
 */
function GetFormattedDate(date) {
    let todayTime = new Date(date);
    let month = todayTime .getMonth() + 1;
    if (parseInt(month) <= 9){
        month = "0" + month.toString()
    }

    let day = todayTime .getDate();
    if (parseInt(day) <= 9){
        day = "0" + day.toString()
    }
    let year = todayTime .getFullYear();
    let hours = todayTime.getHours();
    if (parseInt(hours) <= 9){
        hours = "0" + hours.toString()
    }

    let minutes = todayTime.getMinutes();
    if (parseInt(minutes) <= 9){
        minutes = "0" + minutes.toString()
    }

    let seconds = todayTime.getSeconds();
    if (parseInt(seconds) <= 9){
        seconds = "0" + seconds.toString()
    }
    return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
}

module.exports.calculateLateFeesForReservation = calculateLateFeesForReservation;
module.exports.calculatePaymentForReservation = calculatePaymentForReservation;
module.exports.calculateMembershipFeeForUser = calculateMembershipFeeForUser;
module.exports.GetFormattedDate = GetFormattedDate;