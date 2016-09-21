/*
 * userGroupDetail.js
 * Function for the page userGroupDetail.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')
var lang = aswCookies.getCookie('gdespa_lang');


var data = null;
var vm = null;

var userGroupDetailAPI = {
    init: function () {
        aswInit.initPage();
        validator_languages(lang);
        $('#user_name').text(user.name);
        // make active menu option
        $('#userGroupGeneral').attr('class', 'active');
        // knockout management
        vm = new userGroupDetailAPI.pageData();
        ko.applyBindings(vm);
        // buttons click events
        $('#btnOk').click(userGroupDetailAPI.btnOk());
        $('#btnExit').click(function(e){
            e.preventDefault();
            window.open('userGroupGeneral.html', '_self');
        })
        // check if an id have been passed
        var id = aswUtil.gup('id');
        userGroupDetailAPI.getUserGroup(id);
    },
    pageData: function () {
        // knockout objects
        var self = this;
        self.id = ko.observable();
        self.name = ko.observable();
        // languages combos
        self.optionsLanguages = ko.observableArray([]);
        self.selectedLanguages = ko.observableArray([]);
        self.sLanguage = ko.observable();
    },
    loadData: function (data) {
        vm.id(data.id);
        vm.name(data.name);
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#userGroupDetail-form').validate({
            rules: {
                txtName: { required: true }
            },
            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#userGroupDetail-form').valid();
    },
    // obtain a  user group from the API
    getUserGroup: function (id) {
        if (!id || (id == 0)) {
            // new user group
            vm.id(0);
            return;
        }
        var url = sprintf("%s/user_group/%s?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                userGroupDetailAPI.loadData(data[0]);
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
            if (!userGroupDetailAPI.dataOk()) return;
            // dat for post or put
            var data = {
                id: vm.id(),
                name: vm.name()
            };
            var url = "", type = "";
            if (vm.id() == 0) {
                // creating new record
                type = "POST";
                url = sprintf('%s/user_group?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/user_group/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);
            }
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    window.open('userGroupGeneral.html', '_self');
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
userGroupDetailAPI.init();