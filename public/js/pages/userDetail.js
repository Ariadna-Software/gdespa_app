/*
 * userDetail.js
 * Function for the page userDetail.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')
var lang = aswCookies.getCookie('gdespa_lang');


var data = null;
var vm = null;

var userDetailAPI = {
    init: function () {
        aswInit.initPage();
        validator_languages(lang);
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#userGeneral').attr('class', 'active');
        // knockout management
        vm = new userDetailAPI.pageData();
        ko.applyBindings(vm);
        // buttons click events
        $('#btnOk').click(userDetailAPI.btnOk());
        $('#btnExit').click(function (e) {
            e.preventDefault();
            window.open('userGeneral.html', '_self');
        })
        // combos
        $('#cmbLanguages').select2(select2_languages[lang]);
        userDetailAPI.loadLanguages();
        $('#cmbGroups').select2(select2_languages[lang]);
        userDetailAPI.loadGroups();
        $('#cmbZones').select2(select2_languages[lang]);
        userDetailAPI.loadZones();
        // check if an id have been passed
        var id = aswUtil.gup('id');
        userDetailAPI.getUserGroup(id);
    },
    pageData: function () {
        // knockout objects
        var self = this;
        self.id = ko.observable();
        self.name = ko.observable();
        self.login = ko.observable();
        self.password = ko.observable();
        self.userGroupId = ko.observable();
        self.lang = ko.observable();
        self.perAdm = ko.observable();
        self.perGes = ko.observable();
        self.perStore = ko.observable();
        self.perReport = ko.observable();
        self.perInvoice = ko.observable();
        //
        self.PwGeneral = ko.observable();
        self.WoGeneral = ko.observable();
        self.ClosureGeneral = ko.observable();
        self.MeaGeneral = ko.observable();
        self.DeliveryGeneral = ko.observable();
        self.ItemInGeneral = ko.observable();
        self.ItemOutGeneral = ko.observable();
        self.InventoryGeneral = ko.observable();
        self.ModPw = ko.observable();
        self.SeeNotOwner = ko.observable();
        self.ModWoClosed = ko.observable();
        // languages combos
        self.optionsLanguages = ko.observableArray([]);
        self.selectedLanguages = ko.observableArray([]);
        self.sLanguage = ko.observable();
        // user group combos
        self.optionsGroups = ko.observableArray([]);
        self.selectedGroups = ko.observableArray([]);
        self.sGroup = ko.observable();
        // user zone combo
        self.optionsZones = ko.observableArray([]);
        self.selectedZones = ko.observableArray([]);
        self.sZone = ko.observable();
        
        self.seeZone = ko.observable();
        self.workOnlyZone = ko.observable();
        self.seeWoClosed = ko.observable();
        self.perVerified = ko.observable();
        self.perRRHH = ko.observable();
        self.perPwClosed = ko.observable();
        self.perNoDocsInOpen = ko.observable();
    },
    loadData: function (data) {
        vm.id(data.id);
        vm.name(data.name);
        vm.login(data.login);
        vm.password(data.password);
        vm.userGroupId(data.userGroup.id);
        vm.lang(data.lang);
        userDetailAPI.loadLanguages(vm.lang());
        userDetailAPI.loadGroups(vm.userGroupId());
        userDetailAPI.loadZones(data.zoneId);
        vm.perAdm(data.perAdm);
        vm.perGes(data.perGes);
        vm.perStore(data.perStore);
        vm.perReport(data.perReport);
        vm.perInvoice(data.perInvoice);
        //
        vm.PwGeneral(data.pwGeneral);
        vm.WoGeneral(data.woGeneral);
        vm.ClosureGeneral(data.closureGeneral);
        vm.MeaGeneral(data.perMea);
        vm.DeliveryGeneral(data.deliveryGeneral);
        vm.ItemInGeneral(data.itemInGeneral);
        vm.ItemOutGeneral(data.itemOutGeneral);
        vm.InventoryGeneral(data.inventoryGeneral);
        vm.SeeNotOwner(data.seeNotOwner);
        vm.ModWoClosed(data.modWoClosed);
        vm.ModPw(data.modPw);
        vm.seeZone(data.seeZone);
        vm.workOnlyZone(data.workOnlyZone);
        vm.seeWoClosed(data.seeWoClosed);
        vm.perVerified(data.perVerified);
        vm.perRRHH(data.perRRHH);
        vm.perPwClosed(data.perPwClosed);
        vm.perNoDocsInOpen(data.perNoDocsInOpen);
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#userDetail-form').validate({
            rules: {
                txtName: { required: true },
                txtLogin: { required: true },
                txtPassword: { required: true },
                cmbLanguages: { required: true },
                cmbGroups: { required: true },
                cmbZones: { required: true }
            },
            // Messages for form validation
            messages: {
                cmbLanguages: {
                    required: "Debe elegir un idioma"
                },
                cmbGroups: {
                    required: "Debe elegir un grupo"
                }
            },
            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#userDetail-form').valid();
    },
    // obtain a  user group from the API
    getUserGroup: function (id) {
        if (!id || (id == 0)) {
            // new user group
            vm.id(0);
            return;
        }
        var url = sprintf("%s/user/%s?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                userDetailAPI.loadData(data[0]);
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
            if (!userDetailAPI.dataOk()) return;
            // dat for post or put
            var data = {
                id: vm.id(),
                name: vm.name(),
                login: vm.login(),
                password: vm.password(),
                lang: vm.sLanguage(),
                userGroup: {
                    id: vm.sGroup()
                },
                perAdm: vm.perAdm() ? 1 : 0,
                perGes: vm.perGes() ? 1 : 0,
                perStore: vm.perStore() ? 1 : 0,
                perReport: vm.perReport() ? 1 : 0,
                perInvoice: vm.perInvoice() ? 1 : 0,
                pwGeneral: vm.PwGeneral() ? 1 : 0,
                woGeneral: vm.WoGeneral() ? 1 : 0,
                closureGeneral: vm.ClosureGeneral() ? 1 : 0,
                deliveryGeneral: vm.DeliveryGeneral() ? 1 : 0,
                itemInGeneral: vm.ItemInGeneral() ? 1 : 0,
                itemOutGeneral: vm.ItemOutGeneral() ? 1 : 0,
                inventoryGeneral: vm.InventoryGeneral() ? 1 : 0,
                seeNotOwner: vm.SeeNotOwner() ? 1 : 0,
                modPw: vm.ModPw() ? 1 : 0,
                modWoClosed: vm.ModWoClosed() ? 1 : 0,
                zoneId: vm.sZone(),
                seeZone: vm.seeZone(),
                workOnlyZone: vm.workOnlyZone(),
                perMea: vm.MeaGeneral() ? 1 : 0,
                seeWoClosed: vm.seeWoClosed() ? 1 : 0,
                perVerified: vm.perVerified() ? 1 : 0,
                perRRHH: vm.perRRHH() ? 1 : 0,
                perPwClosed: vm.perPwClosed() ? 1 : 0,
                perNoDocsInOpen: vm.perNoDocsInOpen() ? 1 : 0
            };
            var url = "", type = "";
            if (vm.id() == 0) {
                // creating new record
                type = "POST";
                url = sprintf('%s/user?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/user/%s/?api_key=%s', myconfig.apiUrl, vm.id(), api_key);
            }
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    window.open('userGeneral.html', '_self');
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
    loadLanguages: function (id) {
        var langs = [];
        for (var i = 0; i < myconfig.languages.length; i++) {
            langs.push({
                name: myconfig.languages[i]
            })
        }
        var options = [{ name: "" }].concat(langs);
        vm.optionsLanguages(options);
        $("#cmbLanguages").val([id]).trigger('change');
    },
    loadGroups: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/user_group?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: 0, name: " " }].concat(data);
                vm.optionsGroups(options);
                $("#cmbGroups").val([id]).trigger('change');
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
            url: sprintf('%s/zone/?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: 0, name: " " }].concat(data);
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
    }
};

userDetailAPI.init();