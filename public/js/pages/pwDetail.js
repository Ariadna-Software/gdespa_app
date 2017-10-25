/*
 * pwDetail.js
 * Function for the page pwDetail.html
 */
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')
var lang = aswCookies.getCookie('gdespa_lang');
var parameters = {};

var data = null;
var vm = null;
var doc = null;

var pwDetailAPI = {
    init: function () {
        aswInit.initPage();
        validator_languages(lang);
        datepicker_languages(lang);
        // datepicker fields need a language format
        var v = i18n.t('util.date_format2');
        //
        //$("#txtInitDate").datepicker({ dateFormat: 'dd/mm/yy' });
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#pwGeneral').attr('class', 'active');
        // knockout management
        vm = new pwDetailAPI.pageData();
        ko.applyBindings(vm);
        // default values
        vm.defaultK(1);
        // combos //
        $('#cmbWorkers').select2(select2_languages[lang]);
        pwDetailAPI.loadWorkers();
        if (user.worker) {
            pwDetailAPI.loadWorkers(user.worker.id);
        }
        $('#cmbCompanies').select2(select2_languages[lang]);
        pwDetailAPI.loadCompanies();
        $('#cmbStatus').select2(select2_languages[lang]);
        pwDetailAPI.loadStatus(0);
        $('#cmbZone').select2(select2_languages[lang]);
        pwDetailAPI.loadZones(0);
        $('#cmbZone2').select2(select2_languages[lang]);
        pwDetailAPI.loadZones2(0);
        $("#cmbZone").select2().on('change', function (e) {
            pwDetailAPI.loadZoneK(e.added);
        });

        $('#cmbWork').select2(select2_languages[lang]);
        pwDetailAPI.loadWork(0);
        $('#cmbIns').select2(select2_languages[lang]);
        pwDetailAPI.loadIns(0);
        $('#cmbArea').select2(select2_languages[lang]);
        pwDetailAPI.loadArea(0);

        // buttons click events
        $('#btnOk').click(pwDetailAPI.btnOk());
        $('#btnPrint').click(pwDetailAPI.btnPrint());
        $('#btnPrint2').click(pwDetailAPI.btnPrint2());
        $('#btnCalc').click(pwDetailAPI.btnCalc());
        $('#btnExit').click(function (e) {
            e.preventDefault();
            window.open('pwGeneral.html', '_self');
        });
        $('#btnChangeStatus').click(pwDetailAPI.newPwStatus());
        $('#ucinfo').click(pwDetailAPI.ucInfo);
        // init lines table
        pwLineAPI.init();
        // init modal form
        pwModalAPI.init();
        pwModal2API.init();
        pwModal3API.init();
        pwModal4API.init();
        // init tabs
        pwDetailAPI.initWoTable();
        // check if an id have been passed
        var id = aswUtil.gup('id');
        if (aswUtil.gup('doc') != "") {
            $('.nav-tabs a[href="#s4"]').tab('show');
        }
        // read parameters
        var url = sprintf("%s/parameters/?api_key=%s", myconfig.apiUrl, api_key);
        aswUtil.llamadaAjax("GET", url, null, function(err, data){
            if (err) return;
            parameters = data[0];
        })
        // if it is an update show lines
        if (id != 0) {
            $('#wid-id-1').show();
            $('#btnChangeStatus').show();
        } else {
            // new record
            $('#s2').hide();
            $('#s3').hide();
            $('#wid-id-1').hide();
            // assign default date to initDate
            var dateFormat = "DD/MM/YYYY";  // i18n.t('util.date_format');
            vm.initDate(moment(new Date()).format(dateFormat));
        }
        pwDetailAPI.getPw(id);
        pwDetailAPI.getWo(id);
        pwLineAPI.getDocs(id);
        pwLineAPI.getInvoices(id);
        pwLineAPI.getImgs(id);
        //
        if (!user.perVerified) {
            $("#seeVerified").hide();
        }
        //
        if (!user.perChangePwDate){
            $("#txtInitDate").attr('disabled', 'disabled');
        }  
    },
    pageData: function () {
        // knockout objects
        var self = this;
        self.id = ko.observable();
        self.name = ko.observable();
        self.reference = ko.observable();
        self.description = ko.observable();
        self.initDate = ko.observable();
        self.initInCharge = ko.observable();
        self.companyId = ko.observable();
        self.defaultK = ko.observable();
        self.total = ko.observable();
        self.acepDate = ko.observable();
        self.finDate = ko.observable();
        self.cerDate = ko.observable();
        self.invDate = ko.observable();
        self.payDate = ko.observable();
        self.acepRef = ko.observable();
        self.finRef = ko.observable();
        self.cerRef = ko.observable();
        self.invRef = ko.observable();
        self.payRef = ko.observable();
        self.endDate = ko.observable();
        self.mainK = ko.observable();
        self.lastClose = ko.observable();
        // status combo
        self.optionsStatus = ko.observableArray([]);
        self.selectedStatus = ko.observableArray([]);
        self.sStatus = ko.observable();
        self.status = ko.observable();
        // company combo
        self.optionsCompanies = ko.observableArray([]);
        self.selectedCompanies = ko.observableArray([]);
        self.sCompany = ko.observable();
        // worker combo
        self.optionsWorkers = ko.observableArray([]);
        self.selectedWorkers = ko.observableArray([]);
        self.sWorker = ko.observable();
        // zone combo
        self.optionsZone = ko.observableArray([]);
        self.selectedZone = ko.observableArray([]);
        self.sZone = ko.observable();
        // zone combo2
        self.optionsZone2 = ko.observableArray([]);
        self.selectedZone2 = ko.observableArray([]);
        self.sZone2 = ko.observable();

        // work type combo
        self.optionsWork = ko.observableArray([]);
        self.selectedWork = ko.observableArray([]);
        self.sWork = ko.observable();

        // installation type combo
        self.optionsIns = ko.observableArray([]);
        self.selectedIns = ko.observableArray([]);
        self.sIns = ko.observable();

        // area type combo
        self.optionsArea = ko.observableArray([]);
        self.selectedArea = ko.observableArray([]);
        self.sArea = ko.observable();

        // SALVA fields
        self.revDate = ko.observable();
        self.revUser = ko.observable();

        // -- Modal related
        self.pwLineId = ko.observable();
        self.line = ko.observable();
        self.cost = ko.observable();
        self.quantity = ko.observable();
        self.k = ko.observable();
        self.amount = ko.observable();
        self.comments = ko.observable();
        // cunit combo
        self.optionsCUnits = ko.observableArray([]);
        self.selectedCUnits = ko.observableArray([]);
        self.sCUnit = ko.observable();
        // -- Modal related (2)
        self.reference2 = ko.observable();
        self.initDate2 = ko.observable();
        // status2 combo
        self.optionsStatus2 = ko.observableArray([]);
        self.selectedStatus2 = ko.observableArray([]);
        self.sStatus2 = ko.observable();
        // worker2 combo
        self.optionsWorkers2 = ko.observableArray([]);
        self.selectedWorkers2 = ko.observableArray([]);
        self.sWorker2 = ko.observable();
        // -- Modal related (3)
        self.pwWorkerId = ko.observable();
        // worker3 combo
        self.optionsWorkers3 = ko.observableArray([]);
        self.selectedWorkers3 = ko.observableArray([]);
        self.sWorker3 = ko.observable();
        // -- Model related (4)
        self.chapterId = ko.observable();
        self.chapterOrder = ko.observable();
        self.chapterName = ko.observable();
        self.chapterComments = ko.observable();
        // chapter combo
        self.optionsChapters = ko.observableArray([]);
        self.selectedChapters = ko.observableArray([]);
        self.sChapter = ko.observable();
        self.currentChapterId = ko.observable();
        self.plannedQuantity = ko.observable();
        // 
        self.subZone = ko.observable();
        //
        self.prod = ko.observable();
        self.totalf = ko.observable();
        //
        self.verified = ko.observable();
        self.profitLoses = ko.observable();
        self.isMeaMo = ko.observable();
        // names
        self.initInChargeName = ko.observable();
        self.acepInChargeName = ko.observable();
        self.finInChargeName = ko.observable();
        self.cerInChargeName = ko.observable();
        self.invInChargeName = ko.observable();
        self.payInChargeName = ko.observable();
    },
    loadData: function (data) {
        vm.id(data.id);
        vm.sStatus(data.status.id);
        vm.status(data.status.id);
        pwDetailAPI.loadStatus(vm.sStatus());
        vm.reference(data.reference);
        vm.name(data.name);
        vm.description(data.description);
        vm.initDate(moment(data.initDate).format(i18n.t("util.date_format")));
        vm.sWorker(data.initInCharge.id);
        pwDetailAPI.loadWorkers(vm.sWorker());
        vm.sCompany(data.company.id);
        pwDetailAPI.loadCompanies(vm.sCompany());
        vm.defaultK(data.defaultK);
        vm.mainK(data.mainK);
        vm.total(data.total);
        if (moment(data.acepDate).isValid()) {
            vm.acepDate(moment(data.acepDate).format(i18n.t("util.date_format")));
        }
        if (moment(data.finDate).isValid()) {
            vm.finDate(moment(data.finDate).format(i18n.t("util.date_format")));
        }
        if (moment(data.cerDate).isValid())
            vm.cerDate(moment(data.cerDate).format(i18n.t("util.date_format")));
        if (moment(data.invDate).isValid())
            vm.invDate(moment(data.invDate).format(i18n.t("util.date_format")));
        if (moment(data.payDate).isValid())
            vm.payDate(moment(data.payDate).format(i18n.t("util.date_format")));
        if (moment(data.endDate).isValid())
            vm.endDate(moment(data.endDate).format(i18n.t("util.date_format")));
        vm.acepRef(data.acepRef);
        vm.finRef(data.finRef);
        vm.cerRef(data.cerRef);
        vm.invRef(data.invRef);
        vm.payRef(data.payRef);
        vm.sZone(data.zone.id);
        vm.sZone2(data.zoneId2);
        vm.subZone(data.subZone);

        vm.prod(data.prod);
        vm.totalf(data.totalf);
        vm.verified(data.verified);

        pwDetailAPI.loadZones(vm.sZone());
        pwDetailAPI.loadZones2(vm.sZone2());

        vm.sWork(data.workTypeId);
        pwDetailAPI.loadWork(vm.sWork());
        vm.sIns(data.insTypeId);
        pwDetailAPI.loadIns(vm.sIns());
        vm.sArea(data.areaTypeId);
        pwDetailAPI.loadArea(vm.sArea());

        if (moment(data.revDate).isValid())
            vm.revDate(moment(data.revDate).format(i18n.t("util.date_format")));
        vm.revUser(data.revUser);

        $('#progress').text((data.percentage * 100) + " %");
        $('#cost').text(data.cost * 1 + " USD");
        // if we have tabs we should change wiget title
        $('#pwDetailTitle').html(" <strong>[" + vm.name() + "]</strong>");
        // New button visibility
        if (vm.sStatus() > 0) {
            if (!user.modPw) {
                $('#btnNewLine').hide();
            }
        }
        vm.profitLoses(data.profitLoses);
        // new fields prod anf totalf
        if (vm.prod()) $('#produced').text(numeral(data.prod).format('0,0.00') + " USD");
        if (vm.totalf()) $('#invoiced').text(numeral(data.totalf).format('0,0.00') + " USD");
        if (vm.prod() - vm.totalf()) $('#pending').text((numeral(data.prod - data.totalf).format('0,0.00') + " USD"));
        if (parseInt(vm.prod() - vm.totalf()) == 0) $('#pending').css('color', 'black');
        if (vm.profitLoses()) $('#profitLoses').text(numeral(data.profitLoses).format('0,0.00') + " USD");
        // control pw closed
        if (vm.status() > 1 && !user.perPwClosed) {
            $("#btnChangeStatus").hide();
            $("#btnCalc").hide();
            $("#btnNewChapter").hide();
            $("#btnOk").hide();
            $("#btnNewWorker").hide();
            aswNotif.generalMessage(i18n.t('userDetail.closedMessage'));
        }
        //
        vm.isMeaMo(data.isMeaMo);
        // 
        vm.initInChargeName(data.initInChargeName);
        vm.acepInChargeName(data.acepInChargeName);
        vm.finInChargeName(data.finInChargeName);
        vm.cerInChargeName(data.cerInChargeName);
        vm.invInChargeName(data.invInChargeName);
        vm.payInChargeName(data.payInChargeName);
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#pwDetail-form').validate({
            rules: {
                txtName: {
                    required: true
                },
                txtReference: {
                    required: true
                },
                txtInitDate: {
                    required: true
                },
                txtDefaultK: {
                    required: true
                },
                cmbCompanies: {
                    required: true
                },
                cmbWorkers: {
                    required: true
                },
                cmbZone: {
                    required: true
                }
            },
            // Messages for form validation
            messages: {},
            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#pwDetail-form').valid();
    },
    // obtain a  pw group from the API
    getPw: function (id) {
        if (!id || (id == 0)) {
            // new pw group
            vm.id(0);
            return;
        }
        var url = sprintf("%s/pw/%s?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                pwDetailAPI.loadData(data[0]);
                pwLineAPI.getPwLines(data[0].id);
                pwLineAPI.getPwWorkers(data[0].id);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
        // last closure
        url = sprintf("%s/closure/lastclose/%s?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                if (data && data.length > 0) {
                    vm.lastClose(aswUtil.round2(data[0].estimate * 100));
                    $('#lastclose').text(vm.lastClose() * 1 + " %");
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
    // force js change
    btnOk: function () {
        var mf = function (e) {
            // avoid default accion
            e.preventDefault();
            // validate form
            if (!pwDetailAPI.dataOk()) return;
            // dat for post or put
            var data = {
                id: vm.id(),
                status: {
                    id: vm.sStatus()
                },
                name: vm.name(),
                reference: vm.reference(),
                description: vm.description(),
                initDate: moment(vm.initDate(), i18n.t("util.date_format")).format(i18n.t("util.date_iso")),
                initInCharge: {
                    id: vm.sWorker()
                },
                company: {
                    id: vm.sCompany()
                },
                defaultK: vm.defaultK(),
                mainK: vm.mainK(),
                total: vm.total(),
                zone: {
                    id: vm.sZone()
                },
                subZone: vm.subZone(),
                zoneId2: vm.sZone2(),
                workTypeId: vm.sWork(),
                insTypeId: vm.sIns(),
                areaTypeId: vm.sArea(),
                revUser: vm.revUser(),
                verified: vm.verified(),
                profitLoses: vm.profitLoses(),
                isMeaMo: vm.isMeaMo()
            };
            if (moment(vm.endDate(), i18n.t("util.date_format")).isValid()) {
                data.endDate = moment(vm.endDate(), i18n.t("util.date_format")).format(i18n.t("util.date_iso"));
            }
            if (moment(vm.revDate(), i18n.t("util.date_format")).isValid()) {
                data.revDate = moment(vm.revDate(), i18n.t("util.date_format")).format(i18n.t("util.date_iso"));
            }
            var url = "",
                type = "";
            if (vm.id() == 0) {
                // creating new record
                type = "POST";
                url = sprintf('%s/pw?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/pw/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);
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
                        $('#btnChangeStatus').show();
                        $('#s2').show();
                        $('#s3').show();
                        aswNotif.newMainLines();
                    } else {
                        var url = sprintf('pwGeneral.html?id=%s', data.id);
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
    loadCompanies: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/company?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{
                    id: 0,
                    name: " "
                }].concat(data);
                vm.optionsCompanies(options);
                $("#cmbCompanies").val([id]).trigger('change');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadWorkers: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/worker?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{
                    id: 0,
                    name: " "
                }].concat(data);
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
    loadStatus: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/status?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = data;
                vm.optionsStatus(options);
                $("#cmbStatus").val([id]).trigger('change');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadZones: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/zone?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = data;
                vm.optionsZone(options);
                $("#cmbZone").val([id]).trigger('change');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadZones2: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/zone?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = data;
                vm.optionsZone2(options);
                $("#cmbZone2").val([id]).trigger('change');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    newPwStatus: function () {
        var mf = function (e) {
            // show modal form
            e.preventDefault();
            pwModal2API.newStatus();
        };
        return mf;
    },
    // TAB -- WO
    initWoTable: function () {
        var options = aswInit.initTableOptions('dt_wo');
        options.data = data;
        options.columns = [{
            data: "rDate",
            render: function (data, type, row) {
                var html = moment(data).format(i18n.t("util.date_format"));
                return html;
            }
        }, {
            data: "workerName"
        }, {
            data: "comments"
        }, {
            data: "woId",
            render: function (data, type, row) {
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='pwDetailAPI.editWo(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt2 + "</div>";
                return html;
            }
        }];
        $('#dt_wo').dataTable(options);
    },
    getWo: function (id) {
        var url = sprintf("%s/pw/wo/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                pwDetailAPI.loadWo(data);
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
    editWo: function (id) {
        window.open(sprintf('woDetail.html?id=%s', id), '_blank');
    },
    btnPrint: function () {
        var mf = function (e) {
            // avoid default accion
            e.preventDefault();
            // validate form
            if (!pwDetailAPI.dataOk()) return;
            var url = "",
                type = "";

            // fecth report data
            type = "GET";
            url = sprintf('%s/report/pwR1/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);

            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // process report data
                    window.open('infPwOne.html?pwId=' + vm.id(), '_new');
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
    btnPrint2: function () {
        var mf = function (e) {
            // avoid default accion
            e.preventDefault();

            // validate form
            if (!pwDetailAPI.dataOk()) return;
            var url = "",
                type = "";

            // fecth report data
            type = "GET";
            url = sprintf('%s/report/pwR1/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);

            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // process report data
                    aswReport.reportPDF(data, 'HJJjHyz5x');
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
    btnCalc: function (id) {
        var mf = function (e) {
            // avoid default accion
            e.preventDefault();
            // 
            var message = i18n.t('recalc_pw');
            var fn = sprintf('pwDetailAPI.btnCalcDo(%s);', id);
            aswNotif.generalQuestion(message, fn);
        }
        return mf;
    },
    btnCalcDo: function () {
        type = "GET";
        url = sprintf('%s/pw/recalc/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);
        $.ajax({
            type: type,
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // reload page
                window.open(sprintf('pwDetail.html?id=%s', vm.id()), '_self');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadZoneK: function (data) {
        if (!data) return;
        var id = data.id;
        $.ajax({
            type: "GET",
            url: sprintf('%s/zone/%s/?api_key=%s', myconfig.apiUrl, id, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                vm.defaultK(data[0].woK);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        })
    },
    loadWork: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/work_type?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = data;
                vm.optionsWork(options);
                $("#cmbWork").val([id]).trigger('change');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadIns: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/ins_type?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = data;
                vm.optionsIns(options);
                $("#cmbIns").val([id]).trigger('change');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadArea: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/area_type?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = data;
                vm.optionsArea(options);
                $("#cmbArea").val([id]).trigger('change');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    ucInfo: function () {
        if (!vm.sCUnit()) return;
        window.open('cUnitDetail.html?id=' + vm.sCUnit() + '&ucinfo=1', '_blank');
    },
    checkDocsNeedToOpen: function(id, done) {
        var url = sprintf("%s/pw/docsNeedToOpen/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                // TODO: Control number
                var numDocs = data;
                done(null, data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
                done(err);
            }
        })      
    }
};