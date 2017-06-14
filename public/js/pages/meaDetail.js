/*
 * meaDetail.js
 * Function for the page meaDetail.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')
var lang = aswCookies.getCookie('gdespa_lang');


var data = null;
var vm = null;

var meaDetailAPI = {
    init: function () {
        aswInit.initPage();
        validator_languages(lang);
        $('#mea_name').text(user.name);
        // make active menu option
        $('#meaGeneral').attr('class', 'active');
        // knockout management
        vm = new meaDetailAPI.pageData();
        ko.applyBindings(vm);

        $('#cmbMeaTypes').select2(select2_languages[lang]);
        meaDetailAPI.loadMeaTypes();         

        // buttons click events
        $('#btnOk').click(meaDetailAPI.btnOk());
        $('#btnExit').click(function (e) {
            e.preventDefault();
            window.open('meaGeneral.html', '_self');
        })
        // check if an id have been passed
        var id = aswUtil.gup('id');
        meaDetailAPI.getMea(id);

    },
    pageData: function () {
        // knockout objects
        var self = this;
        self.id = ko.observable();
        self.name = ko.observable();
        self.reference = ko.observable();
        self.cost = ko.observable();
        // mea type combo
        self.optionsMeaTypes = ko.observableArray([]);
        self.selectedMeaTypes = ko.observableArray([]);
        self.sMeaType = ko.observable();         
    },
    loadData: function (data) {
        vm.id(data.id);
        vm.name(data.name);
        vm.reference(data.reference);
        vm.cost(data.cost);
        meaDetailAPI.loadMeaTypes(data.meaTypeId);
        // show big name
        var html = sprintf('<strong>[%s]</strong>', vm.name());
        $('#meaName').html(html);
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#meaDetail-form').validate({
            rules: {
                txtName: { required: true },
                txtReference: { required: true },
                txtCost: {number: true},
                cmbMeaTypes: { required: true }
            },
            // Messages for form validation
            messages: {
            },
            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#meaDetail-form').valid();
    },
    // obtain a  mea group from the API
    getMea: function (id) {
        if (!id || (id == 0)) {
            // new mea group
            vm.id(0);
            return;
        }
        var url = sprintf("%s/mea/%s?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                meaDetailAPI.loadData(data[0]);
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
            if (!meaDetailAPI.dataOk()) return;
            // dat for post or put
            var data = {
                id: vm.id(),
                reference: vm.reference(),
                name: vm.name(),
                cost: vm.cost(),
                meaTypeId: vm.sMeaType()
            };
            var url = "", type = "";
            if (vm.id() == 0) {
                // creating new record
                type = "POST";
                url = sprintf('%s/mea?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/mea/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);
            }
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    var url = sprintf('meaGeneral.html?id=%s', data.id);
                    window.open(url, '_self');
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
    loadMeaTypes: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/mea_type?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: null, name: "" }].concat(data);
                vm.optionsMeaTypes(options);
                $("#cmbMeaTypes").val([id]).trigger('change');
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

meaDetailAPI.init();