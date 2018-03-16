var lang = aswCookies.getCookie('gdespa_lang');
var oldStatus;

var pwModal2API = {
    init: function () {
        // avoid sending form 
        $('#pwModal-form').submit(function () {
            return false;
        });
        // button events
        $('#btnSaveLine2').click(pwModal2API.saveLine());
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#pwModal2-form').validate({
            rules: {
                txtReference2: { required: true },
                txtInitDate2: { required: true },
                cmbStatus2: { required: true },
                cmbWorkers2: { required: true }
            },
            // Messages for form validation
            messages: {
            },
            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#pwModal2-form').valid();
    },
    newStatus: function () {
        oldStatus = vm.sStatus(); // keep old status
        var st = vm.sStatus() + 1;
        if (st < 6) {
            // valid status
            vm.sStatus2(st)
        } else {
            // keep status
            vm.sStatus2(vm.sStatus());
        }
        vm.reference2(null);
        vm.initDate2(null);
        $('#cmbStatus2').select2(select2_languages[lang]);
        pwModal2API.loadStatus2(vm.sStatus2());
        $('#cmbWorkers2').select2(select2_languages[lang]);
        pwModal2API.loadWorkers2(vm.sWorker());

    },
    saveLine: function () {
        var mf = function (e) {
            e.preventDefault();
            if (!pwModal2API.dataOk()) {
                return;
            }
            // mount line to save 
            var data = {
                id: vm.id(),
                status: { id: vm.sStatus2() },
                reference: vm.reference(),
                name: vm.name()
            };
            switch (vm.sStatus2()) {
                case 1:
                    data.acepInCharge = { id: vm.sWorker2() };
                    data.acepDate = moment(vm.initDate2(), i18n.t('util.date_format')).format(i18n.t('util.date_iso'));
                    data.acepRef = vm.reference2();
                    break;
                case 2:
                    data.finInCharge = { id: vm.sWorker2() };
                    data.finDate = moment(vm.initDate2(), i18n.t('util.date_format')).format(i18n.t('util.date_iso'));
                    data.finRef = vm.reference2();
                    break;
                case 3:
                    data.cerInCharge = { id: vm.sWorker2() };
                    data.cerDate = moment(vm.initDate2(), i18n.t('util.date_format')).format(i18n.t('util.date_iso'));
                    data.cerRef = vm.reference2();
                    break;
                case 4:
                    data.invInCharge = { id: vm.sWorker2() };
                    data.invDate = moment(vm.initDate2(), i18n.t('util.date_format')).format(i18n.t('util.date_iso'));
                    data.invRef = vm.reference2();
                    break;
                case 5:
                    data.payInCharge = { id: vm.sWorker2() };
                    data.payDate = moment(vm.initDate2(), i18n.t('util.date_format')).format(i18n.t('util.date_iso'));
                    data.payRef = vm.reference2();
                    break;
                case 6:
                    data.itxInCharge = vm.sWorker2();
                    data.itxDate = moment(vm.initDate2(), i18n.t('util.date_format')).format(i18n.t('util.date_iso'));
                    data.itxRef = vm.reference2();
                    break;
                case 7:
                    data.qlyInCharge = vm.sWorker2();
                    data.qlyDate = moment(vm.initDate2(), i18n.t('util.date_format')).format(i18n.t('util.date_iso'));
                    data.qlyRef = vm.reference2();
                    break;
            }
            var url = "", type = "";
            type = "PUT";
            url = sprintf('%s/pw/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    $('#pwModal2').modal('hide');
                    if (vm.sStatus2() == 3) {
                        // Proposed Work (pw) closed 
                        // Do you want to update line quantities?
                        aswNotif.generalQuestion(i18n.t('pwDetail.updateLines'), 'pwModal2API.updatePwLinesFromWoLines()');
                        // close documents control
                        type = "GET";
                        url = sprintf('%s/pw/docsNeedToClose/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);
                        aswUtil.llamadaAjax(type, url, null, function (err, data) {
                            if (err) return;
                            var myInitDate = moment(vm.initDate(), 'DD/MM/YYYY').toDate();
                            var myInitControl = moment(parameters.initControlDocs).toDate();
                            if (data[0].ndocs == 0 && myInitDate >= myInitControl) {
                                var question = i18n.t('pwDetail.docsNeedToClose');
                                aswNotif.generalMessage(question);
                                pwModal2API.dontCloseFin();
                                // aswNotif.generalQuestionYesNo(question, 'pwModal2API.closeDocumentsPresent()', 'pwModal2API.dontClose()');
                                pwDetailAPI.getPw(vm.id());
                            }
                        });
                    } else if (vm.sStatus2() == 5) {
                        // Profit / loses control
                        if (vm.prod() - vm.totalf()) {
                            var difference = numeral(vm.prod() - vm.totalf()).format('0,0.00') + " USD"
                            var question = i18n.t('pwDetail.profitLosesQuestion').replace('{0}', difference);
                            aswNotif.generalQuestionYesNo(question, 'pwModal2API.calcProfitLoses()', 'pwModal2API.dontClose()');
                            pwDetailAPI.getPw(vm.id());
                        }
                    }
                    else {
                        pwDetailAPI.getPw(vm.id());
                    }
                },
                error: function (err) {
                    aswNotif.errAjax(err);
                    if (err.status == 401) {
                        window.open('index.html', '_self');
                    }
                }
            });
        };
        return mf;
    },
    loadWorkers2: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/worker?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: 0, name: " " }].concat(data);
                vm.optionsWorkers2(options);
                $("#cmbWorkers2").val([id]).trigger('change');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadStatus2: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/status?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = data;
                vm.optionsStatus2(options);
                $("#cmbStatus2").val([id]).trigger('change');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    updatePwLinesFromWoLines: function () {
        var url = "", type = "";
        type = "PUT";
        url = sprintf('%s/pw/updateclosed/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);
        $.ajax({
            type: type,
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                pwDetailAPI.getPw(vm.id());
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    calcProfitLoses: function () {
        data = {
            id: vm.id(),
            reference: vm.reference(),
            name: vm.name(),
            profitLoses: vm.prod() - vm.totalf()
        };
        var url = "", type = "";
        type = "PUT";
        url = sprintf('%s/pw/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);
        $.ajax({
            type: type,
            url: url,
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (data, status) {
                pwDetailAPI.getPw(vm.id());
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    dontClose: function () {
        // recover previous state
        var data = {
            id: vm.id(),
            status: { id: oldStatus },
            reference: vm.reference(),
            name: vm.name(),
            payInCharge: { id: null },
            payDate: null,
            payRef: null
        };
        // save this state in pw
        var url = "", type = "";
        type = "PUT";
        url = sprintf('%s/pw/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);
        aswUtil.llamadaAjax(type, url, data, function (err) {
            if (err) return;
            pwDetailAPI.getPw(vm.id());
        });
    },
    dontCloseFin: function () {
        // recover previous state
        var data = {
            id: vm.id(),
            status: { id: oldStatus },
            reference: vm.reference(),
            name: vm.name(),
            finInCharge: { id: null },
            finDate: null,
            finRef: null
        };
        // save this state in pw
        var url = "", type = "";
        type = "PUT";
        url = sprintf('%s/pw/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);
        aswUtil.llamadaAjax(type, url, data, function (err) {
            if (err) return;
            pwDetailAPI.getPw(vm.id());
        });
    },
    closeDocumentsPresent: function () {
        // TODO: Notif authority
        pwDetailAPI.getPw(vm.id());
        return;
    }

};