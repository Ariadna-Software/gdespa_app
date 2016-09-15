/* ------------------------------------------------
 * asw.common.js
 * Some apis used in all pages
----------------------------------------------------*/

// table managment related
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};

/*
 * aswLanguage
 * api with function language related
*/
var aswLanguage = {
    changeLanguage: function (lg) {
        // change page language
        i18n.init({ lng: lg }, function (t) {
            $(".I18N").i18n();
        });
        var flag = "flag flag-es";
        var lgn = "ES";
        switch (lg) {
            case "en":
                flag = "flag flag-us";
                lgn = "EN";
                break;
            case "es-PA":
                flag = "flag flag-pa";
                lgn = "PA";
                break;
        };
        $('#language-flag').attr('class', flag);
        $('#language-abrv').text(lgn);
        validator_languages(lg);
        // numeral
        numeral.language(lg,numeral_languages[lg]);
        numeral.language(lg);
        // store language in cookie
        aswCookies.setCookie('gdespa_lang', lg);
    }
}

/*
 * aswCookies
 * to mannage cookies in the app
 * this funtions come from http://www.w3schools.com/js/js_cookies.asp
*/
var aswCookies = {
    are_cookies_enabled: function () {
        var cookieEnabled = (navigator.cookieEnabled) ? true : false;
        if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled) {
            document.cookie = "testcookie";
            cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false;
        }
        return (cookieEnabled);
    },
    setCookie: function (c_name, value, exdays) {
        if (!aswCookies.are_cookies_enabled()) {
            alert("NO COOKIES");
        }
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
        document.cookie = c_name + "=" + c_value;
    },
    deleteCookie: function (c_name) {
        if (!aswCookies.are_cookies_enabled()) {
            alert("NO COOKIES");
        }
        document.cookie = c_name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    },
    getCookie: function (c_name) {
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == c_name) {
                return unescape(y);
            }
        }
    }
}

/* 
 * aswNotification
 * An api to build and show messages
*/
var aswNotif = {
    errAjax: function (err) {
        var lg = i18n.lng();
        var ms = i18n.t('error.general');
        if (err.readyState == 0) {
            ms = i18n.t('error.ajax_general');
        }
        if (err.status == 401) {
            ms = i18n.t("error.authorization");
        }
        // Building html response
        var html = ms + "<hr/>"
        html += sprintf("<div><strong>readyState: </strong>%s</div>", err.readyState);
        if (err.responseText) {
            html += sprintf("<div><strong>responseText: </strong>%s</div>", err.responseText);
        }
        html += sprintf("<div><strong>status: </strong>%s</div>", err.status);
        html += sprintf("<div><strong>statusText: </strong>%s</div>", err.statusText);
        html += "<hr/>";
        html += sprintf("<div><small>%s</small></div>", i18n.t('error.close'));
        $.smallBox({
            title: "ERROR",
            content: html,
            color: "#C46A69",
            iconSmall: "fa fa-warning shake animated",
        });
    },
    errAjaxShort: function (err) {
        var lg = i18n.lng();
        var ms = i18n.t('error.general');
        if (err.readyState == 0) {
            ms = i18n.t('error.ajax_general');
        }
        if (err.status == 401) {
            ms = i18n.t("error.authorization");
        }
        // Building html response
        var html = ms
        html += sprintf("<div><small>%s</small></div>", i18n.t('error.close'));
        $.smallBox({
            title: "ERROR",
            content: html,
            color: "#C46A69",
            iconSmall: "fa fa-warning shake animated",
        });
    },
    deleteRecordQuestion: function (name, fn) {
        // mount message
        var msg = sprintf("%s %s ?", i18n.t('delete_warning'), name);
        var btn1 = sprintf("<a href='javascript:void(0);' onClick='%s' class='btn btn-warning btn-sm'>%s</a>", fn, i18n.t('yes'));
        var btn2 = sprintf("<a href='javascript:void(0);' class='btn btn-warning btn-sm'>%s</a>", i18n.t('no'));
        msg += sprintf("<p class='text-align-right'>%s %s</p>", btn1, btn2);
        $.smallBox({
            title: i18n.t('warning'),
            content: msg,
            color: "#C79121",
            //timeout: 8000,
            icon: "fa fa-bell swing animated"
        });
    }
}

/*
 * aswInit
 * Api witn init functions
*/

var aswInit = {
    // login.html initialization
    initLogin: function () {
        i18n.init({}, function (t) {
            $('.I18N').i18n();
        });
        var lng = i18n.lng();
        validator_languages(lng);
    },
    // general page initialization
    initPage: function () {
        // check if there's an user logged in 
        var user = aswCookies.getCookie('gdespa_user');
        var gdespa_lang = aswCookies.getCookie('gdespa_lang');
        if (!user) {
            window.open('login.html', '_self');
        }

        // i18next
        i18n.init({
        }, function (t) {
            $('.I18N').i18n();
        });

        // change language flag and abrv
        var lg = i18n.lng();
        if (gdespa_lang) {
            lg = gdespa_lang;
        }
        var flag = "flag flag-es";
        var lgn = "ES";
        switch (lg) {
            case "en":
                flag = "flag flag-us";
                lgn = "EN";
                break;
            case "es-PA":
                flag = "flag flag-pa";
                lgn = "PA";
                break;
        };
        $('#language-flag').attr('class', flag);
        $('#language-abrv').text(lgn);
        validator_languages(lgn);
    },
    // initTable
    // returns a common object to initialize tables
    initTableOptions: function (table) {
        // obtain language from cookies
        var lang = aswCookies.getCookie('gdespa_lang');
        var options = {
            "sDom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-12 hidden-xs'l>r>" +
            "t" +
            "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-xs-12 col-sm-6'p>>",
            "autoWidth": true,
            "preDrawCallback": function () {
                // Initialize the responsive datatables helper once.
                if (!responsiveHelper_dt_basic) {
                    responsiveHelper_dt_basic = new ResponsiveDatatablesHelper($('#' + table), breakpointDefinition);
                }
            },
            "rowCallback": function (nRow) {
                responsiveHelper_dt_basic.createExpandIcon(nRow);
            },
            "drawCallback": function (oSettings) {
                responsiveHelper_dt_basic.respond();
            },
            "language": datatable_languages[lang]
        };
        // change serach, it doesn't matter language
        options.language.search = '<span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span>';
        return options;
    }
}

/*
 * aswUtil
 * Some general utilities
*/

var aswUtil = {
    // gup stands from Get Url Parameters
    gup: function (name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.href);
        if (results === null)
            return "";
        else
            return results[1];
    }
}