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

        // check if an id have been passed
        var id = aswUtil.gup('id');
        workerDetailAPI.getWorker(id);
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
        self.bloodType = ko.observable();
        // users combos
        self.optionsUsers = ko.observableArray([]);
        self.selectedUsers = ko.observableArray([]);
        self.sUser = ko.observable();
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
        vm.bloodType(data.bloodType);
        workerDetailAPI.loadUsers(vm.userId());
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#workerDetail-form').validate({
            rules: {
                txtName: { required: true },
                txtEmail: { email: true }
            },
            // Messages for form validation
            messages: {
            },
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
                user:{
                    id: vm.sUser()
                },
                phone: vm.phone(),
                email: vm.email(),
                code: vm.code(),
                position: vm.position(),
                department: vm.department(),
                bloodType: vm.bloodType()
            };
            var url = "", type = "";
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
                var options = [{ id: 0, name: " " }].concat(data);
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
    }
};

workerDetailAPI.init();