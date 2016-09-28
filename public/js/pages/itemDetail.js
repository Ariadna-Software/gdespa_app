/*
 * itemDetail.js
 * Function for the page itemDetail.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')
var lang = aswCookies.getCookie('gdespa_lang');


var data = null;
var vm = null;

var itemDetailAPI = {
    init: function () {
        aswInit.initPage();
        validator_languages(lang);
        $('#item_name').text(user.name);
        // make active menu option
        $('#itemGeneral').attr('class', 'active');
        // knockout management
        vm = new itemDetailAPI.pageData();
        ko.applyBindings(vm);
        // buttons click events
        $('#btnOk').click(itemDetailAPI.btnOk());
        $('#btnExit').click(function (e) {
            e.preventDefault();
            window.open('itemGeneral.html', '_self');
        })
        // combos
        $('#cmbUnits').select2(select2_languages[lang]);
        itemDetailAPI.loadUnits();
        // init stock table
        itemDetailAPI.initStoreTable();
        // check if an id have been passed
        var id = aswUtil.gup('id');
        itemDetailAPI.getItem(id);

    },
    pageData: function () {
        // knockout objects
        var self = this;
        self.id = ko.observable();
        self.name = ko.observable();
        self.reference = ko.observable();
        self.description = ko.observable();
        self.unitId = ko.observable();
        self.image = ko.observable();
        // item group combos
        self.optionsUnits = ko.observableArray([]);
        self.selectedUnits = ko.observableArray([]);
        self.sUnit = ko.observable();
        //
        self.ownItem = ko.observable();
        self.minStock = ko.observable();
    },
    loadData: function (data) {
        vm.id(data.id);
        vm.name(data.name);
        vm.reference(data.reference);
        vm.description(data.description);
        vm.unitId(data.unit.id);
        vm.image(data.image);
        itemDetailAPI.loadUnits(vm.unitId());
        vm.ownItem(data.ownItem);
        vm.minStock(data.minStock);
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#itemDetail-form').validate({
            rules: {
                txtName: { required: true },
                txtReference: { required: true },
                cmbUnits: { required: true },
                txtMinStock: { number: true }
            },
            // Messages for form validation
            messages: {
                cmbUnits: {
                    required: "Debe elegir un unidad"
                }
            },
            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#itemDetail-form').valid();
    },
    // obtain a  item group from the API
    getItem: function (id) {
        if (!id || (id == 0)) {
            // new item group
            vm.id(0);
            return;
        }
        var url = sprintf("%s/item/%s?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                itemDetailAPI.loadData(data[0]);
                itemDetailAPI.getStore(data[0].id);
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
            if (!itemDetailAPI.dataOk()) return;
            // dat for post or put
            var data = {
                id: vm.id(),
                name: vm.name(),
                reference: vm.reference(),
                description: vm.description(),
                image: vm.image(),
                unit: {
                    id: vm.sUnit()
                },
                ownItem: vm.ownItem(),
                minStock: vm.minStock()
            };
            var url = "", type = "";
            if (vm.id() == 0) {
                // creating new record
                type = "POST";
                url = sprintf('%s/item?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/item/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);
            }
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    var url = sprintf('itemGeneral.html?id=%s', data.id);
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
    loadUnits: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/unit?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: null, name: " " }].concat(data);
                vm.optionsUnits(options);
                $("#cmbUnits").val([id]).trigger('change');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    // TAB -- STORE
    initStoreTable: function () {
        var options = aswInit.initTableOptions('dt_store');
        options.data = data;
        options.columns = [{
            data: "store.name"
        }, {
                data: "stock"
            }];
        $('#dt_store').dataTable(options);
    },
    getStore: function (id) {
        var url = sprintf("%s/item_stock/item/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                itemDetailAPI.loadStore(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadStore: function (data) {
        var dt = $('#dt_store').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_store").show();
    }
};

itemDetailAPI.init();