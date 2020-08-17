function saveDriverInformation() {

    let country = $('#countries option:selected').text();
    let dl_number = $("#dlNumber").val();
    let dlExpiryMonth = $("#ddlExpirymonth option:selected").text();
    let dlExpiryYear = $("#ddlExpiryyear option:selected").text();
    let address = $("#txtaddress").val();
    let firstname = $("#txtfirstname").val();
    let lastname = $("#txtlastname").val();
    let dobday = $("#txtDobDay").val();
    let dobmonth = $("#txtDobMonth").val();
    let dobyear = $("#txtDobYear").val();

    if (country.trim() === "Country" ){
        alert("Please select the country");
        return;
    }

    if (dl_number.trim() === "" ){
        $("#dlNumber").focus();
        return;
    }

    if (dlExpiryMonth.trim() === "Month" ){
        return;
    }

    if (dlExpiryYear.trim() === "Year" ){
        return;
    }

    if (address.trim() === "" ){
        $("#txtaddress").focus();
        return;
    }

    if (firstname.trim() === "" ){
        $("#txtfirstname").focus();
        return;
    }

    if (lastname.trim() === "" ){
        $("#txtlastname").focus();
        return;
    }

    if (dobyear.trim() === "" ){
        $("#txtDobYear").focus();
        return;
    }

    if (dobmonth.trim() === "" ){
        $("#txtDobMonth").focus();
        return;
    }

    if (dobday.trim() === "" ){
        $("#txtDobDay").focus();
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/driverinformation',
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
        success: function(output){
            if (output.message === "successful"){
                window.location.href = "/payment";
            }
        }
    });
}

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}