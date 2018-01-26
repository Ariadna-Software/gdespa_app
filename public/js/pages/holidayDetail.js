/*
 * holidayDetail.js
 * Function for the page holidayDetail.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')
var lang = aswCookies.getCookie('gdespa_lang');


var data = null;
var vm = null;

var holidayDetailAPI = {
    init: function () {
        aswInit.initPage();
        validator_languages(lang);
        datepicker_languages(lang);
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#holidayGeneral').attr('class', 'active');
        // knockout management
        vm = new holidayDetailAPI.pageData();
        ko.applyBindings(vm);
        // buttons click events
        $('#btnOk').click(holidayDetailAPI.btnOk());
        $('#btnExit').click(function (e) {
            e.preventDefault();
            window.open('holidayGeneral.html', '_self');
        })
        $('#cmbDayTypes').select2(select2_languages[lang]);
        holidayDetailAPI.loadDayTypes();
        // check if an id have been passed
        var id = aswUtil.gup('id');
        holidayDetailAPI.getHoliday(id);
    },
    pageData: function () {
        // knockout objects
        var self = this;
        self.id = ko.observable();
        self.name = ko.observable();
        self.holidayDate = ko.observable();
        // day type combo
        self.optionsDayTypes = ko.observableArray([]);
        self.selectedDayTypes = ko.observableArray([]);
        self.sDayType = ko.observable();
    },
    loadData: function (data) {
        vm.id(data.id);
        vm.name(data.name);
        vm.holidayDate(moment(data.holidayDateF).format(i18n.t('util.date_format')));
        holidayDetailAPI.loadDayTypes(data.dayTypeId);
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#holidayDetail-form').validate({
            rules: {
                txtHoliDayDate: { required: true },
                txtName: { required: true },
                cmbDayTypes: { required: true }
            },
            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#holidayDetail-form').valid();
    },
    // obtain a  user group from the API
    getHoliday: function (id) {
        if (!id || (id == 0)) {
            // new user group
            vm.id(0);
            return;
        }
        var url = sprintf("%s/holiday/%s?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                holidayDetailAPI.loadData(data[0]);
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
            if (!holidayDetailAPI.dataOk()) return;
            // dat for post or put
            var data = {
                id: vm.id(),
                name: vm.name(),
                holidayDate: moment(vm.holidayDate(), i18n.t('util.date_format')).format(i18n.t('util.date_iso')),
                dayTypeId: vm.sDayType()
            };
            var url = "", type = "";
            if (vm.id() == 0) {
                // creating new record
                type = "POST";
                url = sprintf('%s/holiday?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/holiday/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);
            }
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    window.open('holidayGeneral.html', '_self');
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
    loadDayTypes: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/day_type?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: null, name: "" }].concat(data);
                vm.optionsDayTypes(options);
                if (id) {
                    $("#cmbDayTypes").val([id]).trigger('change');
                } else {
                    $("#cmbDayTypes").val([2]).trigger('change');
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
};
holidayDetailAPI.init();