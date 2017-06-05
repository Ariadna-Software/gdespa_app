/*
 * moDetail.js
 * Function for the page moDetail.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')
var lang = aswCookies.getCookie('gdespa_lang');


var data = null;
var vm = null;

var moDetailAPI = {
    init: function () {
        aswInit.initPage();
        validator_languages(lang);
        datepicker_languages(lang);
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#moGeneral').attr('class', 'active');
        // knockout management
        vm = new moDetailAPI.pageData();
        ko.applyBindings(vm);
        //
        $('#cmbWorkers').select2(select2_languages[lang]);
        moDetailAPI.loadWorkers();
        if (user.worker) {
            moDetailAPI.loadWorkers(user.worker.id);
        }
        $('#cmbTeams').select2(select2_languages[lang]);

        moDetailAPI.loadTeams();

        $('#cmbZones').select2(select2_languages[lang]);
        moDetailAPI.loadZones();
        $("#cmbZones").select2().on('change', function (e) {
            moDetailAPI.changeZone(e.added);
        });
        // buttons click events
        $('#btnOk').click(moDetailAPI.btnOk());
        $('#btnExit').click(function (e) {
            e.preventDefault();
            window.open('moGeneral.html', '_self');
        });
        $('#btnPrint').click(moDetailAPI.btnPrint());
        // init lines table
        moLineAPI.init();
        // init modal form
        moModalAPI.init();
        // init modal 2 form
        moModal2API.init();
        // init modal 3 form
        moModal3API.init();

        // check if an id have been passed
        var id = aswUtil.gup('id');
        // if it is an update show lines
        if (id != 0) {
            $('#wid-id-1').show();
        } else {
            // new record
            $('#s2').hide();
        }
        moDetailAPI.getMo(id);
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
        self.optionsZones = ko.observableArray([]);
        self.selectedZones = ko.observableArray([]);
        self.sZone = ko.observable();
        // -- Modal related (1)
        self.lineId = ko.observable();
        self.estimate = ko.observable();
        self.done = ko.observable();
        self.quantity = ko.observable();
        // cunit combo
        self.optionsCUnits = ko.observableArray([]);
        self.selectedCUnits = ko.observableArray([]);
        self.sCUnit = ko.observable();
        // -- Modal related (2)
        self.moWorkerId = ko.observable();
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
    },
    loadData: function (data) {
        vm.id(data.id);
        vm.initDate(moment.parseZone(data.initDate).format(i18n.t('util.date_format')));
        // vm.endDate(moment(data.endDate).format(i18n.t('util.date_format')));
        vm.comments(data.comments);
        moDetailAPI.loadZones(data.pw.id);
        moDetailAPI.loadWorkers(data.worker.id);
        moDetailAPI.loadTeams(data.teamId);
        //
        vm.thirdParty(data.thirdParty);
        vm.thirdPartyCompany(data.thirdPartyCompany);
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#moDetail-form').validate({
            rules: {
                txtInitDate: { required: true },
                //        txtEndDate: { required: true },
                cmbWorkers: { required: true },
                cmbZones: { required: true },
            },
            // Messages for form validation
            messages: {
            },
            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#moDetail-form').valid();
    },
    // obtain a  mo group from the API
    getMo: function (id) {
        if (!id || (id == 0)) {
            // new mo group
            vm.id(0);
            return;
        }
        var url = sprintf("%s/mo/%s?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                moDetailAPI.loadData(data[0]);
                moLineAPI.getMoLines(data[0].id);
                moLineAPI.getMoWorkers(data[0].id);
                moLineAPI.getMoVehicles(data[0].id);
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
            if (!moDetailAPI.dataOk()) return;
            // dat for post or put
            var data = {
                id: vm.id(),
                initDate: moment(vm.initDate(), i18n.t('util.date_format')).format(i18n.t('util.date_iso')),
                //        endDate: moment(vm.endDate(), i18n.t('util.date_format')).format(i18n.t('util.date_iso')),
                worker: {
                    id: vm.sWorker()
                },
                comments: vm.comments(),
                teamId: vm.sTeam()
            };
            var url = "", type = "";
            if (vm.id() == 0) {
                // creating new record
                type = "POST";
                url = sprintf('%s/mo/generated/?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/mo/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);
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
                        moDetailAPI.getMo(data.id);
                        $('#s2').show();
                    } else {
                        var url = sprintf('moGeneral.html?id=%s', data.id);
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
    loadTeams: function (id) {
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
    btnPrint: function () {
        var mf = function (e) {
            // avoid default accion
            e.preventDefault();
            // validate form
            if (!moDetailAPI.dataOk()) return;
            var url = "", type = "";

            // fecth report data
            type = "GET";
            url = sprintf('%s/report/mo2/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);

            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // process report data
                    aswReport.reportPDF(data, 'BJ8C0_TKg');
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
    changeZone: function (data) {
        if (!data) return;
        $.ajax({
            type: "GET",
            url: sprintf('%s/team/zone/%s/?api_key=%s', myconfig.apiUrl, data.id, api_key),
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
        })
    },
};



