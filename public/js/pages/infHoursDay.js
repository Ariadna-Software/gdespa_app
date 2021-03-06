// de blank_ (pruebas)
var chart = null;
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')
var lang = aswCookies.getCookie('gdespa_lang');



var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};
// License Key

// Create the report viewer with default options
var viewer = new Stimulsoft.Viewer.StiViewer(null, "StiViewer", false);
var options = new Stimulsoft.Viewer.StiViewerOptions();
StiOptions.WebServer.url = "/api/streport";
Stimulsoft.Base.Localization.StiLocalization.setLocalizationFile("../Localization/es.xml", true);
Stimulsoft.Base.StiLicense.key = "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHltN9ZO4D78QwpEoh6+UpBm5mrGyhSAIsuWoljPQdUv6R6vgv" +
    "iStsx8W3jirJvfPH27oRYrC2WIPEmaoAZTNtqb+nDxUpJlSmG62eA46oRJDV8kJ2cJSEx19GMJXYgZvv7yQT9aJHYa" +
    "SrTVD7wdhpNVS1nQC3OtisVd7MQNQeM40GJxcZpyZDPfvld8mK6VX0RTPJsQZ7UcCEH4Y3LaKzA5DmUS+mwSnjXz/J" +
    "Fv1uO2JNkfcioieXfYfTaBIgZlKecarCS5vBgMrXly3m5kw+YwpJ2v+cMXuDk3UrZgrdxNnOhg8ZHPg9ijHxqUomZZ" +
    "BzKpVQU0d06ne60j/liMH5KirAI2JCVfBcBvIcyliJos8LAWr9q/1sPR9y7LmA1eyS1/dXaxmEaqi5ubhLqlf+OS0x" +
    "FX6tlBBgegqHlIj6Fytwvq5YlGAZ0Cra05JhnKh/ohYlADQz6Jbg5sOKyn5EbejvPS3tWr0LRBH2FO6+mJaSEAwzGm" +
    "oWT057ScSvGgQmfx8wCqSF+PgK/zTzjy75Oh";

options.appearance.scrollbarsMode = true;
options.appearance.fullScreenMode = true;
options.toolbar.showSendEmailButton = true;
//var viewer = new Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);
viewer.onEmailReport = function (event) {
    console.log('EMAIL REPORT');
}

function initForm() {
    aswInit.initPerm(user);
    // datePickerSpanish();
    vm = new admData();
    ko.applyBindings(vm);
    //
    $("#btnImprimir").click(obtainReport);
    // avoid form submmit
    $("#frmHoursDetail").submit(function () {
        return false;
    });
    $('#txtRFecha').daterangepicker({
        "showDropdowns": true,
        "locale": {
            "direction": "ltr",
            "format": "DD/MM/YYYY",
            "separator": " - ",
            "applyLabel": "Aceptar",
            "cancelLabel": "Cancelar",
            "fromLabel": "Desde",
            "toLabel": "Hasta",
            "customRangeLabel": "Personalizado",
            "daysOfWeek": [
                "Do",
                "Lu",
                "Ma",
                "Mi",
                "Ju",
                "Vi",
                "Sa"
            ],
            "monthNames": [
                "Enero",
                "Febrero",
                "Marzo",
                "Abril",
                "Mayo",
                "Junio",
                "Julio",
                "Agosto",
                "Septiembre",
                "Octubre",
                "Noviembre",
                "Diciembre"
            ],
            "firstDay": 1
        },
        "alwaysShowCalendars": true,
        "ranges": {
            'Hoy': [moment(), moment()],
            'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Esta semana': [moment().startOf('week'), moment().endOf('week')],
            'Semana pasada': [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')],
            'Este mes': [moment().startOf('month'), moment().endOf('month')],
            'Último mes': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'Este año': [moment().startOf('year'), moment().endOf('year')],
            'Último año': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')]
        }
    }, function (start, end, label) {
        //alert('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
        vm.dFecha(start.format('YYYY-MM-DD'));
        vm.hFecha(end.format('YYYY-MM-DD'));
    });
    vm.dFecha(moment().format('YYYY-MM-DD'));
    vm.hFecha(moment().format('YYYY-MM-DD'));
    // combos
    $('#cmbWorkers').select2(select2_languages[lang]);
    loadWorkers();
    // comprobar llamada

}

function admData() {
    var self = this;
    self.dFecha = ko.observable();
    self.hFecha = ko.observable();
    self.pwId = ko.observable();
    //
    self.optionsWorkers = ko.observableArray([]);
    self.elegidosWorkers = ko.observableArray([]);
    self.posiblesWorkers = ko.observableArray([]);
    self.sWorker = ko.observable();
    //
    self.detalle = ko.observable();
    //
    self.minWeekHours = ko.observable();
    self.minReportHours = ko.observable();
};

var obtainReport = function () {
    if (!datosOK()) return;
    if (!vm.sWorker()) vm.sWorker(0);
    obtainHoursDay(vm.dFecha(), vm.hFecha(), vm.sWorker());
};

function datosOK() {
    $('#frmHoursDetail').validate({
        rules: {
        },
        // Messages for form validation
        messages: {
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmHoursDetail").validate().settings;
    return $('#frmHoursDetail').valid();
}


var rptWoDetail = function (sql) {
    if (vm.detalle()) {
    } else {
    }
    return sql;
}

var loadWorkers = function (id) {
    $.ajax({
        type: "GET",
        url: sprintf('%s/worker/?api_key=%s', myconfig.apiUrl, api_key),
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var options = [{ id: 0, name: "" }].concat(data);
            vm.posiblesWorkers(options);
            $("#cmbWorkers").val([id]).trigger('change');
        },
        error: function (err) {
            aswNotif.errAjax(err);
            if (err.status == 401) {
                window.open('index.html', '_self');
            }
        }
    });
};

var otainReportInfHoursDay = function (regs) {
    if (!datosOK()) return;
    var file = "../reports/day_hours_rrh0.mrt";
    if (vm.detalle()) file = "../reports/day_hours_rrh1.mrt";

    // Create a new report instance
    var report = new Stimulsoft.Report.StiReport();
    report.loadFile(file);
    //
    var dataSet = new Stimulsoft.System.Data.DataSet("jsHoursDays");
    dataSet.readJson(JSON.stringify(regs));
    // Remove all connections from the report template
    report.dictionary.databases.clear();
    //
    report.dictionary.variables.items[0].val = vm.dFecha();
    report.dictionary.variables.items[1].val = vm.hFecha();
    report.dictionary.variables.items[2].val = moment(vm.dFecha()).format("DD/MM/YYYY");
    report.dictionary.variables.items[3].val = moment(vm.hFecha()).format("DD/MM/YYYY");    
    report.dictionary.variables.items[4].val = vm.minWeekHours();
    report.dictionary.variables.items[5].val = vm.minReportHours();
    //
    report.regData(dataSet.dataSetName, "", dataSet);
    report.dictionary.synchronize();
    // Assign report to the viewer, the report will be built automatically after rendering the viewer
    viewer.report = report;
};


var obtainHoursDay = function (fromDate, toDate, workerId) {
    $("#waitprocess").show();
    var url = sprintf("%s/report/worker-infdays/%s/%s/%s?api_key=%s&fromDate=%s&toDate=%s&workerId=%s", myconfig.apiUrl, fromDate, toDate, workerId, api_key);
    $.ajax({
        type: "GET",
        url: url,
        contentType: "application/json",
        success: function (data, status) {
            $("#waitprocess").hide();
            otainReportInfHoursDay(data);
        },
        error: function (err) {
            $("#waitprocess").hide();
            aswNotif.errAjax(err);
            if (err.status == 401) {
                window.open('index.html', '_self');
            }
        }
    });
}