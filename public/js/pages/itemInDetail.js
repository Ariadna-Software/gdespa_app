/*
 * itemIn.js
 * Function for the page itemIn.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')
var lang = aswCookies.getCookie('gdespa_lang');


var data = null;
var vm = null;

var itemInDetailAPI = {
    init: function () {
        aswInit.initPage();
        validator_languages(lang);
        datepicker_languages(lang);
        $('#user_name').text(user.name);
        // make active menu option
        $('#itemInGeneral').attr('class', 'active');
        // knockout management
        vm = new itemInDetailAPI.pageData();
        ko.applyBindings(vm);
        //
        $('#cmbWorkers').select2(select2_languages[lang]);
        itemInDetailAPI.loadWorkers();
        $('#cmbStores').select2(select2_languages[lang]);
        itemInDetailAPI.loadStores();        
        // buttons click events
        $('#btnOk').click(itemInDetailAPI.btnOk());
        $('#btnExit').click(function (e) {
            e.preventDefault();
            window.open('itemInGeneral.html', '_self');
        })
        // init lines table
        itemInLineAPI.init();
        // init modal form
        itemInModalAPI.init();
        // check if an id have been passed
        var id = aswUtil.gup('id');
        // if it is an update show lines
        if (id != 0) {
            $('#wid-id-1').show();
        }
        itemInDetailAPI.getItemIn(id);
    },
    pageData: function () {
        // knockout objects
        var self = this;
        self.id = ko.observable();
        self.dateIn = ko.observable();
        self.comments = ko.observable();
        self.deliveryNote = ko.observable();
        // worker combo
        self.optionsWorkers = ko.observableArray([]);
        self.selectedWorkers = ko.observableArray([]);
        self.sWorker = ko.observable();
        // store combo
        self.optionsStores = ko.observableArray([]);
        self.selectedStores = ko.observableArray([]);
        self.sStore = ko.observable();
        // -- Modal related
        self.lineId = ko.observable();
        self.quantity = ko.observable();
        // item combo
        self.optionsItems = ko.observableArray([]);
        self.selectedItems = ko.observableArray([]);
        self.sItem = ko.observable();
    },
    loadData: function (data) {
        vm.id(data.id);
        vm.dateIn(moment(data.datIn).format(i18n.t('util.date_format')));
        vm.comments(data.comments);
        vm.deliveryNote(data.deliveryNote);
        itemInDetailAPI.loadWorkers(data.worker.id);
        itemInDetailAPI.loadStores(data.store.id);
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#itemIn-form').validate({
            rules: {
                txtDateIn: { required: true },
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
        return $('#itemIn-form').valid();
    },
    // obtain a  wo group from the API
    getItemIn: function (id) {
        if (!id || (id == 0)) {
            // new wo group
            vm.id(0);
            return;
        }
        var url = sprintf("%s/item_in/%s?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                itemInDetailAPI.loadData(data[0]);
                itemInLineAPI.getItemInLines(data[0].id);
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
            if (!itemInDetailAPI.dataOk()) return;
            // dat for post or put
            var data = {
                id: vm.id(),
                dateIn: moment(vm.dateIn(), i18n.t('util.date_format')).format(i18n.t('util.date_iso')),
                worker: {
                    id: vm.sWorker()
                },
                store: {
                    id: vm.sStore()
                },
                comments: vm.comments(),
                deliveryNote: vm.deliveryNote()
            };
            var url = "", type = "";
            if (vm.id() == 0) {
                // creating new record
                type = "POST";
                url = sprintf('%s/item_in?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/item_in/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);
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
                        var url = sprintf('itemInGeneral.html?id=%s', data.id);
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
                    window.open('login.html', '_self');
                }
            }
        });
    }
};




