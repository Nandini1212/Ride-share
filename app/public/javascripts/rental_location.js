$(function () {
    console.log("inside");
    $("#navHome").removeClass('active');
    $("#navBook").addClass('active');
    const searchBar = document.querySelector('input#search');
    const list = document.querySelector('ul#myList');
    searchBar.addEventListener("keyup", function (e) {
        const term = e.target.value.toLowerCase();
        const cars = list.getElementsByTagName('li');
        Array.from(cars).forEach(function (car) {
            const name = car.getElementsByClassName('btn-link')[0].innerHTML;
            if (name.toLowerCase().indexOf(term) === -1) {
                car.style.display = 'none';
            } else {
                car.style.display = 'block';
            }
        })
    })
});

function loadVehicles(id) {
    console.log("before ajax: ", vehicles)
    $.ajax({
        type: 'get',
        url: '/booking/locations/getVehicles',
        data: {
            'id': id
        },
        success: function (result) {

            console.log("vehicles: ", vehicles);
            $("#vehicles").html("");
            $("#vehicles").append(
                "<h4 style='margin-top: 30px;'> Cars: </h4>"
            )
            $.each(result, function (index, value) {
                $("#vehicles").append(
                    "<script type='text/javascript'> $('#form1" + index + "').submit(function (e) {e.preventDefault(); bookVehicle(" + index + ",e); });</script>" +
                    "<div class='card shadow p-3 mb-2 bg-white rounded'>" +
                    "<div class='row' style='width: 100%'>" +
                    "<div class='col-md-9'><p style='padding-left: 30px'>" + value.name + " " + value.model + " " + value.year + "</p></div>" +
                    "<div class='col-md-3'><a style='margin: 2px; width: 100%'  class='btn btn-primary' data-toggle='collapse' href='#collapseExample" + index + "' role=\"button\" aria-expanded=\"false\" aria-controls='collapseExample" + index + "'>Book</a></div>" +
                    "<div class=\"collapse\" id='collapseExample" + index + "'>" +
                    "<div class=\"card-body\">" +
                    "<form id='form1" + index + "' >" +
                    "<div style='border: 0px; width: 100%;' class=\"form-group\">" +
                    "<input style='display:none;' class=\"form-control\" name='vehicle_id' id='vehicle_id" + index + "' value='" + value.id + "'/>" +

                    "<input style='display:none;' class=\"form-control\" name='user_id' id='user_id" + index + "' value='" + localStorage.getItem('userId') + "'/>" +
                    "Enter the date and time of Pickup: <input type=\"datetime-local\" class=\"form-control\" name='datetime' id='time" + index + "' aria-describedby=\"emailHelp\" />" +
                    "Enter the length of stay(in hours): <input type='number' class='form-control' name='stay' id='stay" + index + "'/>" +

                    "<button style='float:right;' type='submit' id='sendform' class=\"btn btn-primary\">Submit</button>" +
                    "<p id='message" + index + "' style='display:none;margin-top: 50px;' class='alert alert-info'></p>" +
                    "</div>" +
                    "</form>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>"
                )
            })

        }
    });
}

function bookVehicle(index, e) {
    console.log("event ", e);
    console.log(document.getElementById("time" + index).value);
    $.ajax({
        type: 'post',
        url: '/booking/bookVehicle',
        data: {
            'id': document.getElementById("vehicle_id" + index).value,
            'user_id': document.getElementById("user_id" + index).value,
            'datetime': document.getElementById("time" + index).value,

            'stay': document.getElementById("stay" + index).value
        },
        success: function (result) {
            console.log("result", result);
            e.target.querySelector('p#message' + index).style.display = 'block';
            e.target.querySelector('p#message' + index).innerHTML = result;
            // e.target.elements[5].style.display = 'block';
            // e.target.elements[5].innerHTML = result;
            // document.getElementById("message" + index).style.display = 'block;'
            // document.getElementById("message" + index).innerHTML = result;
        }
    });
}




