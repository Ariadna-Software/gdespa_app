/*
 * reportGeneral.js
 * Function for the page reportGeneral.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')
var lang = aswCookies.getCookie('gdespa_lang');


var data = null;
var vm = null;

var reportGeneralAPI = {
    init: function () {
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        validator_languages(lang);
        datepicker_languages(lang);
        // make active menu option
        $('#rrhh-report').attr('class', 'active');
        // avoid sending form 
        $('#expExcel-form').submit(function () {
            return false;
        });
        $('#btnExport').click(reportGeneralAPI.exportExcel);
        // knockout management
        vm = new reportGeneralAPI.pageData();
        ko.applyBindings(vm);
    },
    pageData: function () {
        var self = this;
        self.initDate = ko.observable();
        self.endDate = ko.observable();
    },
    exportExcel: function () {
        var fromDate =  moment(vm.initDate(), 'DD/MM/YYYY').format('YYYY-MM-DD') ;
        var toDate =  moment(vm.endDate(), 'DD/MM/YYYY').format('YYYY-MM-DD');
        var url = sprintf("%s/worker/hoursxls?api_key=%s&fromDate=%s&toDate=%s&workerId=%s", myconfig.apiUrl, api_key, fromDate, toDate, 0);
        aswUtil.llamadaAjax("GET", url, null, function (err, data) {
            if (err) return;
            aswNotif.generalMessage(i18n.t('rrHH.expExcelOk'));
            window.open(data, '_new');
        });
    }
};

reportGeneralAPI.init();