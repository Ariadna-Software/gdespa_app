/*
 * team.js
 * Function for the page team.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')
var lang = aswCookies.getCookie('gdespa_lang');


var data = null;
var vm = null;

var teamDetailAPI = {
    init: function () {
        aswInit.initPage();
        validator_languages(lang);
        datepicker_languages(lang);
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#teamGeneral').attr('class', 'active');
        // knockout management
        vm = new teamDetailAPI.pageData();
        ko.applyBindings(vm);
        //
        $('#cmbWorkerInCharges').select2(select2_languages[lang]);
        teamDetailAPI.loadWorkerInCharges();
        if (user.worker) {
            teamDetailAPI.loadWorkerInCharges(user.worker.id);
        }

        // buttons click events
        $('#btnOk').click(teamDetailAPI.btnOk());
        $('#btnExit').click(function (e) {
            e.preventDefault();
            window.open('teamGeneral.html', '_self');
        })
        $('#btnPrint').click(teamDetailAPI.btnPrint());
        // init lines table
        teamLineAPI.init();
        // init modal form
        teamModalAPI.init();
        // check if an id have been passed
        var id = aswUtil.gup('id');
        // if it is an update show lines
        if (id != 0) {
            $('#wid-id-1').show();
        }
        teamDetailAPI.getTeam(id);
    },
    pageData: function () {
        // knockout objects
        var self = this;
        self.id = ko.observable();
        self.name = ko.observable();
        // worker combo
        self.optionsWorkerInCharges = ko.observableArray([]);
        self.selectedWorkerInCharges = ko.observableArray([]);
        self.sWorkerInCharge = ko.observable();
        // -- Modal related
        self.lineId = ko.observable();
        self.workerId = ko.observable();
        // worker combo
        self.optionsWorkers = ko.observableArray([]);
        self.selectedWorkers = ko.observableArray([]);
        self.sWorker = ko.observable();        
    },
    loadData: function (data) {
        vm.id(data.teamId);
        vm.name(data.name);
        teamDetailAPI.loadWorkerInCharges(data.workerInChargeId);
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#team-form').validate({
            rules: {
                txtName: { required: true },
                cmbWorkerInCharges: { required: true }
            },
            // Messages for form validation
            messages: {
            },
            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#team-form').valid();
    },
    // obtain a  wo group from the API
    getTeam: function (id) {
        if (!id || (id == 0)) {
            // new wo group
            vm.id(0);
            return;
        }
        var url = sprintf("%s/team/%s?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                teamDetailAPI.loadData(data[0]);
                teamLineAPI.getTeamLines(data[0].teamId);
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
            if (!teamDetailAPI.dataOk()) return;
            // dat for post or put
            var data = {
                teamId: vm.id(),
                name: vm.name(),
                workerInChargeId: vm.sWorkerInCharge()
            };
            var url = "", type = "";
            if (vm.id() == 0) {
                // creating new record
                type = "POST";
                url = sprintf('%s/team?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/team/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);
            }
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    if (type == "POST") {
                        vm.id(data.teamId);
                        $('#wid-id-1').show();
                        aswNotif.newMainLines();
                    } else {
                        var url = sprintf('teamGeneral.html?id=%s', data.teamId);
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
    loadWorkerInCharges: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/worker?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: null, name: "" }].concat(data);
                vm.optionsWorkerInCharges(options);
                $("#cmbWorkerInCharges").val([id]).trigger('change');
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
            if (!teamDetailAPI.dataOk()) return;
            var url = "", type = "";

            // fecth report data
            type = "GET";
            url = sprintf('%s/report/team/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);

            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    // process report data
                    aswReport.reportPDF(data, 'HJ8pejnyl');
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




