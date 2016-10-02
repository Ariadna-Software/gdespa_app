/*
 * delivery.js
 * Function for the page delivery.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')
var lang = aswCookies.getCookie('gdespa_lang');


var data = null;
var vm = null;

var deliveryDetailAPI = {
    init: function () {
        aswInit.initPage();
        validator_languages(lang);
        datepicker_languages(lang);
        $('#user_name').text(user.name);
        if (user.login != "admin") {
            $('#administration').hide();
        }
        // make active menu option
        $('#deliveryGeneral').attr('class', 'active');
        // knockout management
        vm = new deliveryDetailAPI.pageData();
        ko.applyBindings(vm);
        //
        $('#cmbWorkers').select2(select2_languages[lang]);
        deliveryDetailAPI.loadWorkers();
        $('#cmbStores').select2(select2_languages[lang]);
        deliveryDetailAPI.loadStores();
        // buttons click events
        $('#btnOk').click(deliveryDetailAPI.btnOk());
        $('#btnDeliver').click(deliveryDetailAPI.btnDeliver());
        $('#btnPrint').click(deliveryDetailAPI.btnPrint());
        $('#btnDelete').click(deliveryDetailAPI.btnDelete());
        $('#btnExit').click(function (e) {
            e.preventDefault();
            window.open('deliveryGeneral.html', '_self');
        });
        // init lines table
        deliveryLineAPI.init();
        // init modal form
        deliveryModalAPI.init();
        // check if an id have been passed
        var id = aswUtil.gup('id');
        // if it is an update show lines
        if (id != 0) {
            $('#wid-id-1').show();
            $('#btnDeliver').show();
            $('#btnPrint').show();
            $('#btnDelete').show();
        } else {
            $('#btnDeliver').hide();
            $('#btnPrint').hide();
            $('#btnDelete').hide();
        }
        deliveryDetailAPI.getDelivery(id);
        //
        var pwId = aswUtil.gup('pwId');
        deliveryDetailAPI.getPw(pwId);
        vm.pwId(pwId);
    },
    pageData: function () {
        // knockout objects
        var self = this;
        self.id = ko.observable();
        self.lastDate = ko.observable();
        self.comments = ko.observable();
        self.pwId = ko.observable();
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
        self.estimate = ko.observable();
        self.done = ko.observable();
        self.quantity = ko.observable();
        // item combo
        self.optionsItems = ko.observableArray([]);
        self.selectedItems = ko.observableArray([]);
        self.sItem = ko.observable();
    },
    loadData: function (data) {
        vm.id(data.id);
        vm.lastDate(moment(data.lastDate).format(i18n.t('util.date_format')));
        vm.comments(data.comments);
        deliveryDetailAPI.loadWorkers(data.worker.id);
        deliveryDetailAPI.loadStores(data.store.id);
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        var options = {
            rules: {
                txtLastDate: { required: true },
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
        $('#delivery-form').validate(options);
        return $('#delivery-form').valid();
    },
    // obtain a  wo group from the API
    getDelivery: function (id) {
        if (!id || (id == 0)) {
            // new wo group
            vm.id(0);
            return;
        }
        var url = sprintf("%s/delivery/%s?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                deliveryDetailAPI.loadData(data[0]);
                deliveryLineAPI.getDeliveryLines(data[0].id);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    getPw: function (id) {
        if (!id || (id == 0)) {
            return;
        }
        var url = sprintf("%s/pw/%s?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var html = sprintf("<strong>[%s]</strong>", data[0].name);
                $("#pwname").html(html);
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
            if (!deliveryDetailAPI.dataOk()) return;
            // dat for post or put
            var data = {
                id: vm.id(),
                lastDate: moment(vm.lastDate(), i18n.t('util.date_format')).format(i18n.t('util.date_iso')),
                worker: {
                    id: vm.sWorker()
                },
                store: {
                    id: vm.sStore()
                },
                pw: {
                    id: vm.pwId()
                },
                comments: vm.comments()
            };
            var url = "", type = "";
            if (vm.id() == 0) {
                // creating new record
                type = "POST";
                url = sprintf('%s/delivery/generated/?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/delivery/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);
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
                        $('#btnDeliver').show();
                        $('#btnPrint').show();
                        $('#btnDelete').show();
                        aswNotif.newMainLines();
                        deliveryDetailAPI.getDelivery(data.id);
                    } else {
                        var url = sprintf('deliveryGeneral.html?id=%s', data.id);
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
    btnDeliver: function () {
        var mf = function (e) {
            // avoid default accion
            e.preventDefault();
            // validate form
            if (!deliveryDetailAPI.dataOk()) return;
            // dat for post or put
            var data = {
                id: vm.id(),
                lastDate: moment(vm.lastDate(), i18n.t('util.date_format')).format(i18n.t('util.date_iso')),
                pw: {
                    id: vm.pwId()
                },
                worker: {
                    id: vm.sWorker()
                },
                store: {
                    id: vm.sStore()
                },
                comments: vm.comments()
            };
            var url = "", type = "";

            // updating record
            type = "PUT";
            url = sprintf('%s/delivery/serve/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);

            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    vm.id(data.id);
                    $('#wid-id-1').show();
                    aswNotif.newServeLines();
                    deliveryDetailAPI.getDelivery(data.id);
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
    btnPrint: function () {
        var mf = function (e) {
            // avoid default accion
            e.preventDefault();
            // validate form
            if (!deliveryDetailAPI.dataOk()) return;
            var url = "", type = "";

            // fecth report data
            type = "GET";
            url = sprintf('%s/report/delivery/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);

            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // process report data
                    aswReport.reportPDF(data, 'rJj0N7WT');
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
    btnDelete: function () {
        mf = function () {
            var url = sprintf("%s/delivery/%s/?api_key=%s", myconfig.apiUrl, vm.id(), api_key);
            $.ajax({
                type: "GET",
                url: url,
                contentType: "application/json",
                success: function (data, status) {
                    var name = i18n.t('deliveryDetail.worker') + ": " + data[0].worker.name;
                    name += " " + i18n.t('deliveryDetail.store') + ": " + data[0].store.name
                    var fn = sprintf('deliveryDetailAPI.deleteDelivery(%s);', vm.id());
                    aswNotif.deleteRecordQuestion(name, fn);
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
    }
    ,
    deleteDelivery: function (id) {
        var url = sprintf("%s/delivery/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                window.open('deliveryGeneral.html', '_self');
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




