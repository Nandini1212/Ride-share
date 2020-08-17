function savePaymentDetails() {

    let membership_type = $("input:radio[name='optmembership']:checked").val();
    let cardnumber = $("#txtCardNumber").val();
    let dobCardmonth = $("#ddlCardmonth option:selected").text();
    let dobCardyear = $("#ddlCardyear option:selected").text();
    let cvv = $("#txtcvv").val();
    let car_holder_name = $("#txtname").val();

    if (cardnumber.trim() === "" ){
        $("#txtCardNumber").focus();
        return;
    }

    if (dobCardmonth.trim() === "Month" ){
        return;
    }

    if (dobCardyear.trim() === "Year" ){
        return;
    }

    if (cvv.trim() === "Month" ){
        $("#txtcvv").focus();
        return;
    }

    if (car_holder_name.trim() === "Year" ){
        $("#txtname").focus();
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/paymentInformation',
        data: {
            'membership_type': membership_type,
            'cardnumber': cardnumber,
            'card_expiry': dobCardmonth + "/" + dobCardyear,
            'cvv': cvv,
            'car_holder_name': car_holder_name,
            'userId': localStorage.getItem("userId")
        },
        success: function(output){
            if (output.message === "successful"){
                window.location.href = "/users";
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