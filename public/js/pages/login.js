/*
 * login.js
 * Functions related to login page
*/

// Internal API for login page
var loginAPI = {
    // Init the page
    init: function () {
        // avoid sending form 
        $('#login-form').submit(function () {
            return false;
        });
        // buttons click events 
        $('#btnLogin').click(loginAPI.loginClick);
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#login-form').validate({
            rules: {
                txtLogin: { required: true },
                txtPassword: { required: true }
            },
            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        //
        return $('#login-form').valid();
    },
    // When user clicks it's been verified
    loginClick: function () {
        // Validate form
        if (!loginAPI.dataOk()) return;
        // obtain user and password
        var login = $('#txtLogin').val();
        var password = $('#txtPassword').val();
        var url = sprintf("%s/login?login=%s&password=%s", myconfig.apiUrl, login, password);
        // check login
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                // save user and api_key in cookies
                aswCookies.setCookie('gdespa_user', JSON.stringify(data.user), 1);
                aswCookies.setCookie('api_key', data.api_key, 1);
                aswCookies.setCookie('gdespa_lang', data.user.lang)
                aswLanguage.changeLanguage(data.user.lang);
                window.open('index.html', '_self');
            },
            error: function (xhr, textStatus, errorThrwon) {
                aswNotif.errAjaxShort(xhr);
            }
        })
    }
};

loginAPI.init();


