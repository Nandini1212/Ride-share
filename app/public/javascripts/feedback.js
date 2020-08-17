let userid = localStorage.getItem('userId');
$(function () {
    $("#navHome").removeClass('active');
    $("#navFeedback").addClass('active');
    getBookings();
});

function getBookings() {
    $.ajax({
        type: 'GET',
        url: '/feedback/getBookingForFeedback/' + userid,
        success: function(output){
            if (output) {
                let html = "";
                if (output.result){
                    output.result.forEach(function (item) {
                        html += "<option value='" + item.booking_id + "'>" + item.reservation_details + "</option>";
                    });
                }

                $("#ddlUserReservations").html(html);
            }
        }
    });
}

function saveFeedback() {
    let experience = $("input:radio[name='experience']:checked").val();
    let car_condition = $("input:radio[name='carcondition']:checked").val();
    let comment = $("#comments").val();
    let reservation_Id = $("#ddlUserReservations option:selected").val();

    if (reservation_Id === undefined || reservation_Id === ""){
        alert("Cannot submit feedback with out proper selection of reservation");
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/feedback/saveFeedback',
        data: {
            'userid': userid,
            'experience': experience,
            'car_condition': car_condition,
            'comments': comment,
            'reservation_id': reservation_Id
        },
        success: function(output){
            if (output) {
                if (output.message === "successful"){
                    alert("feedback updated successfully.");
                    window.location.href = "/users";
                }else{
                    alert(output.message);
                }
            }
        }
    });
}