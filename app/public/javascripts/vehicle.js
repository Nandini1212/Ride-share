$(function () {
    $("#navHome").removeClass('active');
    $("#navBook").addClass('active');
});


function handle(e) {
    if (!e) var e = window.event;
    console.log("target elements ", e.target.elements);
    e.preventDefault();
    $.ajax({
        type: 'post',
        url: '/booking/bookVehicle',
        data: {
            'id': e.target.elements[0].value,
            'user_id': localStorage.getItem("userId"),
            'datetime': e.target.elements[1].value,
            'stay': e.target.elements[2].value
        },
        success: function (result) {

            e.target.elements[3].disabled = true;
            e.target.querySelector('p').style.display = 'block';
            e.target.querySelector('p').innerHTML = result;
        }
    })
}

$(function () {
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

    var dtToday = new Date();

    var month = dtToday.getMonth() + 1;
    var day = dtToday.getDate();
    var year = dtToday.getFullYear();

    if (month < 10)
        month = '0' + month.toString();
    if (day < 10)
        day = '0' + day.toString();

    var minDate = year + '-' + month + '-' + day;

    let dates = document.getElementsByName("date")
    // console.log(dates)
    Array.from(dates).forEach(function (date) {
        date.min = minDate;
    })

    let stays = document.getElementsByName("stay");
    // console.log(stays)
    Array.from(stays).forEach(function (stay) {
        stay.max = 72;
    })
});

