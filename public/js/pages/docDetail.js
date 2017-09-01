/*
 * docDetail.js
 * Function for the page docDetail.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')
var lang = aswCookies.getCookie('gdespa_lang');


var data = null;
var vm = null;

var docDetailAPI = {
    init: function () {
        aswInit.initPage();
        validator_languages(lang);
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#docGeneral').attr('class', 'active');
        // knockout management
        vm = new docDetailAPI.pageData();
        ko.applyBindings(vm);
        // buttons click events
        $('#btnOk').click(docDetailAPI.btnOk());
        $('#btnExit').click(function(e){
            e.preventDefault();
            window.open('docGeneral.html', '_self');
        })
        // check if an id have been passed
        var id = aswUtil.gup('id');
        docDetailAPI.getDoc(id);
    },
    pageData: function () {
        // knockout objects
        var self = this;
        self.docId = ko.observable();
        self.name = ko.observable();
        self.docDate = ko.observable();
        self.comments = ko.observable();
        self.file = ko.observable();
    },
    loadData: function (data) {
        vm.docId(data.docId);
        vm.name(data.name);
        vm.docDate(moment(data.docDate).format(i18n.t("util.date_format")));
        vm.comments(data.comments);
        vm.file(data.file);
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#docDetail-form').validate({
            rules: {
                txtName: { required: true }
            },
            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#docDetail-form').valid();
    },
    // obtain a  user group from the API
    getDoc: function (id) {
        if (!id || (id == 0)) {
            // new user group
            vm.docId(0);
            return;
        }
        var url = sprintf("%s/doc/%s?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                docDetailAPI.loadData(data[0]);
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
            if (!docDetailAPI.dataOk()) return;
            // dat for post or put
            var data = {
                docId: vm.docId(),
                name: vm.name(),
                comments: vm.comments(),
                file: vm.file()
            };
            if (moment(vm.docDate(), i18n.t("util.date_format")).isValid()) {
                data.docDate = moment(vm.docDate(), i18n.t("util.date_format")).format(i18n.t("util.date_iso"));
            }
            var url = "", type = "";
            if (vm.docId() == 0) {
                // creating new record
                type = "POST";
                url = sprintf('%s/doc?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/doc/%s/?api_key=%s', myconfig.apiUrl, vm.docId(), api_key);
            }
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    window.open('docGeneral.html', '_self');
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
docDetailAPI.init();