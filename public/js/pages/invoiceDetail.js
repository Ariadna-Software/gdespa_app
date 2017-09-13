/*
 * invoiceDetail.js
 * Function for the page invoiceDetail.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')
var lang = aswCookies.getCookie('gdespa_lang');


var data = null;
var vm = null;

var invoiceDetailAPI = {
    init: function () {
        aswInit.initPage();
        validator_languages(lang);
        datepicker_languages(lang);
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#invoiceGeneral').attr('class', 'active');
        // knockout management
        vm = new invoiceDetailAPI.pageData();
        ko.applyBindings(vm);
        // buttons click events
        $('#btnOk').click(invoiceDetailAPI.btnOk());
        $('#btnExit').click(function(e){
            e.preventDefault();
            window.open('invoiceGeneral.html', '_self');
        });
        $('#cmbPws').select2(select2_languages[lang]);
        invoiceDetailAPI.loadPws();
        // check if an id have been passed
        var id = aswUtil.gup('id');
        invoiceDetailAPI.getInvoice(id);
    },
    pageData: function () {
        // knockout objects
        var self = this;
        self.invoiceId = ko.observable();
        self.invoiceNumber = ko.observable();
        self.invoiceDate = ko.observable();
        self.comments = ko.observable();
        self.amount = ko.observable();
        // pw combo
        self.optionsPws = ko.observableArray([]);
        self.selectedPws = ko.observableArray([]);
        self.sPw = ko.observable();        
    },
    loadData: function (data) {
        vm.invoiceId(data.invoiceId);
        vm.invoiceNumber(data.invoiceNumber);
        vm.invoiceDate(moment(data.invoiceDate).format(i18n.t("util.date_format")));
        vm.comments(data.comments);
        vm.amount(data.amount);
        invoiceDetailAPI.loadPws(data.pwId);
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#invoiceDetail-form').validate({
            rules: {
                txtInvoiceNumber: { required: true },
                txtInvoiceDate: { required: true },
                cmbPws: { required: true },
                txtAmount: {required: true, number: true}
            },
            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#invoiceDetail-form').valid();
    },
    // obtain a  user group from the API
    getInvoice: function (id) {
        if (!id || (id == 0)) {
            // new user group
            vm.invoiceId(0);
            return;
        }
        var url = sprintf("%s/invoice/%s?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                invoiceDetailAPI.loadData(data[0]);
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
            if (!invoiceDetailAPI.dataOk()) return;
            // dat for post or put
            var data = {
                invoiceId: vm.invoiceId(),
                invoiceNumber: vm.invoiceNumber(),
                comments: vm.comments(),
                amount: vm.amount(),
                pwId: vm.sPw()
            };
            if (moment(vm.invoiceDate(), i18n.t("util.date_format")).isValid()) {
                data.invoiceDate = moment(vm.invoiceDate(), i18n.t("util.date_format")).format(i18n.t("util.date_iso"));
            }
            var url = "", type = "";
            if (vm.invoiceId() == 0) {
                // creating new record
                type = "POST";
                url = sprintf('%s/invoice?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/invoice/%s/?api_key=%s', myconfig.apiUrl, vm.invoiceId(), api_key);
            }
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    window.open('invoiceGeneral.html', '_self');
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
    loadPws: function (id) {
        var myId = id;
        $.ajax({
            type: "GET",
            url: sprintf('%s/pw?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: null, name: "" }];
                var data2 = [];
                if (!user.seeNotOwner) {
                    data.forEach(function (d) {
                        if (user.workOnlyZone && (d.zone.id == user.zoneId || d.zoneId2 == user.zoneId)) {
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
    }
};
invoiceDetailAPI.init();