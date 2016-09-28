/*
 * inventoryDetail.js
 * Function for the page inventoryDetail.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')
var lang = aswCookies.getCookie('gdespa_lang');


var data = null;
var vm = null;

var inventoryDetailAPI = {
    init: function () {
        aswInit.initPage();
        validator_languages(lang);
        datepicker_languages(lang);
        $('#user_name').text(user.name);
        // make active menu option
        $('#inventoryGeneral').attr('class', 'active');
        // knockout management
        vm = new inventoryDetailAPI.pageData();
        ko.applyBindings(vm);
        //
        $('#cmbStores').select2(select2_languages[lang]);
        inventoryDetailAPI.loadStores();
        $('#cmbWorkers').select2(select2_languages[lang]);
        inventoryDetailAPI.loadWorkers();
        // buttons click events
        $('#btnOk').click(inventoryDetailAPI.btnOk());
        $('#btnClose').click(inventoryDetailAPI.btnClose());
        $('#btnExit').click(function (e) {
            e.preventDefault();
            window.open('inventoryGeneral.html', '_self');
        })
        // init lines table
        inventoryLineAPI.init();
        // init modal form
        inventoryModalAPI.init();
        // check if an id have been passed
        var id = aswUtil.gup('id');
        // if it is an update show lines
        if (id != 0) {
            $('#wid-id-1').show();
        } else {
            //vm.inventoryDate(moment(new Date()).format(i18n.t('util.date_format')));
            vm.inventoryDate(moment(new Date()).format('DD/MM/YYYY'));
        }
        inventoryDetailAPI.getInventory(id);
    },
    pageData: function () {
        // knockout objects
        var self = this;
        self.id = ko.observable();
        self.inventoryDate = ko.observable();
        self.comments = ko.observable();
        // store combo
        self.optionsStores = ko.observableArray([]);
        self.selectedStores = ko.observableArray([]);
        self.sStore = ko.observable();
        // worker combo
        self.optionsWorkers = ko.observableArray([]);
        self.selectedWorkers = ko.observableArray([]);
        self.sWorker = ko.observable();
        self.close = ko.observable();
    },
    loadData: function (data) {
        vm.id(data.id);
        vm.inventoryDate(moment(data.inventoryDate).format(i18n.t('util.date_format')));
        vm.comments(data.comments);
        vm.close(data.close);
        inventoryDetailAPI.loadWorkers(data.worker.id);
        inventoryDetailAPI.loadStores(data.store.id);
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#inventoryDetail-form').validate({
            rules: {
                txtInventoryDate: { required: true },
                cmbWorkers: { required: true },
                cmbStores: { required: true }
            },
            // Messages for form validation
            messages: {
            },
            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#inventoryDetail-form').valid();
    },
    // obtain a  inventory group from the API
    getInventory: function (id) {
        if (!id || (id == 0)) {
            // new inventory group
            vm.id(0);
            return;
        }
        var url = sprintf("%s/inventory/%s?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                inventoryDetailAPI.loadData(data[0]);
                inventoryLineAPI.getInventoryLines(data[0].id);
                if (vm.close() != 0) {
                    $('#btnClose').hide();
                }
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
            if (!inventoryDetailAPI.dataOk()) return;
            // dat for post or put
            var data = {
                id: vm.id(),
                inventoryDate: moment(vm.inventoryDate(), i18n.t('util.date_format')).format(i18n.t('util.date_iso')),
                worker: {
                    id: vm.sWorker()
                },
                store:{
                    id: vm.sStore()
                },
                comments: vm.comments()
            };
            var url = "", type = "";
            if (vm.id() == 0) {
                // creating new record
                type = "POST";
                url = sprintf('%s/inventory?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/inventory/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);
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
                        aswNotif.newInventoryLines();
                        inventoryDetailAPI.getInventory(vm.id());
                    } else {
                        var url = sprintf('inventoryGeneral.html?id=%s', data.id);
                        window.open(url, '_self');
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
    },
    loadStores: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/store?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: null, name: "" }].concat(data);
                vm.optionsStores(options);
                $("#cmbStores").val([id]).trigger('change');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },    
    btnClose: function () {
        var mf = function (e) {
            // avoid default accion
            e.preventDefault();
            //
            if (vm.id() == 0) return;
            // validate form
            if (!inventoryDetailAPI.dataOk()) return;
            // dat for post or put
            var data = {
                id: vm.id(),
                inventoryDate: moment(vm.inventoryDate(), i18n.t('util.date_format')).format(i18n.t('util.date_iso')),
                worker: {
                    id: vm.sWorker()
                },
                comments: vm.comments(),
                close: 1
            };
            // updating record
            type = "PUT";
            url = sprintf('%s/inventory/close/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    var url = sprintf('inventoryGeneral.html?id=%s', data.id);
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
};




