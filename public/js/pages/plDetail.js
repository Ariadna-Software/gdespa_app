/*
 * plDetail.js
 * Function for the page plDetail.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')
var lang = aswCookies.getCookie('gdespa_lang');


var data = null;
var vm = null;
var clos = 0;

var plDetailAPI = {
    init: function () {
        aswInit.initPage();
        validator_languages(lang);
        datepicker_languages(lang);
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#plGeneral').attr('class', 'active');
        // knockout management
        vm = new plDetailAPI.pageData();
        ko.applyBindings(vm);
        //
        $('#plDetail-form').submit(function () {
            return false;
        });
        //
        $("#process").hide();
        //
        $('#cmbWorkers').select2(select2_languages[lang]);
        plDetailAPI.loadWorkers();
        if (user.worker) {
            plDetailAPI.loadWorkers(user.worker.id);
            $("#cmbWorkers").attr('disabled', 'disabled');
        }
        $('#cmbTeams').select2(select2_languages[lang]);
        plDetailAPI.loadTeams();

        $('#cmbDayTypes').select2(select2_languages[lang]);
        plDetailAPI.loadDayTypes();

        $('#cmbPws').select2(select2_languages[lang]);
        plDetailAPI.loadPws();

        $('#cmbZones').select2(select2_languages[lang]);
        plDetailAPI.loadZones();
        $("#cmbZones").select2().on('change', function (e) {
            plDetailAPI.changeZone(e.added);
        });
        // 
        if (aswUtil.gup('closed') == "true") clos = 1;
        // buttons click events
        $('#btnOk').click(plDetailAPI.btnOk());
        $('#btnExit').click(function (e) {
            e.preventDefault();
            window.open('plGeneral.html', '_self');
        });
        $('#btnPrint').click(plDetailAPI.btnPrint());
        $('#btnWoNew').click(plDetailAPI.btnWoNew);
        //
        if (plDetailAPI.seeNotChange()) $('#btnOk').hide();
        // init lines table
        plLineAPI.init();
        // init modal form
        plModalAPI.init();
        // init modal 2 form
        plModal2API.init();
        // init modal 3 form
        plModal3API.init();

        // check if an id have been passed
        var id = aswUtil.gup('id');
        if (aswUtil.gup('doc') != "") {
            $('.nav-tabs a[href="#s4"]').tab('show');
        }
        vm.id(id);
        // if it is an update show lines
        if (id != 0) {
            $('#wid-id-1').show();
        } else {
            // new record
            $('#s2').hide();
        }
        plDetailAPI.getPl(id);
    },
    pageData: function () {
        // knockout objects
        var self = this;
        self.id = ko.observable();
        self.initDate = ko.observable();
        //  self.endDate = ko.observable();
        self.comments = ko.observable();
        // worker combo
        self.optionsWorkers = ko.observableArray([]);
        self.selectedWorkers = ko.observableArray([]);
        self.sWorker = ko.observable();
        // team combo
        self.optionsTeams = ko.observableArray([]);
        self.selectedTeams = ko.observableArray([]);
        self.sTeam = ko.observable();
        // pw combo
        self.optionsPws = ko.observableArray([]);
        self.selectedPws = ko.observableArray([]);
        self.sPw = ko.observable();
        // day type combo
        self.optionsDayTypes = ko.observableArray([]);
        self.selectedDayTypes = ko.observableArray([]);
        self.sDayType = ko.observable();
        // zone combo
        self.optionsZones = ko.observableArray([]);
        self.selectedZones = ko.observableArray([]);
        self.sZone = ko.observable();
        // -- Modal related (1)
        self.lineId = ko.observable();
        self.estimate = ko.observable();
        self.done = ko.observable();
        self.prevPlanned = ko.observable();
        self.quantity = ko.observable();
        // cunit combo
        self.optionsCUnits = ko.observableArray([]);
        self.selectedCUnits = ko.observableArray([]);
        self.sCUnit = ko.observable();
        // -- Modal related (2)
        self.plWorkerId = ko.observable();
        self.quantity2 = ko.observable();
        // worker2 combo
        self.optionsWorkers2 = ko.observableArray([]);
        self.selectedWorkers2 = ko.observableArray([]);
        self.sWorker2 = ko.observable();
        //
        self.normalHours = ko.observable();
        self.extraHours = ko.observable();
        self.initialKm = ko.observable();
        self.finalKm = ko.observable();
        self.totalKm = ko.observable();
        self.fuel = ko.observable();
        self.planHours = ko.observable();
        self.extraHoursNight = ko.observable();
        self.expenses = ko.observable();
        // -- Modal related (3)
        self.quantity3 = ko.observable();
        // worker3 combo
        self.optionsWorkers3 = ko.observableArray([]);
        self.selectedWorkers3 = ko.observableArray([]);
        self.sWorker3 = ko.observable();
        // 
        self.thirdParty = ko.observable();
        self.thirdPartyCompany = ko.observable();
        //
        self.totalCost = ko.observable();
    },
    loadData: function (data) {
        vm.id(data.id);
        vm.initDate(moment(data.initDate).format(i18n.t('util.date_format')));
        // vm.endDate(moment(data.endDate).format(i18n.t('util.date_format')));
        vm.comments(data.comments);
        plDetailAPI.loadPws(data.pw.id);
        plDetailAPI.loadWorkers(data.worker.id);
        plDetailAPI.loadTeams(data.teamId);
        plDetailAPI.loadDayTypes(data.dayTypeId);
        plDetailAPI.loadZones(data.zoneId);
        //
        vm.thirdParty(data.thirdParty);
        vm.thirdPartyCompany(data.thirdPartyCompany);
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#plDetail-form').validate({
            rules: {
                txtInitDate: { required: true },
                //        txtEndDate: { required: true },
                cmbWorkers: { required: true },
                cmbZones: { required: true },
                cmbPws: { required: true },
                cmbTeams: { required: true }
            },
            // Messages for form validation
            messages: {
            },
            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#plDetail-form').valid();
    },
    // obtain a  pl group from the API
    getPl: function (id) {
        if (!id || (id == 0)) {
            // new pl group
            vm.id(0);
            return;
        }
        var url = sprintf("%s/pl/%s?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                plDetailAPI.loadData(data[0]);
                plLineAPI.getPlLines(data[0].id);
                var type = "GET";
                var url = sprintf('%s/pl_line/pl/sumcost/%s/?api_key=%s', myconfig.apiUrl, data[0].id, api_key);
                $.ajax({
                    type: type,
                    url: url,
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: function (data, status) {
                        vm.totalCost(aswUtil.round2(data[0].TotalCost));
                    },
                    error: function (err) {
                        aswNotif.errAjax(err);
                        if (err.status == 401) {
                            window.open('index.html', '_self');
                        }
                    }
                });
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
            if (!plDetailAPI.dataOk()) return;
            $("#btnOk").hide();
            $("#process").show();
            // dat for post or put
            var data = {
                id: vm.id(),
                initDate: moment(vm.initDate(), i18n.t('util.date_format')).format(i18n.t('util.date_iso')),
                //        endDate: moment(vm.endDate(), i18n.t('util.date_format')).format(i18n.t('util.date_iso')),
                worker: {
                    id: vm.sWorker()
                },
                pw: {
                    id: vm.sPw()
                },
                comments: vm.comments(),
                thirdParty: vm.thirdParty(),
                thirdPartyCompany: vm.thirdPartyCompany(),
                teamId: vm.sTeam(),
                dayTypeId: vm.sDayType(),
                zoneId: vm.sZone()
            };
            var url = "", type = "";
            if (vm.id() == 0) {
                // creating new record
                type = "POST";
                url = sprintf('%s/pl/generated/?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/pl/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);
            }
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    $("#btnOk").show();
                    $("#process").hide();
                    if (type == "POST") {
                        vm.id(data.id);
                        $('#wid-id-1').show();
                        aswNotif.newMainLines();
                        plDetailAPI.getPl(data.id);
                        $('#s2').show();
                    } else {
                        var url = sprintf('plGeneral.html?id=%s', data.id);
                        window.open(url, '_self');
                    }
                },
                error: function (err) {
                    $("#btnOk").show();
                    $("#process").hide();
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
        var url = sprintf('%s/worker/active?api_key=%s', myconfig.apiUrl, api_key);
        if (id) url = sprintf('%s/worker?api_key=%s', myconfig.apiUrl, api_key);
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
    loadTeams: function (id) {
        var url = sprintf('%s/team/active?api_key=%s', myconfig.apiUrl, api_key);
        if (id) url = sprintf('%s/team?api_key=%s', myconfig.apiUrl, api_key);
        $.ajax({
            type: "GET",
            url: sprintf('%s/team?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ teamId: null, name: "" }].concat(data);
                vm.optionsTeams(options);
                $("#cmbTeams").val([id]).trigger('change');
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
            url: sprintf('%s/pw/combo?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: null, name: "" }];
                var data2 = [];
                if (!user.seeNotOwner) {
                    data.forEach(function (d) {
                        if (user.plrkOnlyZone && (d.zone.id == user.zoneId || d.zoneId2 == user.zoneId)) {
                            data2.push(d);
                        }
                    });
                } else {
                    data2 = data;
                }
                options = options.concat(data2);
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
    },
    loadDayTypes: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/day_type?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: null, name: "" }].concat(data);
                vm.optionsDayTypes(options);
                $("#cmbDayTypes").val([id]).trigger('change');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    btnPrint: function () {
        var mf = function (e) {
            // avoid default accion
            e.preventDefault();
            // validate form
            if (!plDetailAPI.dataOk()) return;
            var url = "", type = "";
            window.open('infPlOne.html?plId=' + vm.id(), '_new');
        }
        return mf;
    },
    loadZones: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/zone?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ teamId: null, name: "" }].concat(data);
                vm.optionsZones(options);
                $("#cmbZones").val([id]).trigger('change');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    changeZone: function (data) {
        if (!data) return;
        // cargar las brigadas de la zona
        var id = data.id;
        $.ajax({
            type: "GET",
            url: sprintf('%s/team/zone/%s/?api_key=%s', myconfig.apiUrl, id, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ teamId: null, name: "" }].concat(data);
                vm.optionsTeams(options);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
        // cargar las propuestas de la zona
        $.ajax({
            type: "GET",
            url: sprintf('%s/pw/zone2combo/%s/?api_key=%s', myconfig.apiUrl, id, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: null, name: "" }];
                var data2 = [];
                if (!user.seeNotOwner) {
                    data.forEach(function (d) {
                        if (user.plrkOnlyZone && (d.zone.id == user.zoneId || d.zoneId2 == user.zoneId)) {
                            data2.push(d);
                        }
                    });
                } else {
                    data2 = data;
                }
                options = options.concat(data2);
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
    },
    seeNotChange: function () {
        if (user.seePlClosed && !user.modPlClosed && clos)
            return true;
        else
            return false;
    },
    btnWoNew: function () {
        aswNotif.generalQuestion(i18n.t('plDetail.createWoFromPl'), 'plDetailAPI.woNewFromPl()');
    },
    woNewFromPl: function() {
        var url = sprintf('%s/pl/create-wo/%s/%s/%s/?api_key=%s', myconfig.apiUrl, vm.id(), vm.sTeam(), vm.sPw(), api_key);
        aswUtil.llamadaAjax("POST", url, null, function (err, data) {
            if (err) return;
            // obtain new woId
            var newWoId = data.id;
            window.open("woDetail.html?id=" + newWoId, '_blank');
        });
    }
};





