/*
 * absDetail.js
 * Function for the page absDetail.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')
var lang = aswCookies.getCookie('gdespa_lang');


var data = null;
var vm = null;

var absDetailAPI = {
    init: function () {
        aswInit.initPage();
        validator_languages(lang);
        datepicker_languages(lang);
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#absGeneral').attr('class', 'active');
        // knockout management
        vm = new absDetailAPI.pageData();
        ko.applyBindings(vm);
        // buttons click events
        $('#btnOk').click(absDetailAPI.btnOk());
        $('#btnExit').click(function (e) {
            e.preventDefault();
            window.open('absGeneral.html', '_self');
        })
        $('#cmbWorkers').select2(select2_languages[lang]);
        absDetailAPI.loadWorkers();
        $('#cmbAbsTypes').select2(select2_languages[lang]);
        absDetailAPI.loadAbsTypes();
        // check if an id have been passed
        var id = aswUtil.gup('id');
        absDetailAPI.getHoliday(id);
    },
    pageData: function () {
        // knockout objects
        var self = this;
        self.id = ko.observable();
        self.comments = ko.observable();
        self.fromDate = ko.observable();
        self.toDate = ko.observable();
        // worker combo
        self.optionsWorkers = ko.observableArray([]);
        self.selectedWorkers = ko.observableArray([]);
        self.sWorker = ko.observable();

        // abs type combo
        self.optionsAbsTypes = ko.observableArray([]);
        self.selectedAbsTypes = ko.observableArray([]);
        self.sAbsType = ko.observable();
    },
    loadData: function (data) {
        vm.id(data.id);
        vm.comments(data.comments);
        vm.fromDate(moment(data.fromDateF).format(i18n.t('util.date_format')));
        vm.toDate(moment(data.toDateF).format(i18n.t('util.date_format')));
        absDetailAPI.loadWorkers(data.workerId);
        absDetailAPI.loadAbsTypes(data.absTypeId);
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#absDetail-form').validate({
            rules: {
                txtFromDate: { required: true },
                txtToDate: { required: true },
                cmbAbsTypes: { required: true },
                cmbWorkers: { required: true }
            },
            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#absDetail-form').valid();
    },
    // obtain a  user group from the API
    getHoliday: function (id) {
        if (!id || (id == 0)) {
            // new user group
            vm.id(0);
            return;
        }
        var url = sprintf("%s/abs/%s?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                absDetailAPI.loadData(data[0]);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    btnOk: function () {
        var mf = function (e) {
            // avoid default accion
            e.preventDefault();
            // validate form
            if (!absDetailAPI.dataOk()) return;
            // dat for post or put
            var data = {
                id: vm.id(),
                comments: vm.comments(),
                fromDate: moment(vm.fromDate(), i18n.t('util.date_format')).format(i18n.t('util.date_iso')),
                toDate: moment(vm.toDate(), i18n.t('util.date_format')).format(i18n.t('util.date_iso')),
                workerId: vm.sWorker(),
                absTypeId: vm.sAbsType()
            };
            var url = "", type = "";
            if (vm.id() == 0) {
                // creating new record
                type = "POST";
                url = sprintf('%s/abs?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/abs/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);
            }
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    window.open('absGeneral.html', '_self');
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
    loadAbsTypes: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/abs_type?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: null, name: "" }].concat(data);
                vm.optionsAbsTypes(options);
                $("#cmbAbsTypes").val([id]).trigger('change');

            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
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
                    window.open('index.html', '_self');
                }
            }
        });
    }
};
absDetailAPI.init();