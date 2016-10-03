/*
 * itemOut.js
 * Function for the page itemOut.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')
var lang = aswCookies.getCookie('gdespa_lang');


var data = null;
var vm = null;

var itemOutDetailAPI = {
    init: function () {
        aswInit.initPage();
        validator_languages(lang);
        datepicker_languages(lang);
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#itemOutGeneral').attr('class', 'active');
        // knockout management
        vm = new itemOutDetailAPI.pageData();
        ko.applyBindings(vm);
        //
        $('#cmbWorkers').select2(select2_languages[lang]);
        itemOutDetailAPI.loadWorkers();
        if (user.worker){
            itemOutDetailAPI.loadWorkers(user.worker.id);
        }        
        $('#cmbStores').select2(select2_languages[lang]);
        itemOutDetailAPI.loadStores();
        $('#cmbPws').select2(select2_languages[lang]);
        itemOutDetailAPI.loadPws();
        // buttons click events
        $('#btnOk').click(itemOutDetailAPI.btnOk());
        $('#btnExit').click(function (e) {
            e.preventDefault();
            window.open('itemOutGeneral.html', '_self');
        })
        // init lines table
        itemOutLineAPI.init();
        // init modal form
        itemOutModalAPI.init();
        // check if an id have been passed
        var id = aswUtil.gup('id');
        // if it is an update show lines
        if (id != 0) {
            $('#wid-id-1').show();
        }
        itemOutDetailAPI.getItemIn(id);
    },
    pageData: function () {
        // knockout objects
        var self = this;
        self.id = ko.observable();
        self.dateOut = ko.observable();
        self.comments = ko.observable();
        // worker combo
        self.optionsWorkers = ko.observableArray([]);
        self.selectedWorkers = ko.observableArray([]);
        self.sWorker = ko.observable();
        // store combo
        self.optionsStores = ko.observableArray([]);
        self.selectedStores = ko.observableArray([]);
        self.sStore = ko.observable();
        // pw combo
        self.optionsPws = ko.observableArray([]);
        self.selectedPws = ko.observableArray([]);
        self.sPw = ko.observable();
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
        vm.dateOut(moment(data.datIn).format(i18n.t('util.date_format')));
        vm.comments(data.comments);
        itemOutDetailAPI.loadWorkers(data.worker.id);
        itemOutDetailAPI.loadStores(data.store.id);
        itemOutDetailAPI.loadPws(data.pw.id);
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        var options = {
            rules: {
                txtDateOut: { required: true },
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
        };
        if ($('#chkGenerated').is(':checked')){
            options.rules.cmbPws = { required: true};
            options.messages.cmbPws = {required: i18n.t("itemOutDetail.pw_required")};
        }
        $('#itemOut-form').validate(options);
        return $('#itemOut-form').valid();
    },
    // obtain a  wo group from the API
    getItemIn: function (id) {
        if (!id || (id == 0)) {
            // new wo group
            vm.id(0);
            return;
        }
        var url = sprintf("%s/item_out/%s?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                itemOutDetailAPI.loadData(data[0]);
                itemOutLineAPI.getItemOutLines(data[0].id);
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
            if (!itemOutDetailAPI.dataOk()) return;
            // dat for post or put
            var data = {
                id: vm.id(),
                dateOut: moment(vm.dateOut(), i18n.t('util.date_format')).format(i18n.t('util.date_iso')),
                worker: {
                    id: vm.sWorker()
                },
                store: {
                    id: vm.sStore()
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
                url = sprintf('%s/item_out?api_key=%s', myconfig.apiUrl, api_key);
                if ($('#chkGenerated').is(':checked')){
                    url = sprintf('%s/item_out/generated/?api_key=%s', myconfig.apiUrl, api_key);
                }
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/item_out/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);
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
                        itemOutDetailAPI.getItemIn(data.id);
                    } else {
                        var url = sprintf('itemOutGeneral.html?id=%s', data.id);
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
                    window.open('index.html', '_self');
                }
            }
        });
    }
};




