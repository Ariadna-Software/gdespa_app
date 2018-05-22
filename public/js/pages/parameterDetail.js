/*
 * parameterDetail.js
 * Function for the page parameterDetail.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')
var lang = aswCookies.getCookie('gdespa_lang');


var data = null;
var vm = null;

var parameterDetailAPI = {
    init: function () {
        aswInit.initPage();
        validator_languages(lang);
        datepicker_languages(lang);
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#parameterDetail').attr('class', 'active');
        $('#cmbUcContaLum').select2(select2_languages[lang]);
        parameterDetailAPI.loadUcContaLum();
        // knockout management
        vm = new parameterDetailAPI.pageData();
        ko.applyBindings(vm);
        // buttons click events
        $('#btnOk').click(parameterDetailAPI.btnOk());
        $('#btnExit').click(function (e) {
            e.preventDefault();
            window.open('index2.html', '_self');
        })
        // check if an id have been passed
        var id = aswUtil.gup('id');
        parameterDetailAPI.getParameter(id);
    },
    pageData: function () {
        // knockout objects
        var self = this;
        self.id = ko.observable();
        self.parameterId = ko.observable();
        self.nEHD = ko.observable();
        self.nEHN = ko.observable();
        self.neEHD = ko.observable();
        self.neEHN = ko.observable();
        self.sNH = ko.observable();
        self.sEHD = ko.observable();
        self.sEHN = ko.observable();
        self.seEHD = ko.observable();
        self.seEHN = ko.observable();
        self.hNH = ko.observable();
        self.hEHD = ko.observable();
        self.hEHN = ko.observable();
        self.heEHD = ko.observable();
        self.heEHN = ko.observable();
        self.initControlDocs = ko.observable();
        // contalum
        self.optionsUcContaLum = ko.observableArray([]);
        self.selectedUcContaLum = ko.observableArray([]);
        self.sUcContaLum = ko.observable();

    },
    loadData: function (data) {
        vm.parameterId(data.parameterId);
        vm.nEHD(data.nEHD);
        vm.nEHN(data.nEHN);
        vm.neEHD(data.neEHD);
        vm.neEHN(data.neEHN);
        vm.sNH(data.sNH);
        vm.sEHD(data.sEHD);
        vm.sEHN(data.sEHN);
        vm.seEHD(data.seEHD);
        vm.seEHN(data.seEHN);
        vm.hNH(data.hNH);
        vm.hEHD(data.hEHD);
        vm.hEHN(data.hEHN);
        vm.heEHD(data.heEHD);
        vm.heEHN(data.heEHN);
        // carga contalum
        parameterDetailAPI.loadUcContaLum(data.ucContaLumId);
        vm.initControlDocs(moment(data.initControlDocs).format(i18n.t("util.date_format")));
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#parameterDetail-form').validate({
            rules: {
                txtInitControlDocs: { required: true }
            },
            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#parameterDetail-form').valid();
    },
    // obtain a  user group from the API
    getParameter: function (id) {
        var url = sprintf("%s/parameters/0?api_key=%s", myconfig.apiUrl, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                parameterDetailAPI.loadData(data[0]);
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
            if (!parameterDetailAPI.dataOk()) return;
            // dat for post or put
            var data = {
                parameterId: 0,
                nEHD: vm.nEHD(),
                nEHN: vm.nEHN(),
                neEHD: vm.neEHD(),
                neEHN: vm.neEHN(),
                sNH: vm.sNH,
                sEHD: vm.sEHD(),
                sEHN: vm.sEHN(),
                seEHD: vm.seEHD(),
                seEHN: vm.seEHN(),
                hNH: vm.hNH,
                hEHD: vm.hEHD(),
                hEHN: vm.hEHN(),
                heEHD: vm.heEHD(),
                heEHN: vm.heEHN(),
                initControlDocs: moment(vm.initControlDocs(), i18n.t("util.date_format")).format(i18n.t("util.date_iso")),
                ucContaLumId: vm.sUcContaLum()
            };
            var url = "", type = "";
            // updating record
            type = "PUT";
            url = sprintf('%s/parameters/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    window.open('index2.html', '_self');
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
    loadUcContaLum: function (cunitId, pwId) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/cunit/block/?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{
                    id: null,
                    name: ""
                }].concat(data);
                vm.optionsUcContaLum(options);
                $("#cmbUcContaLum").val([cunitId]).trigger('change');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
};
parameterDetailAPI.init();