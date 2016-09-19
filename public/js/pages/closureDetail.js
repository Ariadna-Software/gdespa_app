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
        // make active menu option
        $('#closureGeneral').attr('class', 'active');
        // knockout management
        vm = new closureDetailAPI.pageData();
        ko.applyBindings(vm);
        //
        $('#cmbWorkers').select2(select2_languages[lang]);
        closureDetailAPI.loadWorkers();
        // buttons click events
        $('#btnOk').click(closureDetailAPI.btnOk());
        $('#btnExit').click(function (e) {
            e.preventDefault();
            window.open('closureGeneral.html', '_self');
        })
        // init lines table
        closureLineAPI.init();
        // init modal form
        closureModalAPI.init();
        // check if an id have been passed
        var id = aswUtil.gup('id');
        // if it is an update show lines
        if (id != 0) {
            $('#wid-id-1').show();
        }
        closureDetailAPI.getClosure(id);
    },
    pageData: function () {
        // knockout objects
        var self = this;
        self.id = ko.observable();
        self.closureDate = ko.observable();
        self.comments = ko.observable();
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
    },
    loadData: function (data) {
        vm.id(data.id);
        vm.closureDate(moment(data.initDate).format(i18n.t('util.date_format')));
        vm.comments(data.comments);
        closureDetailAPI.loadWorkers(data.worker.id);
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
            if (!closureDetailAPI.dataOk()) return;
            // dat for post or put
            var data = {
                id: vm.id(),
                closuretDate: moment(vm.closuretDate(), i18n.t('util.date_format')).format(i18n.t('util.date_iso')),
                worker: {
                    id: vm.sWorker()
                },
                comments: vm.comments()
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
                        aswNotif.newMainLines();
                    } else {
                        var url = sprintf('closureGeneral.html?id=%s', data.id);
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
            url: sprintf('%s/closurerker?api_key=%s', myconfig.apiUrl, api_key),
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
    }
};




