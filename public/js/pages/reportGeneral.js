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
    init: function() {
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#reportGeneral').attr('class', 'active');
        // knockout management
        vm = new reportGeneralAPI.pageData();
        ko.applyBindings(vm);
        // combos
        $('#cmbClosures').select2(select2_languages[lang]);
        reportGeneralAPI.loadClosures();
        $('#btnPrintClosure').click(reportGeneralAPI.btnPrintClosure());
        // avoid sending form 
        $('#closureDetail-form').submit(function() {
            return false;
        });
        // combos
        $('#cmbPwStatus').select2(select2_languages[lang]);
        reportGeneralAPI.loadPwStatus();
        $('#btnPrintPwStatus').click(reportGeneralAPI.btnPrintPwStatus());
        // avoid sending form 
        $('#pwStatusDetail-form').submit(function() {
            return false;
        });
    },
    pageData: function() {
        var self = this;
        // closure combo
        self.optionsClosures = ko.observableArray([]);
        self.selectedClosures = ko.observableArray([]);
        self.sClosure = ko.observable();
        // pw status combo
        self.optionsPwStatus = ko.observableArray([]);
        self.selectedPwStatus = ko.observableArray([]);
        self.sPwStatus = ko.observable();
    },
    loadClosures: function(id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/closure/report_closures/?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function(data, status) {
                var options = [{ id: 0, name: " " }].concat(data);
                vm.optionsClosures(options);
                $("#cmbClosures").val([id]).trigger('change');
            },
            error: function(err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    btnPrintClosure: function() {
        var mf = function(e) {
            // avoid default accion
            e.preventDefault();
            var url = "", type = "";

            // fecth report data
            type = "GET";
            url = sprintf('%s/report/closure/%s/?api_key=%s', myconfig.apiUrl, vm.sClosure(), api_key);
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // process report data
                    aswReport.reportPDF(data, 'rJRclWCkx');
                },
                error: function(err) {
                    aswNotif.errAjax(err);
                    if (err.status == 401) {
                        window.open('index.html', '_self');
                    }
                }
            });
        }
        return mf;
    },
    loadPwStatus: function(id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/pw/report_pw/?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function(data, status) {
                var options = [{ id: 0, name: " " }].concat(data);
                vm.optionsPwStatus(options);
                $("#cmbPwStatus").val([id]).trigger('change');
            },
            error: function(err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    btnPrintPwStatus: function() {
        var mf = function(e) {
            // avoid default accion
            e.preventDefault();
            var url = "", type = "";

            // fecth report data
            type = "GET";
            url = sprintf('%s/report/pwR2/%s/?api_key=%s', myconfig.apiUrl, vm.sPwStatus(), api_key);
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(data, status) {
                    // process report data
                    aswReport.reportPDF(data, 'S12MqKVWl');
                },
                error: function(err) {
                    aswNotif.errAjax(err);
                    if (err.status == 401) {
                        window.open('index.html', '_self');
                    }
                }
            });
        }
        return mf;
    }


};

reportGeneralAPI.init();