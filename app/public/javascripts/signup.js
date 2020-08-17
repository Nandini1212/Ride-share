// function for sign button

function signup (){

    let username = $("#txtSignUpUsername").val();
    let password = $("#txtSignUpPassword").val();
    let email = $("#txtSignUpEmailAddress").val();
    let phoneNumber = $("#txtSignUpPhoneNumber").val();

    if (username.trim() === "" ){
        $("#txtSignUpUsername").focus();
        return;
    }

    if (password.trim() === "" ){
        $("#txtSignUpPassword").focus();
        return;
    }

    if (email.trim() === "" ){
        $("#txtSignUpEmailAddress").focus();
        return;
    }

    if (phoneNumber.trim() === "" ){
        $("#txtSignUpPhoneNumber").focus();
        return;
    }

    let emailRegex = '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}';
    let phoneRegex = '[0-9]{3}[0-9]{3}[0-9]{4}';

    let validateEmail = email.match(emailRegex);
    let validatePhoneNumber = phoneNumber.match(phoneRegex);

    if (validateEmail === null){
        alert("Please enter valid email id");
        $("#txtSignUpEmailAddress").focus();
        return;
    }

    if (validatePhoneNumber === null || phoneNumber.length > 10){
        alert("Please enter valid phone number");
        $("#txtSignUpPhoneNumber").focus();
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/signupUser',
        data: {
            'username': username,
            'password': password,
            'email': email,
            'phoneNumber': phoneNumber
        },
        success: function(output){
            if (output.message === "successful"){
                localStorage.setItem("userId", output.userId);
                window.location.href = "/driverinfo";
            }else {
                alert(output.message);
            }
        }
    });
}