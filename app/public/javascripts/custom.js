$('.message a').click(function(){
    $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});

// Toggle login and signup screen
function toggleWindow() {
    $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
}

// function for login button
function login (){

    let username = $("#txtUsername").val();
    let password = $("#txtPassword").val();

    if (username.trim() === "" ){
        $("#txtUsername").focus();
        return;
    }

    if (password.trim() === "" ){
        $("#txtPassword").focus();
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/login',
        data: {
            'username': username,
            'password': password
        },
        success: function(output){
            if (output.message === "successful"){
                localStorage.setItem("userId", output.data.userId);
                if (output.data.isAdmin === 0 || output.data.isAdmin === "0"){
                    window.location.href = "/users";
                }else {
                    window.location.href = "/admin/dashboard";
                }
            }else{
                alert(output.message);
            }
        }
    });
}