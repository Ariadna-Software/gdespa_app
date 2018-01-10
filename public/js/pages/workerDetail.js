/*
 * workerDetail.js
 * Function for the page workerDetail.html
 */
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')
var lang = aswCookies.getCookie('gdespa_lang');


var data = null;
var vm = null;

var workerDetailAPI = {
    init: function () {
        aswInit.initPage();
        validator_languages(lang);
        datepicker_languages(lang);
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#workerGeneral').attr('class', 'active');
        // knockout management
        vm = new workerDetailAPI.pageData();
        ko.applyBindings(vm);
        // buttons click events
        $('#btnOk').click(workerDetailAPI.btnOk());
        $('#btnExit').click(function (e) {
            e.preventDefault();
            window.open('workerGeneral.html', '_self');
        })
        // combos
        $('#cmbUsers').select2(select2_languages[lang]);
        workerDetailAPI.loadUsers();
        $('#cmbSex').select2(select2_languages[lang]);
        workerDetailAPI.loadSex();
        $('#cmbEmployeeType').select2(select2_languages[lang]);
        workerDetailAPI.loadEmployeeType();       
        $('#cmbIsrCode').select2(select2_languages[lang]);
        workerDetailAPI.loadIsrCode();       
        $('#cmbBankAccountType').select2(select2_languages[lang]);
        workerDetailAPI.loadBankAccountType();               

        $('#cmbResourceTypes').select2(select2_languages[lang]);
        workerDetailAPI.loadResources();
        $("#cmbResourceTypes").select2().on('change', function (e) {
            if (e.added) {
                if (e.added.id == 0) {
                    $("#asWorker").show();
                    $("#asVehicle").hide();
                    $("#asWorker").css('visibility', 'visible');
                    $("#asVehicle").css('visibility', 'hidden');
                } else {
                    $("#asWorker").hide();
                    $("#asVehicle").show();
                    $("#asWorker").css('visibility', 'hidden');
                    $("#asVehicle").css('visibility', 'visible');
                }
            }
        });

        // check if an id have been passed
        var id = aswUtil.gup('id');
        workerDetailAPI.getWorker(id);
        if (id == 0) {
            $("#asWorker").hide();
            $("#asVehicle").hide();
            $("#asWorker").css('visibility', 'hidden');
            $("#asVehicle").css('visibility', 'hidden');
        }
    },
    pageData: function () {
        // knockout objects
        var self = this;
        self.id = ko.observable();
        self.name = ko.observable();
        self.ssId = ko.observable();
        self.address = ko.observable();
        self.zip = ko.observable();
        self.city = ko.observable();
        self.province = ko.observable();
        self.state = ko.observable();
        self.userId = ko.observable();
        self.phone = ko.observable();
        self.email = ko.observable();
        self.code = ko.observable();
        self.position = ko.observable();
        self.department = ko.observable();
        self.cost = ko.observable();
        self.bloodType = ko.observable();
        // users combos
        self.optionsUsers = ko.observableArray([]);
        self.selectedUsers = ko.observableArray([]);
        self.sUser = ko.observable();
        // users combos
        self.optionsResourceTypes = ko.observableArray([]);
        self.selectedResourceTypes = ko.observableArray([]);
        self.sResourceType = ko.observable();
        self.license = ko.observable();
        //
        self.administrative = ko.observable();
        self.active = ko.observable();
        // 
        self.ss = ko.observable();
        self.dv = ko.observable();
        self.bornDate = ko.observable();
        //
        self.optionsSex = ko.observableArray([]);
        self.selectedSex = ko.observableArray([]);
        self.sSex = ko.observable();
        //
        self.contractDate = ko.observable();
        self.riseDate = ko.observable();
        //
        self.optionsEmployeeType = ko.observableArray([]);
        self.selectedEmployeeType = ko.observableArray([]);
        self.sEmployeeType = ko.observable();
        //
        self.payPeriod = ko.observable();
        //
        self.optionsIsrCode = ko.observableArray([]);
        self.selectedIsrCode = ko.observableArray([]);
        self.sIsrCode = ko.observable();
        //
        self.achRoute = ko.observable();
        self.bankAccount = ko.observable();
        //
        self.optionsBankAccountType = ko.observableArray([]);
        self.selectedBankAccountType = ko.observableArray([]);
        self.sBankAccountType = ko.observable();
        //
        self.optionsTeam = ko.observableArray([]);
        self.selectedTeam = ko.observableArray([]);
        self.sTeam = ko.observable();
        //
        self.expirationDate = ko.observable();
        self.terminationDate = ko.observable();
        //
        self.optionsTerminationReason = ko.observableArray([]);
        self.selectedTerminationReason = ko.observableArray([]);
        self.sTerminationReason = ko.observable();

    },
    loadData: function (data) {
        vm.id(data.id);
        vm.name(data.name);
        vm.ssId(data.ssId);
        vm.address(data.address);
        vm.zip(data.zip);
        vm.city(data.city);
        vm.province(data.province);
        vm.state(data.state);
        vm.userId(data.user.id);
        vm.phone(data.phone);
        vm.email(data.email);
        vm.code(data.code);
        vm.position(data.position);
        vm.department(data.department);
        vm.cost(data.cost);
        vm.bloodType(data.bloodType);
        workerDetailAPI.loadUsers(vm.userId());
        workerDetailAPI.loadResources(data.resTypeId);
        vm.license(data.license);
        // control de visualización
        if (data.resTypeId == 1) {
            $("#asWorker").hide();
            $("#asWorker").css('visibility', 'hidden');
        } else {
            $("#asVehicle").hide();
            $("#asVehicle").css('visibility', 'hidden');
        }
        //
        vm.administrative(data.administrative);
        vm.active(data.active);
        vm.ss(data.ss);
        vm.dv(data.dv);
        vm.bornDate(aswUtil.spanishDate(data.bornDate));
        workerDetailAPI.loadSex(data.sex);
        vm.contractDate(aswUtil.spanishDate(data.contractDate));
        vm.riseDate(data.riseDate);
        workerDetailAPI.loadEmployeeType(data.employeeType);
        vm.payPeriod(data.payPeriod);
        workerDetailAPI.loadIsrCode(data.isrCode);
        vm.achRoute(data.achRoute);
        vm.bankAccount(data.bankAccount);
        workerDetailAPI.loadBankAccountType(data.bankAccountType);
        workerDetailAPI.loadTeams(data.teamId);
        vm.expirationDate(aswUtil.spanishDate(data.expirationDate));
        vm.terminationDate(aswUtil.spanishDate(data.terminationDate));
        workerDetailAPI.loadTerminationReason(data.terminationReason);
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#workerDetail-form').validate({
            rules: {
                txtName: {
                    required: true
                },
                cmbResourceTypes: {
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
        return $('#workerDetail-form').valid();
    },
    // obtain a  user group from the API
    getWorker: function (id) {
        if (!id || (id == 0)) {
            // new user group
            vm.id(0);
            return;
        }
        var url = sprintf("%s/worker/%s?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                workerDetailAPI.loadData(data[0]);
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
            if (!workerDetailAPI.dataOk()) return;
            // dat for post or put
            var data = {
                id: vm.id(),
                name: vm.name(),
                ssId: vm.ssId(),
                address: vm.address(),
                zip: vm.zip(),
                city: vm.city(),
                province: vm.province(),
                state: vm.state(),
                user: {
                    id: vm.sUser()
                },
                phone: vm.phone(),
                email: vm.email(),
                code: vm.code(),
                position: vm.position(),
                department: vm.department(),
                cost: vm.cost(),
                bloodType: vm.bloodType(),
                resTypeId: vm.sResourceType(),
                license: vm.license(),
                administrative: vm.administrative(),
                active: vm.active(),
                ss: vm.ss(),
                dv: vm.dv(),
                bornDate: aswUtil.spanishDbDate(vm.bornDate()),
                sex: vm.sSex(),
                contractDate: aswUtil.spanishDbDate(vm.contractDate()),
                raiseDate: aswUtil.spanishDbDate(vm.raiseDate()),
                employeeType: vm.sEmployeeType(),
                payPeriod: vm.payPeriod(),
                isrCode: vm.sIsrCode(),
                achRoute: vm.achRoute(),
                bankAccount: vm.bankAccount(),
                bankAccountType: vm.sBankAccountType(),
                teamId: vm.sTeam(),
                expirationDate: aswUtil.spanishDbDate(vm.expirationDate()),
                terminationDate: aswUtil.spanishDbDate(vm.terminationDate()),
                terminationReason: vm.terminationReason()
            };
            var url = "",
                type = "";
            if (vm.id() == 0) {
                // creating new record
                type = "POST";
                url = sprintf('%s/worker?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/worker/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);
            }
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    var url = sprintf('workerGeneral.html?id=%s', data.id);
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
    loadUsers: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/user?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{
                    id: 0,
                    name: " "
                }].concat(data);
                vm.optionsUsers(options);
                $("#cmbUsers").val([id]).trigger('change');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadResources: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/resourceType?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{
                    resTypeId: 0,
                    name: " "
                }].concat(data);
                vm.optionsResourceTypes(options);
                $("#cmbResourceTypes").val([id]).trigger('change');
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
                var options = [{
                    teamId: 0,
                    name: " "
                }].concat(data);
                vm.optionsTeam(options);
                $("#cmbTeam").val([id]).trigger('change');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadSex: function (id) {
        var options = [
            { sexId: 'H', sexName: 'Hombre' },
            { sexId: 'M', sexName: 'Mujer' }
        ];
        vm.optionsSex(options);
        $("#cmbSex").val([id]).trigger('change');
    },
    loadEmployeeType: function (id) {
        var options = [
            { employeeTypeId: 'S', employeeTypeName: 'Salario fijo' },
            { employeeTypeId: 'H', employeeTypeName: 'Por horas' }

        ];
        vm.optionsEmployeeType(options);
        $("#cmbEmployeeType").val([id]).trigger('change');
    },
    loadIsrCode: function (id) {
        var options = [
            { isrCodeId: 'A', isrCodeName: 'Soltero' },
            { isrCodeId: 'B', isrCodeName: 'Casado sin dependientes' },
            { isrCodeId: 'C', isrCodeName: 'Casado con dependientes' },
            { isrCodeId: 'E', isrCodeName: 'Casado con dependientes, cónyuge no trabaja' },

        ];
        vm.optionsIsrCode(options);
        $("#cmbIsrCode").val([id]).trigger('change');
    },
    loadBankAccountType: function (id) {
        var options = [
            { bankAccountTypeId: 22, bankAccountTypeName: 'Corriente' },
            { bankAccountTypeId: 32, bankAccountTypeName: 'Ahorro' }

        ];
        vm.optionsBankAccountType(options);
        $("#cmbBankAccountType").val([id]).trigger('change');
    },
    loadTerminationReason: function (id) {
        var options = [
            { isrCodeId: 1, isrCodeName: 'Renuncia' },
            { isrCodeId: 6, isrCodeName: 'Despido justificado' },
            { isrCodeId: 7, isrCodeName: 'Despido injustificado' },
            { isrCodeId: 9, isrCodeName: 'Contrato definido' },
            { isrCodeId: 9, isrCodeName: 'Periodo probatorio' }

        ];
        vm.optionsTerminationReason(options);
        $("#cmbTerminationReason").val([id]).trigger('change');
    }
};

workerDetailAPI.init();