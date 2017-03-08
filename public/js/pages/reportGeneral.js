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
        $('#reportGeneral').attr('class', 'active');
        // knockout management
        vm = new reportGeneralAPI.pageData();
        ko.applyBindings(vm);
        // combos
        $('#cmbWorkers').select2(select2_languages[lang]);
        reportGeneralAPI.loadWorkers();        
        $('#btnPrintWorker').click(reportGeneralAPI.btnPrintWorker());
       
        $('#cmbClosures').select2(select2_languages[lang]);
        reportGeneralAPI.loadClosures();
        $('#btnPrintClosure').click(reportGeneralAPI.btnPrintClosure());
        // avoid sending form 
        $('#closureDetail-form').submit(function () {
            return false;
        });
        // combos
        $('#cmbPwStatus').select2(select2_languages[lang]);
        reportGeneralAPI.loadPwStatus();
        $('#btnPrintPwStatus').click(reportGeneralAPI.btnPrintPwStatus());
        // avoid sending form 
        $('#pwStatusDetail-form').submit(function () {
            return false;
        });
        // combos
        $('#cmbPwConsume').select2(select2_languages[lang]);
        reportGeneralAPI.loadPwConsume();
        $('#btnPrintPwConsume').click(reportGeneralAPI.btnPrintPwConsume());
        // avoid sending form 
        $('#pwConsumeDetail-form').submit(function () {
            return false;
        });
        // combos
        $('#cmbPwStore').select2(select2_languages[lang]);
        reportGeneralAPI.loadPwStore();
        $('#btnPrintPwStore').click(reportGeneralAPI.btnPrintPwStore());
        // avoid sending form 
        $('#pwStoreDetail-form').submit(function () {
            return false;
        });
        // combos
        $('#cmbPwStore2').select2(select2_languages[lang]);
        reportGeneralAPI.loadPwStore2();
        $('#cmbPwItem').select2(select2_languages[lang]);
        reportGeneralAPI.loadPwItem();
        $('#btnPrintPwItem').click(reportGeneralAPI.btnPrintPwItem());
        // avoid sending form 
        $('#pwItemDetail-form').submit(function () {
            return false;
        });
    },
    pageData: function () {
        var self = this;
        self.initDate = ko.observable();
        self.endDate = ko.observable();
        // worker combo
        self.optionsWorkers = ko.observableArray([]);
        self.selectedWorkers = ko.observableArray([]);
        self.sWorker = ko.observable();
        // closure combo
        self.optionsClosures = ko.observableArray([]);
        self.selectedClosures = ko.observableArray([]);
        self.sClosure = ko.observable();
        // pw status combo
        self.optionsPwStatus = ko.observableArray([]);
        self.selectedPwStatus = ko.observableArray([]);
        self.sPwStatus = ko.observable();
        // pw consume combo
        self.optionsPwConsume = ko.observableArray([]);
        self.selectedPwConsume = ko.observableArray([]);
        self.sPwConsume = ko.observable();
        // pw store combo
        self.optionsPwStore = ko.observableArray([]);
        self.selectedPwStore = ko.observableArray([]);
        self.sPwStore = ko.observable();
        // pw store item
        self.optionsPwStore2 = ko.observableArray([]);
        self.selectedPwStore2 = ko.observableArray([]);
        self.sPwStore2 = ko.observable();
        self.optionsPwItem = ko.observableArray([]);
        self.selectedPwItem = ko.observableArray([]);
        self.sPwItem = ko.observable();

    },
    loadWorkers: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/worker/?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: 0, name: "--- TODOS -----" }].concat(data);
                vm.optionsWorkers(options);
                $("#cmbWorkers").val([id]).trigger('change');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },    
    loadClosures: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/closure/report_closures/?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: 0, name: " " }].concat(data);
                vm.optionsClosures(options);
                $("#cmbClosures").val([id]).trigger('change');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    btnPrintWorker: function () {
        var mf = function (e) {
            // avoid default accion
            e.preventDefault();
            var url = "", type = "";

            // fecth report data
            type = "GET";
            // http://localhost:5080/api/report/worker-hours/2017-02-01/2017-02-28/0?api_key=5jJHv
            var initDate = moment(vm.initDate(), "DD/MM/YYYY").format('YYYY-MM-DD');
            var endDate = moment(vm.endDate(), "DD/MM/YYYY").format('YYYY-MM-DD');
            url = sprintf('%s/report/worker-hours/%s/%s/%s?api_key=%s', myconfig.apiUrl, initDate, endDate, vm.sWorker(), api_key);
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // process report data
                    aswReport.reportPDF(data, 'Hkwmbrp9x');
                },
                error: function (err) {
                    aswNotif.errAjax(err);
                    if (err.status == 401) {
                        window.open('index.html', '_self');
                    }
                }
            });
        }
        return mf;
    },    
    btnPrintClosure: function () {
        var mf = function (e) {
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
                success: function (data, status) {
                    // process report data
                    aswReport.reportPDF(data, 'rJRclWCkx');
                },
                error: function (err) {
                    aswNotif.errAjax(err);
                    if (err.status == 401) {
                        window.open('index.html', '_self');
                    }
                }
            });
        }
        return mf;
    },
    loadPwStatus: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/pw/report_pw/?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: 0, name: " " }].concat(data);
                vm.optionsPwStatus(options);
                $("#cmbPwStatus").val([id]).trigger('change');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    btnPrintPwStatus: function () {
        var mf = function (e) {
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
                success: function (data, status) {
                    // process report data
                    aswReport.reportPDF(data, 'S12MqKVWl');
                },
                error: function (err) {
                    aswNotif.errAjax(err);
                    if (err.status == 401) {
                        window.open('index.html', '_self');
                    }
                }
            });
        }
        return mf;
    },
    loadPwConsume: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/pw/report_pw/?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: 0, name: " " }].concat(data);
                vm.optionsPwConsume(options);
                $("#cmbPwConsume").val([id]).trigger('change');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    btnPrintPwConsume: function () {
        var mf = function (e) {
            // avoid default accion
            e.preventDefault();
            var url = "", type = "";

            // fecth report data
            type = "GET";
            url = sprintf('%s/report/pwR3/%s/?api_key=%s', myconfig.apiUrl, vm.sPwConsume(), api_key);
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // process report data
                    aswReport.reportPDF(data, 'By-R2R4Wl');
                },
                error: function (err) {
                    aswNotif.errAjax(err);
                    if (err.status == 401) {
                        window.open('index.html', '_self');
                    }
                }
            });
        }
        return mf;
    },
    loadPwStore: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/store/?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: 0, name: " " }].concat(data);
                vm.optionsPwStore(options);
                $("#cmbPwStore").val([id]).trigger('change');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    btnPrintPwStore: function () {
        var mf = function (e) {
            // avoid default accion
            e.preventDefault();
            var url = "", type = "";

            // fecth report data
            type = "GET";
            url = sprintf('%s/report/store/%s/?api_key=%s', myconfig.apiUrl, vm.sPwConsume(), api_key);
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // process report data
                    aswReport.reportPDF(data, 'SyaBYZwbg');
                },
                error: function (err) {
                    aswNotif.errAjax(err);
                    if (err.status == 401) {
                        window.open('index.html', '_self');
                    }
                }
            });
        }
        return mf;
    },
    loadPwStore2: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/store/?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: 0, name: " " }].concat(data);
                vm.optionsPwStore2(options);
                $("#cmbPwStore2").val([id]).trigger('change');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadPwItem: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/item/?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: 0, name: " " }].concat(data);
                vm.optionsPwItem(options);
                $("#cmbPwItem").val([id]).trigger('change');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    btnPrintPwItem: function () {
        var mf = function (e) {
            // avoid default accion
            e.preventDefault();
            var url = "", type = "";
            // validate
            $('#pwItemDetail-form').validate({
                rules: {
                    cmbPwItem: { required: true },
                    cmbPwStore2: { required: true }
                },
                // Messages for form validation
                messages: {
                },
                // Do not change code below
                errorPlacement: function (error, element) {
                    error.insertAfter(element.parent());
                }
            });
            if (!$('#pwItemDetail-form').valid()) {
                return;
            }
            // fecth report data
            type = "GET";
            url = sprintf('%s/report/item/%s/%s/?api_key=%s', myconfig.apiUrl, vm.sPwItem(), vm.sPwStore2(), api_key);
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // process report data
                    if (!data) {
                        aswNotif.generalMessage(i18n.t('no_movement'));
                    } else {
                        aswReport.reportPDF(data, 'r1dPvIP-x');
                    }
                },
                error: function (err) {
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