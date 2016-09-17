/*
 * woDetail.js
 * Function for the page woDetail.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')
var lang = aswCookies.getCookie('gdespa_lang');


var data = null;
var vm = null;

var woDetailAPI = {
    init: function () {
        aswInit.initPage();
        validator_languages(lang);
        datepicker_languages(lang);
        $('#user_name').text(user.name);
        // make active menu option
        $('#woGeneral').attr('class', 'active');
        // knockout management
        vm = new woDetailAPI.pageData();
        ko.applyBindings(vm);
        //
        $('#cmbWorkers').select2(select2_languages[lang]);
        woDetailAPI.loadWorkers();
        $('#cmbPws').select2(select2_languages[lang]);
        woDetailAPI.loadPws();
        // buttons click events
        $('#btnOk').click(woDetailAPI.btnOk());
        $('#btnExit').click(function (e) {
            e.preventDefault();
            window.open('woGeneral.html', '_self');
        })
        // init lines table
        woLineAPI.init();
        // init modal form
        woModalAPI.init();
        // check if an id have been passed
        var id = aswUtil.gup('id');
        // if it is an update show lines
        if (id != 0) {
            $('#wid-id-1').show();
        }
        woDetailAPI.getWo(id);
    },
    pageData: function () {
        // knockout objects
        var self = this;
        self.id = ko.observable();
        self.initDate = ko.observable();
        self.endDate = ko.observable();
        self.comments = ko.observable();
        // worker combo
        self.optionsWorkers = ko.observableArray([]);
        self.selectedWorkers = ko.observableArray([]);
        self.sWorker = ko.observable();
        // pw combo
        self.optionsPws = ko.observableArray([]);
        self.selectedPws = ko.observableArray([]);
        self.sPw = ko.observable();
        // -- Modal related
        self.lineId = ko.observable();
        self.estimate = ko.observable();
        self.done = ko.observable();
        self.quantity = ko.observable();
        // cunit combo
        self.optionsCUnits = ko.observableArray([]);
        self.selectedCUnits = ko.observableArray([]);
        self.sCUnit = ko.observable();
    },
    loadData: function (data) {
        vm.id(data.id);
        vm.initDate(moment(data.initDate).format(i18n.t('util.date_format')));
        vm.endDate(moment(data.endDate).format(i18n.t('util.date_format')));
        vm.comments(data.comments);
        woDetailAPI.loadPws(data.pw.id);
        woDetailAPI.loadWorkers(data.worker.id);
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#woDetail-form').validate({
            rules: {
                txtInitDate: { required: true },
                txtEndDate: { required: true },
                cmbWorkers: { required: true },
                cmbPws: { required: true },
            },
            // Messages for form validation
            messages: {
            },
            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#woDetail-form').valid();
    },
    // obtain a  wo group from the API
    getWo: function (id) {
        if (!id || (id == 0)) {
            // new wo group
            vm.id(0);
            return;
        }
        var url = sprintf("%s/wo/%s?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                woDetailAPI.loadData(data[0]);
                woLineAPI.getWoLines(data[0].id);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('login.html', '_self');
                }
            }
        });
    },
    btnOk: function () {
        var mf = function (e) {
            // avoid default accion
            e.preventDefault();
            // validate form
            if (!woDetailAPI.dataOk()) return;
            // dat for post or put
            var data = {
                id: vm.id(),
                initDate: moment(vm.initDate(), i18n.t('util.date_format')).format(i18n.t('util.date_iso')),
                endDate: moment(vm.endDate(), i18n.t('util.date_format')).format(i18n.t('util.date_iso')),
                worker: {
                    id: vm.sWorker()
                },
                pw: {
                    id: vm.sPw()
                },
                comments: vm.comments()
            };
            var url = "", type = "";
            if (vm.id() == 0) {
                // creating new record
                type = "POST";
                url = sprintf('%s/wo?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/wo/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);
            }
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    if (type == "POST") {
                        vm.id(data.id);
                        $('#wid-id-1').show();
                        aswNotif.newMainLines();
                    } else {
                        var url = sprintf('woGeneral.html?id=%s', data.id);
                        window.open(url, '_self');
                    }
                },
                error: function (err) {
                    aswNotif.errAjax(err);
                    if (err.status == 401) {
                        window.open('login.html', '_self');
                    }
                }
            });
        }
        return mf;
    },
    loadWorkers: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/worker?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: null, name: "" }].concat(data);
                vm.optionsWorkers(options);
                $("#cmbWorkers").val([id]).trigger('change');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('login.html', '_self');
                }
            }
        });
    },
    loadPws: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/pw?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: null, name: "" }].concat(data);
                vm.optionsPws(options);
                $("#cmbPws").val([id]).trigger('change');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('login.html', '_self');
                }
            }
        });
    }   
};




