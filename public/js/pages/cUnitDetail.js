/*
 * cUnitDetail.js
 * Function for the page cUnitDetail.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')
var lang = aswCookies.getCookie('gdespa_lang');


var data = null;
var vm = null;

var cUnitDetailAPI = {
    init: function () {
        aswInit.initPage();
        validator_languages(lang);
        $('#user_name').text(user.name);
        // make active menu option
        $('#cUnitGeneral').attr('class', 'active');
        // knockout management
        vm = new cUnitDetailAPI.pageData();
        ko.applyBindings(vm);
        // buttons click events
        $('#btnOk').click(cUnitDetailAPI.btnOk());
        $('#btnExit').click(function (e) {
            e.preventDefault();
            window.open('cUnitGeneral.html', '_self');
        })

        // check if an id have been passed
        var id = aswUtil.gup('id');
        cUnitDetailAPI.getCUnit(id);
    },
    pageData: function () {
        // knockout objects
        var self = this;
        self.id = ko.observable();
        self.name = ko.observable();
        self.reference = ko.observable();
        self.description = ko.observable();
        self.cost = ko.observable();
        self.image = ko.observable();
        // cUnit group combos
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
        $('#cUnitDetail-form').validate({
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
        return $('#cUnitDetail-form').valid();
    },
    // obtain a  cUnit group from the API
    getCUnit: function (id) {
        if (!id || (id == 0)) {
            // new cUnit group
            vm.id(0);
            return;
        }
        var url = sprintf("%s/cunit/%s?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                cUnitDetailAPI.loadData(data[0]);
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
            if (!cUnitDetailAPI.dataOk()) return;
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
                    var url = sprintf('cUnitGeneral.html?id=%s', data.id);
                    window.open(url, '_self');
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
    }
};

cUnitDetailAPI.init();