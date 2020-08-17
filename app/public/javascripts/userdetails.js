let userid = localStorage.getItem('userId');
let old_membership_type;
$(function () {
    //$('#txtdob').datepicker();
    getUserDetails();
    getDriverInfo();
    getPaymentDetails();
    getBookingHistory();
});

function getUserDetails() {
    $.ajax({
        type: 'GET',
        url: '/users/getuserdetails/' + userid,
        success: function (data) {
            if (data) {
                let html = "<table width='100%'><tbody>";
                html += "<tr><td class='tblheading'>Username</td><td class='tbldata'>" + data.username + "</td></tr>";
                html += "<tr><td class='tblheading'>Email</td><td class='tbldata'>" + data.email + "</td></tr>";
                html += "<tr><td class='tblheading'>Phone Number</td><td class='tbldata'>" + data.phone + "</td></tr>";
                let dummyPassword = "";
                for (let i = 0; i < data.password.length; i++) {
                    dummyPassword = dummyPassword + "*";
                }
                html += "<tr><td class='tblheading'>Password</td><td class='tbldata'>" + dummyPassword + "</td></tr>";
                html += "</tbody></html>";
                $("#tblUserDetails").html(html);
                $("#txtusername").val(data.username);
                $("#txtemail").val(data.email);
                $("#txtphone").val(data.phone);
                $("#txtpassword").val(data.password);
            }
        }
    });
}

function loadUserDetails() {

    $.ajax({
        type: 'GET',
        url: '/users/getuserdetails/' + userid,
        success: function (data) {
            if (data) {
                $("#txtusername").val(data.username);
                $("#txtemail").val(data.email);
                $("#txtphone").val(data.phone);
                $("#txtpassword").val(data.password);
            }
        }
    });
}

function saveUserDetails() {

    let username = $("#txtusername").val();
    let password = $("#txtpassword").val();
    let email = $("#txtemail").val();
    let phoneNumber = $("#txtphone").val();

    if (username.trim() === "") {
        $("#txtusername").focus();
        return;
    }

    if (password.trim() === "") {
        $("#txtpassword").focus();
        return;
    }

    if (email.trim() === "") {
        $("#txtemail").focus();
        return;
    }

    if (phoneNumber.trim() === "") {
        $("#txtphone").focus();
        return;
    }

    let emailRegex = '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}';
    let phoneRegex = '[0-9]{3}[0-9]{3}[0-9]{4}';

    let validateEmail = email.match(emailRegex);
    let validatePhoneNumber = phoneNumber.match(phoneRegex);

    if (validateEmail === null) {
        alert("Please enter valid email id");
        $("#txtemail").focus();
        return;
    }

    if (validatePhoneNumber === null || phoneNumber.length > 10) {
        alert("Please enter valid phone number");
        $("#txtphone").focus();
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/users/saveuserdetails',
        data: {
            'username': username,
            'password': password,
            'email': email,
            'phoneNumber': phoneNumber,
            'user_id': localStorage.getItem("userId")
        },
        success: function (data) {
            alert(data.message);
            getUserDetails();
            $("#userdetailsModelPopup").modal('toggle');
        }
    });
}

function getDriverInfo() {
    $.ajax({
        type: 'GET',
        url: '/users/getdriverinformation/' + userid,
        success: function (data) {
            if (data) {
                let html = "<table width='100%'><tbody>";
                html += "<tr><td class='tblheading'>Licence Issued In</td><td class='tbldata'>" + data.license_issued_on + "</td></tr>";
                html += "<tr><td class='tblheading'>Driving License Number</td><td class='tbldata'>" + data.dl_number + "</td></tr>";
                html += "<tr><td class='tblheading'>License Expires on</td><td class='tbldata'>" + data.dl_expiry + "</td></tr>";
                html += "<tr><td class='tblheading'>Address</td><td class='tbldata'>" + data.address + "</td></tr>";
                html += "<tr><td class='tblheading'>First Name</td><td class='tbldata'>" + data.first_name + "</td></tr>";
                html += "<tr><td class='tblheading'>Last Name</td><td class='tbldata'>" + data.last_name + "</td></tr>";
                html += "<tr><td class='tblheading'>Date of Birth</td><td class='tbldata'>" + data.date_of_birth + "</td></tr>";
                html += "</tbody></html>";
                $("#tblDriverInfo").html(html);
                let dl_expiry_list = data.dl_expiry.split('/');
                $('#ddlDLExpirymonth').val(dl_expiry_list[0]);
                $('#ddlDLExpiryyear').val(dl_expiry_list[1]);
                $("#txtusername").val(data.license_issued_on);
                $("#txtLicenseNumber").val(data.dl_number);
                $("#txtaddress").val(data.address);
                $("#txtfirstname").val(data.first_name);
                $("#txtlastname").val(data.last_name);
                let dob_list = data.date_of_birth.split('/');
                $("#txtDobDay").val(dob_list[0]);
                $("#txtDobMonth").val(dob_list[1]);
                $("#txtDobYear").val(dob_list[2]);
            }
        }
    });
}

function loadDriverInfo() {
    $.ajax({
        type: 'GET',
        url: '/users/getdriverinformation/' + userid,
        success: function (data) {
            if (data) {
                $("#selectLicenseIssueIn option:contains(" + data.license_issued_on + ")").attr('selected', 'selected');
                let dl_expiry_list = data.dl_expiry.split('/');
                $('#ddlDLExpirymonth').val(dl_expiry_list[0]);
                $('#ddlDLExpiryyear').val(dl_expiry_list[1]);
                $("#txtusername").val(data.license_issued_on);
                $("#txtLicenseNumber").val(data.dl_number);
                $("#txtaddress").val(data.address);
                $("#txtfirstname").val(data.first_name);
                $("#txtlastname").val(data.last_name);
                let dob_list = data.date_of_birth.split('/');
                $("#txtDobDay").val(dob_list[0]);
                $("#txtDobMonth").val(dob_list[1]);
                $("#txtDobYear").val(dob_list[2]);
            }
        }
    });
}

function saveDriverInfo() {

    let country = $('#selectLicenseIssueIn option:selected').text();
    let dl_number = $("#txtLicenseNumber").val();
    let dlExpiryMonth = $("#ddlDLExpirymonth option:selected").text();
    let dlExpiryYear = $("#ddlDLExpiryyear option:selected").text();
    let address = $("#txtaddress").val();
    let firstname = $("#txtfirstname").val();
    let lastname = $("#txtlastname").val();
    let dobday = $("#txtDobDay").val();
    let dobmonth = $("#txtDobMonth").val();
    let dobyear = $("#txtDobYear").val();

    if (country.trim() === "Country") {
        alert("Please select the country");
        return;
    }

    if (dl_number.trim() === "") {
        $("#dlNumber").focus();
        return;
    }

    if (dlExpiryMonth.trim() === "Month") {
        return;
    }

    if (dlExpiryYear.trim() === "Year") {
        return;
    }

    if (address.trim() === "") {
        $("#txtaddress").focus();
        return;
    }

    if (firstname.trim() === "") {
        $("#txtfirstname").focus();
        return;
    }

    if (lastname.trim() === "") {
        $("#txtlastname").focus();
        return;
    }

    if (dobyear.trim() === "") {
        $("#txtDobYear").focus();
        return;
    }

    if (dobmonth.trim() === "") {
        $("#txtDobMonth").focus();
        return;
    }

    if (dobday.trim() === "") {
        $("#txtDobDay").focus();
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/users/savedriverinformation',
        data: {
            'country': country,
            'dl_number': dl_number,
            'dl_expiry': dlExpiryMonth + "/" + dlExpiryYear,
            'address': address,
            'firstname': firstname,
            'lastname': lastname,
            'dob': dobday + "/" + dobmonth + "/" + dobyear,
            'userId': localStorage.getItem("userId")
        },
        success: function (data) {
            alert(data.message);
            getDriverInfo();
            $("#driverinfoModelPopup").modal('toggle');
        }
    });
}

function getPaymentDetails() {
    $.ajax({
        type: 'GET',
        url: '/users/getpaymentdetails/' + userid,
        success: function (data) {
            if (data) {
                let html = "<table width='100%'><tbody>";
                html += "<tr><td class='tblheading'>Membership Type</td><td class='tbldata'>" + data.membership_name + "</td></tr>";
                html += "<tr><td class='tblheading'>Card Number</td><td class='tbldata'>" + data.card_number + "</td></tr>";
                html += "<tr><td class='tblheading'>Card Expires on</td><td class='tbldata'>" + data.card_expiry + "</td></tr>";
                html += "<tr><td class='tblheading'>CVV</td><td class='tbldata'>" + data.cvv + "</td></tr>";
                html += "<tr><td class='tblheading'>Card Holder Name</td><td class='tbldata'>" + data.card_holder_name + "</td></tr>";
                html += "</tbody></html>";
                $("#tblPayment").html(html);
                $("input[name=membership][value=" + data.membership_type + "]").attr('checked', 'checked');
                let card_expiry_list = data.card_expiry.split('/');
                $('#ddlCardExpirymonth').val(card_expiry_list[0]);
                $('#ddlCardExpiryyear').val(card_expiry_list[1]);
                $("#txtcardnumber").val(data.card_number);
                $("#txtcvv").val(data.cvv);
                $("#txtcardholdername").val(data.card_holder_name);
                old_membership_type = data.membership_type;
            }
        }
    });
}

function loadPaymentDetails() {
    $.ajax({
        type: 'GET',
        url: '/users/getpaymentdetails/' + userid,
        success: function (data) {
            if (data) {
                $("input[name=membership][value=" + data.membership_type + "]").prop('checked', true);
                let card_expiry_list = data.card_expiry.split('/');
                $('#ddlCardExpirymonth').val(card_expiry_list[0]);
                $('#ddlCardExpiryyear').val(card_expiry_list[1]);
                $("#txtcardnumber").val(data.card_number);
                $("#txtcvv").val(data.cvv);
                $("#txtcardholdername").val(data.card_holder_name);
            }
        }
    });
}

function savePaymentDetails() {

    let membership_type = $("input:radio[name='membership']:checked").val();
    let cardnumber = $("#txtcardnumber").val();
    let dobCardmonth = $("#ddlCardExpirymonth option:selected").text();
    let dobCardyear = $("#ddlCardExpiryyear option:selected").text();
    let cvv = $("#txtcvv").val();
    let car_holder_name = $("#txtcardholdername").val();

    if (cardnumber.trim() === "") {
        $("#txtcardnumber").focus();
        return;
    }

    if (dobCardmonth.trim() === "Month") {
        return;
    }

    if (dobCardyear.trim() === "Year") {
        return;
    }

    if (cvv.trim() === "Month") {
        $("#txtcvv").focus();
        return;
    }

    if (car_holder_name.trim() === "Year") {
        $("#txtcardholdername").focus();
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/users/savepaymentdetails',
        data: {
            'membership_type': membership_type,
            'cardnumber': cardnumber,
            'card_expiry': dobCardmonth + "/" + dobCardyear,
            'cvv': cvv,
            'car_holder_name': car_holder_name,
            'userId': localStorage.getItem("userId"),
            'old_membership_type': old_membership_type
        },
        success: function (data) {
            alert(data.message);
            getPaymentDetails();
            $("#carddetailsModelPopup").modal('toggle');
        }
    });
}

function getBookingHistory() {
    $.ajax({
        type: 'GET',
        url: '/users/getbookinghistory/' + userid,
        success: function (data) {
            if (data) {
                let html = "<table class='tblbookingHistory' width='100%'><thead>";
                html += "<tr><th>Booking Date</th>";
                html += "<th>Booking Time</th>";
                html += "<th>Place of Pickup</th>";
                html += "<th>Length of Booking</th>";
                html += "<th>Price</th>";
                html += "<th>Notify</th>";
                html += "<th>Delete</th>";
                html += "</tr></thead><tbody>";
                if (data.result) {
                    data.result.forEach(function (item) {
                        console.log("item:", item);
                        html += "<tr>";
                        html += "<td>" + item.booking_date + "</td>";
                        html += "<td>" + item.booking_time + "</td>";
                        html += "<td>" + item.pickup_place + "</td>";
                        html += "<td>" + item.length_of_booking + "</td>";
                        html += "<td>" + item.price + "</td>";
                        if (item.is_returned === "1" || item.is_returned === 1) {
                            html += "<td id='td-" + item.booking_id + "-" + item.is_returned + "-" + item.vehicle_id + "-" + item.length_of_stay + "' align='center'><a onclick='notifyBookingComplete(" + item.booking_id + ",this);'><i class='fas fa-bell' style='color: blue; font-size: 20px;cursor: pointer;'></i></a>";
                        } else {
                            html += "<td id='td-" + item.booking_id + "-" + item.is_returned + "-" + item.vehicle_id + "-" + item.length_of_stay + "' align='center'><a onclick='notifyBookingComplete(" + item.booking_id + ",this);'><i class='fas fa-bell' style='color: green; font-size: 20px;cursor: pointer;'></i></a>";
                        }
                        html += "<td align='center'><a onclick='deletebooking(" + item.booking_id + ",this);'><i class='fas fa-trash-alt' style='color: red; font-size: 20px;cursor: pointer;'></i></a>";
                        html += "</tr>";
                    });
                }

                html += "</tbody></html>";
                $("#tblBookingHistory").html(html);
            }
        }
    });
}

function notifyBookingComplete(reservation_id, instance) {
    let notifyValue = instance.closest("td").id.split('-');
    if (notifyValue[2] === "0") {
        let r = confirm("Are you sure you wanna notify for return of vehicle?");
        if (r === true) {
            $.ajax({
                type: 'POST',
                url: '/users/notifyBookingComplete',
                data: {
                    'reservation_id': reservation_id,
                    'vehicle_id': notifyValue[3],
                    'booking_hours': notifyValue[4]
                },
                success: function (data) {
                    alert(data.message);
                    getBookingHistory();
                }
            });
        } else {
            alert("Notification not sent");
        }
    } else {
        alert("Vehicle has already been returned.");
    }
}

function deletebooking(reservation_id, instance) {
    let date_of_booking = instance.closest("tr").childNodes[0].innerText;
    let time_of_booking = instance.closest("tr").childNodes[1].innerText;
    let final_date = new Date(date_of_booking + " " + time_of_booking);
    let currentDate = new Date();
    let hours = Math.abs(final_date - currentDate) / 36e5;
    if (final_date <= currentDate) {
        alert("Cannot cancel an old booking.");
    } else if (hours < 1 && final_date > currentDate) {
        alert("Time of cancellation has already passed");
    } else {
        let r = confirm("Are you sure you wanna cancel the booking");
        if (r === true) {
            $.ajax({
                type: 'DELETE',
                url: '/users/deleteBooking',
                data: {
                    'reservation_id': reservation_id
                },
                success: function (data) {
                    alert(data.message);
                    getBookingHistory();
                }
            });
        } else {
            alert("Thank you for not cancelling the booking with id " + reservation_id);
        }
    }
}

function terminateMembership() {
    let r = confirm("Are you sure you wanna cancel the membership");
    if (r === true) {
        $.ajax({
            type: 'DELETE',
            url: '/users/terminateMembership',
            data: {
                'user_id': userid
            },
            success: function (data) {
                if (data.message === "successful") {
                    alert("Your membership has been cancelled successfully");
                    window.location.href = "/login";
                } else {
                    alert(data.message);
                }
            }
        });
    } else {
        alert("Thanks for not cancelling the membership");
    }
}

function renewMembership() {
    let r = confirm("Are you sure you wanna renew the membership");
    if (r === true) {
        $.ajax({
            type: 'POST',
            url: '/users/renewMembership',
            data: {
                'user_id': userid
            },
            success: function (data) {
                if (data.message === "successful") {
                    alert("Your membership has been renewed successfully");
                } else {
                    alert(data.message);
                }
                getPaymentDetails();
            }
        });
    }
}

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}
