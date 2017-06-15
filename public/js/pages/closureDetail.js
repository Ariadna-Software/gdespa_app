/*
 * closureDetail.js
 * Function for the page closureDetail.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')
var lang = aswCookies.getCookie('gdespa_lang');


var data = null;
var vm = null;

var closureDetailAPI = {
    init: function () {
        aswInit.initPage();
        validator_languages(lang);
        datepicker_languages(lang);
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#closureGeneral').attr('class', 'active');
        // knockout management
        vm = new closureDetailAPI.pageData();
        ko.applyBindings(vm);
        //
        $('#cmbWorkers').select2(select2_languages[lang]);
        closureDetailAPI.loadWorkers();
        if (user.worker) {
            closureDetailAPI.loadWorkers(user.worker.id);
        }
        // buttons click events
        $('#btnOk').click(closureDetailAPI.btnOk());
        $('#btnClose').click(closureDetailAPI.btnCloseMessage());
        $('#btnExit').click(function (e) {
            e.preventDefault();
            window.open('closureGeneral.html', '_self');
        });
        $('#btnPrint').click(closureDetailAPI.btnPrint());
        // avoid sending form 
        $('#closureDetail-form').submit(function () {
            return false;
        });
        // init lines table
        closureLineAPI.init();
        // init modal form
        closureModalAPI.init();
        // 
        closureDetailAPI.initWoTable();
        closureDetailAPI.initMoTable();
        // check if an id have been passed
        var id = aswUtil.gup('id');
        // if it is an update show lines
        if (id != 0) {
            $('#wid-id-1').show();
        } else {
            //vm.closureDate(moment(new Date()).format(i18n.t('util.date_format')));
            vm.closureDate(moment(new Date()).format('DD/MM/YYYY'));
        }
        closureDetailAPI.getClosure(id);
    },
    pageData: function () {
        // knockout objects
        var self = this;
        self.id = ko.observable();
        self.closureDate = ko.observable();
        self.comments = ko.observable();
        self.close = ko.observable();
        // worker combo
        self.optionsWorkers = ko.observableArray([]);
        self.selectedWorkers = ko.observableArray([]);
        self.sWorker = ko.observable();
        // -- Modal related
        self.lineId = ko.observable();
        self.estimate = ko.observable();
        self.done = ko.observable();
        // pw combo
        self.optionsPws = ko.observableArray([]);
        self.selectedPws = ko.observableArray([]);
        self.sPw = ko.observable();
        // init date 
    },
    loadData: function (data) {
        vm.id(data.id);
        vm.closureDate(moment(data.closureDate).format(i18n.t('util.date_format')));
        vm.comments(data.comments);
        vm.close(data.close);
        closureDetailAPI.loadWorkers(data.worker.id);
        closureDetailAPI.getWo(data.id);
        closureDetailAPI.getMo(data.id, data.worker.id);
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#closureDetail-form').validate({
            rules: {
                txtClosureDate: { required: true },
                cmbWorkers: { required: true }
            },
            // Messages for form validation
            messages: {
            },
            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#closureDetail-form').valid();
    },
    // obtain a  closure group from the API
    getClosure: function (id) {
        if (!id || (id == 0)) {
            // new closure group
            vm.id(0);
            return;
        }
        var url = sprintf("%s/closure/%s?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                closureDetailAPI.loadData(data[0]);
                closureLineAPI.getClosureLines(data[0].id);
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
            if (!closureDetailAPI.dataOk()) return;
            // dat for post or put
            var data = {
                id: vm.id(),
                closureDate: moment(vm.closureDate(), i18n.t('util.date_format')).format(i18n.t('util.date_iso')),
                worker: {
                    id: vm.sWorker()
                },
                comments: vm.comments(),
                close: vm.close()
            };
            var url = "", type = "";
            if (vm.id() == 0) {
                // creating new record
                type = "POST";
                url = sprintf('%s/closure?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/closure/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);
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
                        aswNotif.newClosureLines();
                        closureDetailAPI.getClosure(vm.id());
                        closureDetailAPI.getWo(vm.id());
                        closureDetailAPI.getMo(vm.id(), vm.sWorker());
                    } else {
                        var url = sprintf('closureGeneral.html?id=%s', data.id);
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
    btnCloseMessage: function () {
        var mf = function () {
            var message = i18n.t("closureDetail.close_message");
            var fn = 'closureDetailAPI.btnClose()();';
            aswNotif.generalQuestion(message, fn);
        };
        return mf;
    },
    btnClose: function () {
        var mf = function (e) {
            // avoid default accion
            // e.preventDefault();
            //
            if (vm.id() == 0) return;
            // validate form
            if (!closureDetailAPI.dataOk()) return;
            // dat for post or put
            var data = {
                id: vm.id(),
                closureDate: moment(vm.closureDate(), i18n.t('util.date_format')).format(i18n.t('util.date_iso')),
                worker: {
                    id: vm.sWorker()
                },
                comments: vm.comments(),
                close: 1
            };
            // updating record
            type = "PUT";
            url = sprintf('%s/closure/close/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    var url = sprintf('closureGeneral.html?id=%s', data.id);
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
    // TAB -- WO
    initWoTable: function () {
        var options = aswInit.initTableOptions('dt_wo');
        options.data = data;
        options.columns = [{
            data: "initDate",
            render: function (data, type, row) {
                var html = moment(data).format(i18n.t("util.date_format"));
                return html;
            }
        }, {
            data: "worker.name"
        }, {
            data: "comments"
        }, {
            data: "id",
            render: function (data, type, row) {
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='closureDetailAPI.editWo(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt2 + "</div>";
                return html;
            }
        }];
        $('#dt_wo').dataTable(options);
    },
    getWo: function (id) {
        var url = "";
        if (vm.close()) {
            url = sprintf("%s/wo/closure/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        } else {
            url = sprintf("%s/wo/closure2/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        }
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                closureDetailAPI.loadWo(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadWo: function (data) {
        var dt = $('#dt_wo').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_wo").show();
    },
    // TAB -- MO
    initMoTable: function () {
        var options = aswInit.initTableOptions('dt_mo');
        options.data = data;
        options.columns = [{
            data: "initDate",
            render: function (data, type, row) {
                var html = moment(data).format(i18n.t("util.date_format"));
                return html;
            }
        }, {
            data: "meaType"
        }, {
            data: "teamName"
        }, {
            data: "worker.name"
        }, {
            data: "comments"
        }, {
            data: "id",
            render: function (data, type, row) {
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='closureDetailAPI.editMo(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt2 + "</div>";
                return html;
            }
        }];
        $('#dt_mo').dataTable(options);
    },
    getMo: function (id, workerId) {
        if (id == 0) return;
        var url = "";
        if (vm.close()) {
            url = sprintf("%s/mo/closure/%s/%s/?api_key=%s", myconfig.apiUrl, id, workerId, api_key);
        } else {
            url = sprintf("%s/mo/closure2/%s/%s/?api_key=%s", myconfig.apiUrl, id, workerId, api_key);
        }
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                closureDetailAPI.loadMo(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadMo: function (data) {
        var dt = $('#dt_mo').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_mo").show();
    },
    editWo: function (id) {
        window.open(sprintf('woDetail.html?id=%s', id), '_blank');
    },
    editMo: function (id) {
        window.open(sprintf('moDetail.html?id=%s', id), '_blank');
    },    
    btnPrint: function () {
        var mf = function (e) {
            // avoid default accion
            e.preventDefault();
            // validate form
            if (!closureDetailAPI.dataOk()) return;
            var url = "", type = "";

            // fecth report data
            type = "GET";
            url = sprintf('%s/report/closure/open/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);
            if (vm.close()) {
                url = sprintf('%s/report/closure/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);
            }
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // process report data
                    aswReport.reportPDF(data, 'rk0YxJ9gx');
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
};




