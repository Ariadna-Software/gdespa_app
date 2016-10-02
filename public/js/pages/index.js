/*
 * index.js
 * Function for the page index.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));

var indexAPI = {
    init: function(){
        $('#user_name').text(user.name);
        if (user.login != "admin"){
            $('#administration').hide();
        }
        // make active menu option
        $('#index').attr('class', 'active');
    }
};

indexAPI.init();