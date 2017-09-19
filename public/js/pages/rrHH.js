/*
 * reportGeneral.js
 * Function for the page reportGeneral.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')
var lang = aswCookies.getCookie('gdespa_lang');


var data = null;
var vm = null;

var reportGeneralAPI = {
    init: function () {
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        validator_languages(lang);
        datepicker_languages(lang);
        // make active menu option
        $('#rrhh-report').attr('class', 'active');
        // knockout management
        vm = new reportGeneralAPI.pageData();
        ko.applyBindings(vm);
    },
    pageData: function () {
        var self = this;
    }


};

reportGeneralAPI.init();