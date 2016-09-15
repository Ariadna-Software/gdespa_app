/*
 * pwDetail.js
 * Function for the page pwDetail.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')
var lang = aswCookies.getCookie('gdespa_lang');


var data = null;
var vm = null;

var pwDetailAPI = {
    init: function (r) {
        aswInit.initPage();
        validator_languages(lang);
        datepicker_languages(lang);
        // datepicker fields need a language format
        var v = i18n.t('util.date_format2');
        //
        $("#txtInitDate").datepicker({ dateFormat: 'dd/mm/yy' });
        $('#user_name').text(user.name);
        // make active menu option
        $('#pwGeneral').attr('class', 'active');
        // knockout management
        vm = new pwDetailAPI.pageData();
        ko.applyBindings(vm);
        // combos
        $('#cmbWorkers').select2(select2_languages[lang]);
        pwDetailAPI.loadWorkers();
        $('#cmbCompanies').select2(select2_languages[lang]);
        pwDetailAPI.loadCompanies();
        $('#cmbStatus').select2(select2_languages[lang]);
        pwDetailAPI.loadStatus();
        // buttons click events
        $('#btnOk').click(pwDetailAPI.btnOk());
        $('#btnExit').click(function (e) {
            e.preventDefault();
            window.open('pwGeneral.html', '_self');
        })
        // init lines table
        // pwLineAPI.init();
        // init modal form
        // pwModalAPI.init();
        // check if an id have been passed
        var id = aswUtil.gup('id');
        // if it is an update show lines
        if (id != 0) {
            $('#wid-id-1').show();
        }
        pwDetailAPI.getPw(id);
    },
    pageData: function () {
        // knockout objects
        var self = this;
        self.id = ko.observable();
        self.name = ko.observable();
        self.reference = ko.observable();
        self.description = ko.observable();
        self.initDate = ko.observable();
        self.initInCharge = ko.observable();
        self.companyId = ko.observable();
        self.defaultK = ko.observable();
        self.total = ko.observable();
        // status combo
        self.optionsStatus = ko.observableArray([]);
        self.selectedStatus = ko.observableArray([]);
        self.sStatus = ko.observable();
        // company combo
        self.optionsCompanies = ko.observableArray([]);
        self.selectedCompanies = ko.observableArray([]);
        self.sCompany = ko.observable();
        // worker combo
        self.optionsWorkers = ko.observableArray([]);
        self.selectedWorkers = ko.observableArray([]);
        self.sWorker = ko.observable();
        // -- Modal related
        self.lineId = ko.observable();
        self.line = ko.observable();
        self.quantity = ko.observable();
        // item combo
        self.optionsItems = ko.observableArray([]);
        self.selectedItems = ko.observableArray([]);
        self.sItem = ko.observable();
        // unit combo
        self.optionsUnits = ko.observableArray([]);
        self.selectedUnits = ko.observableArray([]);
        self.sUnit = ko.observable();
    },
    loadData: function (data) {
        vm.id(data.id);
        vm.name(data.name);
        vm.reference(data.reference);
        vm.description(data.description);
        vm.cost(data.cost);
        vm.image(data.image);
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#pwDetail-form').validate({
            rules: {
                txtName: { required: true },
                txtReference: { required: true },
                txtCost: {
                    required: true,
                    number: true
                }
            },
            // Messages for form validation
            messages: {
            },
            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#pwDetail-form').valid();
    },
    // obtain a  pw group from the API
    getPw: function (id) {
        if (!id || (id == 0)) {
            // new pw group
            vm.id(0);
            return;
        }
        var url = sprintf("%s/cunit/%s?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                pwDetailAPI.loadData(data[0]);
                // pwLineAPI.getPwLines(data[0].id);
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
            if (!pwDetailAPI.dataOk()) return;
            // dat for post or put
            var data = {
                id: vm.id(),
                name: vm.name(),
                reference: vm.reference(),
                description: vm.description(),
                image: vm.image(),
                cost: vm.cost()
            };
            var url = "", type = "";
            if (vm.id() == 0) {
                // creating new record
                type = "POST";
                url = sprintf('%s/cunit?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/cunit/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);
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
                    } else {
                        var url = sprintf('pwGeneral.html?id=%s', data.id);
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
    loadCompanies: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/company?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: 0, name: " " }].concat(data);
                vm.optionsCompanies(options);
                $("#cmbCompanies").val([id]).trigger('change');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('login.html', '_self');
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
                var options = [{ id: 0, name: " " }].concat(data);
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
    loadStatus: function (id) {
        var options = aswInit.getStatus();
        vm.optionsStatus(options);
        $("#cmbStatus").val([id]).trigger('change');
    }
};


pwDetailAPI.init();