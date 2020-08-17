function vPrice(){
var upPrice = document.getElementById("upPrice");
    if (upPrice.style.display === "none") {
        upPrice.style.display = "block";
    } else {
        upPrice.style.display = "none";
    }
}
function vFee(){
    var upFee = document.getElementById("upFee");
    if (upFee.style.display === "none") {
        upFee.style.display = "block";
    } else {
        upFee.style.display = "none";
    }

}
function vRegNum(){
    var upRegNum = document.getElementById("upRegNum");
    if (upRegNum.style.display === "none") {
        upRegNum.style.display = "block";
    } else {
        upRegNum.style.display = "none";
    }
}

function vServ(){
    var upServ = document.getElementById("upServ");
    if (upServ.style.display === "none") {
        upServ.style.display = "block";
    } else {
        upServ.style.display = "none";
    }
}
function vMile(){
    var upMile = document.getElementById("upMile");
    if (upMile.style.display === "none") {
        upMile.style.display = "block";
    } else {
        upMile.style.display = "none";
    }
}
function vName(){
    var upName = document.getElementById("upName");
    if (upName.style.display === "none") {
        upName.style.display = "block";
    } else {
        upName.style.display = "none";
    }
}
function vAddr(){
    var upAddr = document.getElementById("upAddr");
    if (upAddr.style.display === "none") {
        upAddr.style.display = "block";
    } else {
        upAddr.style.display = "none";
    }
}
function vCap(){
    var upCap = document.getElementById("upCap");
    if (upCap.style.display === "none") {
        upCap.style.display = "block";
    } else {
        upCap.style.display = "none";
    }
}

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
}

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    let charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function adminSignup() {
    let firstname = $("#txtAdminfirstname").val();
    let lastname = $("#txtAdminlastname").val();
    let email = $("#txtAdminSignUpEmailAddress").val();
    let username = $("#txtAdminSignUpUsername").val();
    let password = $("#txtAdminSignUpPassword").val();
    let phoneNumber = $("#txtAdminSignUpPhoneNumber").val();
    let adminDobDay = $("#txtadminDobDay").val();
    let adminDobMonth = $("#txtadminDobMonth").val();
    let adminDobYear = $("#txtadminDobYear").val();

    if (firstname.trim() === ""){
        $("#txtAdminfirstname").focus();
        return;
    }

    if (lastname.trim() === ""){
        $("#txtAdminlastname").focus();
        return;
    }

    if (email.trim() === "" ){
        $("#txtAdminSignUpEmailAddress").focus();
        return;
    }

    if (username.trim() === ""){
        $("#txtAdminSignUpUsername").focus();
        return;
    }

    if (password.trim() === ""){
        $("#txtAdminSignUpPassword").focus();
        return;
    }

    if (adminDobDay.trim() === ""){
        $("#txtadminDobDay").focus();
        return;
    }

    if (adminDobMonth.trim() === ""){
        $("#txtadminDobMonth").focus();
        return;
    }

    if (adminDobYear.trim() === ""){
        $("#txtadminDobYear").focus();
        return;
    }

    let emailRegex = '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}';
    let phoneRegex = '[0-9]{3}[0-9]{3}[0-9]{4}';

    let validateEmail = email.match(emailRegex);
    let validatePhoneNumber = phoneNumber.match(phoneRegex);

    if (validateEmail === null){
        alert("Please enter valid email id");
        $("#txtAdminSignUpEmailAddress").focus();
        return;
    }

    if (validatePhoneNumber === null || phoneNumber.length > 10){
        alert("Please enter valid phone number");
        $("#txtAdminSignUpPhoneNumber").focus();
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/admin/signup',
        data: {
            'firstName': firstname,
            'lastName': lastname,
            'email': email,
            'username': username,
            'password': password,
            'email': email,
            'phoneNumber': phoneNumber,
            'dob': adminDobDay + "/" + adminDobMonth + "/" + adminDobYear
        },
        success: function(output){
            if (output.message === "successful"){
                localStorage.setItem("userId", output.userId);
                window.location.href = "/admin/dashboard";
            }
        }
    });
}

function addNewRental(){
    let rentalname = $("#rentalname").val();
    let rentaladdress = $("#rentaladdress").val();
    let rentalcapacity = $("#rentalcapacity").val();
    console.log(rentalname);

    if (rentalname.trim() === "" ){
        $("#rentalname").focus();
        alert("Please enter Rental name");
        return;
    }
    if (rentaladdress.trim() === "" ){
        $("#rentaladdress").focus();
        alert("Please enter Rental location Address");
        return;
    }
    if (rentalcapacity === "" ){
        $("#rentalcapacity").focus();
        alert("Please enter Rental location Capacity");
        return;
    }
    if (rentalcapacity <= 0 ){
        $("#rentalcapacity").focus();
        alert("Please enter Rental location Capacity > 0");
        return;
    }
    $.ajax({
        type: 'POST',
        url: '/admin/addNewRental',
        data: {
            'rentalname': rentalname,
            'rentaladdress': rentaladdress,
            'rentalcapacity': rentalcapacity
        },
        success: function(output){
            if (output.message === "New rental location added"){
                alert(output.message);
                window.location.href = "/admin/managerental";
            }else{
                alert(output.message);
            }
        }
    });
}


function addNewVehicleType(){
    let vehicleType = $("#vehicleType").val();

    if (vehicleType.trim() === "" ){
        $("#vehicleType").focus();
        alert("Please enter Vehicle Type");
        return;
    }
    $.ajax({
        type: 'POST',
        url: '/admin/addNewVehicleType',
        data: {
            'vehicleType': vehicleType,

        },
        success: function(output){
            if (output.message === "New Vehicle Type added"){
                alert(output.message);
                window.location.href = "/admin/managevehicles";
            }else{
                alert(output.message);
            }
        }
    });

}
function getCurPrice(rangeOption){
    let vehTypeId = $("#vehTypeId").val();
    let range = $("#range").val();

    if(vehTypeId === ""){
        alert("Please Select Vehicle Type")
        $("#vehTypeId").focus()
        return;
    }
    if(range.trim() === ""){
        alert("Please select a range value");
        $("#range").focus();
    }
    $.ajax({
        type: 'GET',
        url: '/admin/getCurPrice',
        data: {
            'vehTypeId': vehTypeId,
            'range': range
        },
        success: function(output){

            $("#vPrice").val(output.price);
        }
    });
}
function terminateMembership(){
    let userid = $("#userid").val();

    if (userid.trim() === "" ){
        $("#userid").focus();
        alert("Please Select a user id");
        return;
    }
    $.ajax({
        type: 'POST',
        url: '/admin/terminateMembership',
        data: {
            'userid': userid,

        },
        success: function(output){
            if (output.message === "User Membership terminated"){
                alert(output.message);
                window.location.href = "/admin";
            }else{
                alert(output.message);
            }
        }
    });

}

function deleteuser(){
    let useridfordel = $("#useridfordel").val();

    if (useridfordel.trim() === "" ){
        $("#useridfordel").focus();
        alert("Please Select a user id");
        return;
    }
    $.ajax({
        type: 'POST',
        url: '/admin/deleteuser',
        data: {
            'useridfordel':useridfordel,

        },
        success: function(output){
            if (output.message === "User Deleted"){
                alert(output.message);
                window.location.href = "/admin";
            }else{
                alert(output.message);
            }
        }
    });

}
function deleteVehicle(){
    let vehId = $("#vehId").val();

    if (vehId.trim() === "" ){
        $("#vehId").focus();
        return;
    }
    var confirmation = confirm("Are you sure you want to delete this vehicle"+vehId+"?");
    if(confirmation){
        $.ajax({
            type: 'POST',
            url: '/admin/deleteVehicle',
            data: {
                'vehId': vehId,

            },
            success: function(output){
                if (output.message === "Vehicle Deleted"){
                    alert(output.message);
                    window.location.href = "/admin/managevehicles";
                }else{
                    alert(output.message);
                }
            }
        });
    }


}
function deleteRental(){
    let rentalLocId = $("#rentalLocId").val();

    if (rentalLocId.trim() === "" ){
        $("#rentalLocId").focus();
        return;
    }
    var confirmation = confirm("Are you sure you want to delete this rental location"+rentalLocId+"?");
    if(confirmation){
        $.ajax({
            type: 'POST',
            url: '/admin/deleteRental',
            data: {
                'rentalLocId': rentalLocId,

            },
            success: function(output){
                if (output.message === "Location Deleted"){
                    alert(output.message);
                    window.location.href = "/admin/managerental";
                }else{
                    alert(output.message);
                }
            }
        });
    }


}

function updateMemPrice(){
    let memPrice = $("#memPrice").val();
    let membershipName = $("#membershipName").val();

    if (membershipName.trim() === "" ){
        $("#membershipName").focus();
        alert("Please enter membership Name");
        return;
    }
    if (memPrice === "" ){
        $("#memPrice").focus();
        alert("Please enter membership price");
        return;
    }
    $.ajax({
        type: 'POST',
        url: '/admin/updateMemPrice',
        data: {
            'memPrice': memPrice,
            'membershipName': membershipName,

        },
        success: function(output){
            if (output.message === "Membership price updated"){
                alert(output.message);
                window.location.href = "/admin/managepricing";
            }else{
                alert(output.message);
            }
        }
    });

}


function addNewVehiclePrice(){
    let priceType = $("#priceType").val();
    let vehicleTypeId = $("#vehicleTypeId").val();
    console.log(vehicleTypeId);
    let vehiclePrice = $("#vehiclePrice").val();
    if (vehicleTypeId === "" ){
        $("#vehicleTypeId").focus();
        return;
    }
    if (vehiclePrice === "" ){
        $("#vehiclePrice").focus();
        alert("Please enter Vehicle Price");
        return;
    }
    if (priceType.trim() === "" ){
        $("#priceType").focus();
        alert("Please enter Price Type ");
        return;
    }
    $.ajax({
        type: 'POST',
        url: '/admin/addNewVehiclePrice',
        data: {
            'vehicleTypeId': vehicleTypeId,
            'vehiclePrice': vehiclePrice,
            'priceType': priceType

        },
        success: function(output){
            if (output.message === "New Vehicle Pricing added"){
                alert(output.message);
                window.location.href = "/admin/managepricing";
            }else{
                alert(output.message);
            }
        }
    });

}

function addNewVehicle(){
    let autoTypeId = $("#autoTypeId").val();
    let autoName = $("#autoName").val();

    let autoMake = $("#autoMake").val();
    let autoModel = $("#autoModel").val();
    let autoYear = $("#autoYear").val();

    let regNum = $("#regNum").val();
    let regNumexp = "[a-zA-Z0-9]{7}$";

    let validexp = regNum.match(regNumexp);
    let renLoc= $("#renLoc").val()
    let mileage = $("#mileage").val()
    let lastService= $("#lastService").val()

    if (autoTypeId === "" ){
        $("#autoTypeId").focus();
        return;
    }
    if (autoName.trim() === "" ){
        $("#autoName").focus();
        return;
    }
    if (autoMake.trim() === "" ){
        $("#autoMake").focus();
        return;
    }
    if (autoModel.trim() === "" ){
        $("#autoModel").focus();
        return;
    }
    if (autoYear.trim() === "" ){
        $("#autoYear").focus();
        return;
    }
    if (regNum.trim() === "" ){
        $("#regNum").focus();
        return;
    }
    if(validexp == null || regNum.length > 7){
        alert("Please enter valid registration number of length = 7");
        //window.location.href = "/admin/adminvehicles";
        return;
    }
    if (renLoc === "" ){
        $("#renLoc").focus();
        return;
    }
    if (mileage.trim() === "" ){
        $("#mileage").focus();
        return;
    }
    if (lastService.trim() === ""){
        $("#lastService").focus();
        return;
    }
    $.ajax({
        type: 'POST',
        url: '/admin/addNewVehicle',
        data: {
            'autoTypeId': autoTypeId,
            'autoName': autoName,
            'autoMake': autoMake,
            'autoModel': autoModel,
            'autoYear': autoYear,
            'regNum': regNum,
            'renLoc': renLoc,
            'mileage': mileage,
            'lastService': lastService
        },
        success: function(output){
            if (output.message === "New Vehicle added"){
                alert(output.message);
                window.location.href = "/admin/managevehicles";
            }else{
                alert(output.message);
            }
        }
    });

}
function updateVehPrice(){
    let vehTypeId = $("#vehTypeId").val();
    let vPrice = $("#vPrice").val();
    let range = $("#range").val();
    if (vehTypeId === "" ){
        $("#vehTypeId").focus();
        return;
    }
    if (vPrice === "" ){
        alert("Please enter vehicle price");
        $("#vPrice").focus();

        return;
    }
    if (range.trim() === "" ){
        alert("Please select a range of hours");
        $("#range").focus();

        return;
    }
    $.ajax({
        type: 'POST',
        url: '/admin/updateVehPrice',
        data: {
            'vehTypeId': vehTypeId,
            'vPrice': vPrice,
            'range': range,

        },
        success: function(output){
            if (output.message === "Vehicle price updated"){
                alert(output.message);
                window.location.href = "/admin/managepricing";
            }else{
                alert(output.message);
            }
        }
    });

}
function updateVehFee(){
    let vehTypeId = $("#vehTypeId").val();
    let vFee = $("#vFee").val();
    if (vehTypeId.trim() === "" ){
        $("#vehTypeId").focus();
        return;
    }
    if (vFee === "" ){
        alert("Please enter late return fee");
        $("#vFee").focus();

        return;
    }
    $.ajax({
        type: 'POST',
        url: '/admin/updateVehFee',
        data: {
            'vehTypeId': vehTypeId,
            'vFee': vFee,

        },
        success: function(output){
            if (output.message === "Vehicle late return fee updated"){
                alert(output.message);
                window.location.href = "/admin/managepricing";
            }else{
                alert(output.message);
            }
        }
    });

}

function updateVehMile(){
    let upVehicleId = $("#upVehicleId").val();
    let vMile = $("#vMile").val();
    if (upVehicleId.trim() === "" ){
        $("#upVehicleId").focus();
        return;
    }
    if (vMile.trim() === "" ){
        alert("Please enter mileage");
        $("#vMile").focus();

        return;
    }
    $.ajax({
        type: 'POST',
        url: '/admin/updateVehMile',
        data: {
            'upVehicleId': upVehicleId,
            'vMile': vMile,

        },
        success: function(output){
            if (output.message === "Vehicle mileage updated"){
                alert(output.message);
                window.location.href = "/admin/managevehicles";
            }else{
                alert(output.message);
            }
        }
    });

}

function updateVehServ(){
    let upVehicleId = $("#upVehicleId").val();
    let vServ = $("#vServ").val();
    console.log(vServ);
    if (upVehicleId.trim() === "" ){
        $("#upVehicleId").focus();
        return;
    }
    if (vServ.trim() === "" ){
        alert("Please enter last service");
        $("#vServ").focus();

        return;
    }
    $.ajax({
        type: 'POST',
        url: '/admin/updateVehServ',
        data: {
            'upVehicleId': upVehicleId,
            'vServ': vServ,

        },
        success: function(output){
            if (output.message === "Vehicle service updated"){
                alert(output.message);
                window.location.href = "/admin/managevehicles";
            }else{
                alert(output.message);
            }
        }
    });

}
function updateVehRegNum(){
    let upVehicleId = $("#upVehicleId").val();
    let vRegNum = $("#vRegNum").val();
    let regNumexp = "[a-zA-Z0-9]{7}$";

    let validexp = regNum.match(regNumexp);
    if(validexp == null || regNum.length > 7){
        alert("Please enter valid registration number of length = 7");
        $("#regNum").focus();
        return;
    }
    if (upVehicleId.trim() === "" ){
        $("#upVehicleId").focus();
        return;
    }
    if (vRegNum.trim() === "" ){
        alert("Please enter registration number");
        $("#vRegNum").focus();

        return;
    }
    $.ajax({
        type: 'POST',
        url: '/admin/updateVehRegNum',
        data: {
            'upVehicleId': upVehicleId,
            'vRegNum': vRegNum,

        },
        success: function(output){
            if (output.message === "Vehicle registration updated"){
                alert(output.message);
                window.location.href = "/admin/managevehicles";
            }else{
                alert(output.message);
            }
        }
    });

}

function updateRenName(){
    let upRentalId = $("#upRentalId").val();
    let vName = $("#vName").val();
    if (upRentalId.trim() === "" ){
        $("#upRentalId").focus();
        return;
    }
    if (vName.trim() === "" ){
        alert("Please enter name");
        $("#vName").focus();

        return;
    }
    $.ajax({
        type: 'POST',
        url: '/admin/updateRenName',
        data: {
            'upRentalId': upRentalId,
            'vName': vName,

        },
        success: function(output){
            if (output.message === "Location name updated"){
                alert(output.message);
                window.location.href = "/admin/managerental";
            }else{
                alert(output.message);
            }
        }
    });

}

function updateRenAddr(){
    let upRentalId = $("#upRentalId").val();
    let vAddr = $("#vAddr").val();
    if (upRentalId.trim() === "" ){
        $("#upRentalId").focus();
        return;
    }
    if (vAddr.trim() === "" ){
        alert("Please enter address");
        $("#vAddr").focus();

        return;
    }
    $.ajax({
        type: 'POST',
        url: '/admin/updateRenAddr',
        data: {
            'upRentalId': upRentalId,
            'vAddr': vAddr,

        },
        success: function(output){
            if (output.message === "Location address updated"){
                alert(output.message);
                window.location.href = "/admin/managerental";
            }else{
                alert(output.message);
            }
        }
    });

}

function updateRenCap(){
    let upRentalId = $("#upRentalId").val();
    let vCap = $("#vCap").val();
    if (upRentalId.trim() === "" ){
        $("#upRentalId").focus();
        return;
    }
    if (vCap === "" ){
        alert("Please enter capacity");
        $("#vCap").focus();

        return;
    }
    if(vCap <= 0){
        alert("Please enter capacity value > 0");
        $("#vCap").focus();
    }
    $.ajax({
        type: 'POST',
        url: '/admin/updateRenCap',
        data: {
            'upRentalId': upRentalId,
            'vCap': vCap,

        },
        success: function(output){
            if (output.message === "Location capacity updated"){
                alert(output.message);
                window.location.href = "/admin/managerental";
            }else{
                alert(output.message);
            }
        }
    });

}




function reassignVehicle(){
    let vehicleId = $("#vehicleId").val();
    let rentalLocationId = $("#rentalLocationId").val();
    if (vehicleId.trim() === "" ){
        $("#vehicleId").focus();
        return;
    }
    if (rentalLocationId.trim() === "" ){

        $("#rentalLocationId").focus();

        return;
    }
    $.ajax({
        type: 'POST',
        url: '/admin/reassignVehicle',
        data: {
            'vehicleId': vehicleId,
            'rentalLocationId': rentalLocationId,

        },
        success: function(output){
            if (output.message === "Vehicle Location Reaasigned"){
                alert(output.message);
                window.location.href = "/admin/managevehicles";
            }else{
                alert(output.message);
            }
        }
    });
}

function logout(){
    $.ajax({
        type: 'POST',
        url: '/logout',
        data: {
            'userId': localStorage.getItem('userId')
        },
        success: function (output) {
            window.location.href = "/login";
        }
    });
}
