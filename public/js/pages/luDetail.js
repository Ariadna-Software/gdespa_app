/*
 * luDetail.js
 * Function for the page luDetail.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')
var lang = aswCookies.getCookie('gdespa_lang');


var data = null;
var vm = null;
var clos = 0;

var luDetailAPI = {
    init: function () {
        aswInit.initPage();
        validator_languages(lang);
        datepicker_languages(lang);
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#luGeneral').attr('class', 'active');
        // knockout management
        vm = new luDetailAPI.pageData();
        ko.applyBindings(vm);
        //
        $('#cmbWorkers').select2(select2_languages[lang]);
        luDetailAPI.loadWorkers();
        if (user.worker) {
            luDetailAPI.loadWorkers(user.worker.id);
        }
        $('#cmbTeams').select2(select2_languages[lang]);

        $('#cmbDayTypes').select2(select2_languages[lang]);
        luDetailAPI.loadDayTypes();
        luDetailAPI.loadTeams();

        $('#cmbMeaTypes').select2(select2_languages[lang]);
        luDetailAPI.loadMeaTypes(1);        

        $('#cmbZones').select2(select2_languages[lang]);
        luDetailAPI.loadZones();
        if (user.zoneId) {
            luDetailAPI.loadZones(user.zoneId);
            var data = { id: user.zoneId };
            luDetailAPI.changeZone(data);
        }
        $("#cmbZones").select2().on('change', function (e) {
            luDetailAPI.changeZone(e.added);
        });
        // buttons click events
        $('#btnOk').click(luDetailAPI.btnOk());
        $('#btnExit').click(function (e) {
            e.preventDefault();
            window.open('luGeneral.html', '_self');
        });
        $('#btnPrint').click(luDetailAPI.btnPrint());
        if (aswUtil.gup('closed') == "true") clos = 1;
        if (luDetailAPI.seeNotChange()) $('#btnOk').hide();
        // init lines table
        luLineAPI.init();
        // init modal form
        luModalAPI.init();
        // init modal 2 form
        luModal2API.init();
        // init ludal 3 form
        luModal3API.init();

        // check if an id have been passed
        var id = aswUtil.gup('id');
        // if it is an update show lines
        if (id != 0) {
            $('#wid-id-1').show();
        } else {
            // new record
            $('#s2').hide();
        }
        luDetailAPI.getMo(id);
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
        // day type combo
        self.optionsDayTypes = ko.observableArray([]);
        self.selectedDayTypes = ko.observableArray([]);
        self.sDayType = ko.observable();
        // mea type combo
        self.optionsMeaTypes = ko.observableArray([]);
        self.selectedMeaTypes = ko.observableArray([]);
        self.sMeaType = ko.observable();        
        // pw combo
        self.optionsZones = ko.observableArray([]);
        self.selectedZones = ko.observableArray([]);
        self.sZone = ko.observable();
        // -- Modal related (1)
        self.lineId = ko.observable();
        self.estimate = ko.observable();
        self.done = ko.observable();
        self.quantity = ko.observable();
        self.moK = ko.observable();
        self.moLineK = ko.observable();
        // mea combo
        self.optionsMeas = ko.observableArray([]);
        self.selectedMeas = ko.observableArray([]);
        self.sMea = ko.observable();
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
        self.price = ko.observable();
        self.cost = ko.observable();
    },
    loadData: function (data) {
        vm.id(data.id);
        vm.initDate(moment(data.initDate).format(i18n.t('util.date_format')));
        // vm.endDate(moment(data.endDate).format(i18n.t('util.date_format')));
        vm.comments(data.comments);
        luDetailAPI.loadZones(data.zoneId);
        luDetailAPI.loadZoneK(data.zoneId);
        luDetailAPI.loadWorkers(data.worker.id);
        luDetailAPI.loadTeams(data.teamId);
        luDetailAPI.loadDayTypes(data.dayTypeId);
        luDetailAPI.loadMeaTypes(data.meaTypeId);
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#luDetail-form').validate({
            rules: {
                txtInitDate: { required: true },
                //        txtEndDate: { required: true },
                cmbWorkers: { required: true },
                cmbZones: { required: true },
                cmbDayTypes: { required: true },
                cmbMeaTypes: { required: true },
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
        return $('#luDetail-form').valid();
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
                luDetailAPI.loadData(data[0]);
                luLineAPI.getMoLines(data[0].id);
                luLineAPI.getMoWorkers(data[0].id);
                luLineAPI.getMoVehicles(data[0].id);
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
            if (!luDetailAPI.dataOk()) return;
            // dat for post or put
            var data = {
                id: vm.id(),
                initDate: moment(vm.initDate(), i18n.t('util.date_format')).format(i18n.t('util.date_iso')),
                //        endDate: moment(vm.endDate(), i18n.t('util.date_format')).format(i18n.t('util.date_iso')),
                worker: {
                    id: vm.sWorker()
                },
                comments: vm.comments(),
                teamId: vm.sTeam(),
                zoneId: vm.sZone(),
                dayTypeId: vm.sDayType(),
                meaTypeId: vm.sMeaType()
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
                        luDetailAPI.getMo(data.id);
                        $('#s2').show();
                    } else {
                        var url = sprintf('luGeneral.html?id=%s', data.id);
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
    loadMeaTypes: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/mea_type?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: null, name: "" }].concat(data);
                vm.optionsMeaTypes(options);
                $("#cmbMeaTypes").val([id]).trigger('change');
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
            if (!luDetailAPI.dataOk()) return;
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
                luDetailAPI.loadZoneK(id);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        })
    },
    loadZoneK: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/zone/%s/?api_key=%s', myconfig.apiUrl, id, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                vm.moK(data[0].moK);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        })
    },
    seeNotChange: function () {
        if (user.seeWoClosed && !user.modWoClosed && clos)
            return true;
        else
            return false;
    }
};




