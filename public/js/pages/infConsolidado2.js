// de blank_ (pruebas)
var chart = null;
var responsiveHelper_dt_basic = undefined;
var responsiveHelper_datatable_fixed_column = undefined;
var responsiveHelper_datatable_col_reorder = undefined;
var responsiveHelper_datatable_tabletools = undefined;

var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')
var lang = aswCookies.getCookie('gdespa_lang');
var api_key = aswCookies.getCookie('api_key')



var breakpointDefinition = {
    tablet: 1024,
    phone: 480
};
// License Key

// Create the report viewer with default options
var viewer = new Stimulsoft.Viewer.StiViewer(null, "StiViewer", false);
var options = new Stimulsoft.Viewer.StiViewerOptions();
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
    $("#frmRptOfertas").submit(function () {
        return false;
    });
    $("#frmExportar").submit(function () {
        return false;
    });
    $("#btnExportar").click(exportarPDF);
    //
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
        ranges: {
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
    $('#cmbZonas').select2(select2_languages[lang]);
    loadZonas();
    $("#cmbZonas").select2().on('change', function (e) {
        loadBrigadas(e.added);
    });
    $('#cmbBrigadas').select2(select2_languages[lang]);

    // comprobar llamada
    var pDfecha = aswUtil.gup('pDfecha');
    var pHfecha = aswUtil.gup('pHfecha');
    var excel = aswUtil.gup('excel');
    var status = aswUtil.gup('status');
    if (pDfecha != "" && pHfecha != "") {
        $("#selector").hide();
        vm.dFecha(pDfecha);
        vm.hFecha(pHfecha);
        vm.status(status);
        if (excel == "true") vm.excel(1); else vm.excel(0);
        obtainReport();
        
    }

}

function admData() {
    var self = this;
    self.dFecha = ko.observable();
    self.hFecha = ko.observable();
    self.pwId = ko.observable();
    self.pDfecha = ko.observable();
    self.pHfecha = ko.observable();
    self.workerId = ko.observable();
    //
    self.optionsZonas = ko.observableArray([]);
    self.elegidosZonas = ko.observableArray([]);
    self.posiblesZonas = ko.observableArray([]);
    self.sZona = ko.observable();
    //
    self.optionsBrigadas = ko.observableArray([]);
    self.elegidosBrigadas = ko.observableArray([]);
    self.posiblesBrigadas = ko.observableArray([]);
    self.sBrigada = ko.observable();
    //
    self.detalle = ko.observable();
    self.excel = ko.observable();
    self.status = ko.observable();
};

var obtainReport = function () {
    if (!datosOK()) return;
    StiOptions.WebServer.url = "/api/streport";
    var file = "../reports/consolidado10.mrt";
    if (vm.excel()) file = "../reports/consolidado10x.mrt";
    // Create a new report instance
    var report = new Stimulsoft.Report.StiReport();
    report.loadFile(file);
    //report.setVariable("vTest", "11,16,18");
    //var connectionString = "Server=localhost; Database=proasistencia;UserId=root; Pwd=aritel;";
    var connectionString = "Server=" + myconfig.report.host + ";";
    connectionString += "Port=" + myconfig.report.port + ";"
    connectionString += "Database=" + myconfig.report.database + ";"
    connectionString += "UserId=" + myconfig.report.user + ";"
    connectionString += "Pwd=" + myconfig.report.password + ";";
    report.dictionary.databases.list[0].connectionString = connectionString;
    // Parámetros
    report.dictionary.variables.items[0].val = vm.dFecha();
    report.dictionary.variables.items[1].val = vm.hFecha();
    report.dictionary.variables.items[2].val = moment(vm.dFecha()).format("DD/MM/YYYY");
    report.dictionary.variables.items[3].val = moment(vm.hFecha()).format("DD/MM/YYYY");
    // Assign report to the viewer, the report will be built automatically after rendering the viewer
    if (vm.status() != ""){
        var sql = report.dataSources.items[0].sqlCommand;
        sql += " WHERE t0.statusId = " + vm.status();
        report.dataSources.items[0].sqlCommand = sql;
    }
    viewer.report = report;
};

function datosOK() {
    $('#frmRptOfertas').validate({
        rules: {
            cmbEmpresas: {
                required: true
            }
        },
        // Messages for form validation
        messages: {
            cmbEmpresas: {
                required: "Debe elegir una empresa"
            }
        },
        // Do not change code below
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        }
    });
    var opciones = $("#frmRptOfertas").validate().settings;
    return $('#frmRptOfertas').valid();
}


var rptHousDetail = function (sql) {
    if (vm.workerId()) {
        sql += " AND v.workerId = " + vm.workerId();
    }
    return sql;
}

var exportarPDF = function () {
    $("#mensajeExportacion").hide();
    $("#mensajeEspera").show();
    var clienteId = vm.sclienteId();
    var empresaId = vm.sempresaId();

    if (!empresaId) empresaId = 0;
    if (!clienteId) clienteId = 0;

    var dFecha = vm.dFecha();
    var hFecha = vm.hFecha();

    // (1) Obtener una lista de las facturas implicadas.
    // la lista debe devolver también el fichero de informe asociado
    var url = "/api/facturas/facpdf/" + dFecha + "/" + hFecha;
    url += "/" + empresaId;
    url += "/" + clienteId;
    llamadaAjax("GET", url, null, function (err, data) {
        if (err) return;
    });
}

var loadZonas = function (id) {
    $.ajax({
        type: "GET",
        url: sprintf('%s/zone/?api_key=%s', myconfig.apiUrl, api_key),
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var options = [{ id: 0, name: "" }].concat(data);
            vm.posiblesZonas(options);
            $("#cmbZonas").val([id]).trigger('change');
        },
        error: function (err) {
            aswNotif.errAjax(err);
            if (err.status == 401) {
                window.open('index.html', '_self');
            }
        }
    });
};

var loadBrigadas = function (data) {
    if (!data) return;
    var id = data.id;
    $.ajax({
        type: "GET",
        url: sprintf('%s/team/zone/%s?api_key=%s', myconfig.apiUrl, id, api_key),
        dataType: "json",
        contentType: "application/json",
        success: function (data, status) {
            var options = [{ teamId: 0, name: "" }].concat(data);
            vm.posiblesBrigadas(options);
        },
        error: function (err) {
            aswNotif.errAjax(err);
            if (err.status == 401) {
                window.open('index.html', '_self');
            }
        }
    });
};

var obtainReportWithExcess = function (regs) {
    if (!datosOK()) return;
    var file = "../reports/worker_hours_json.mrt";
    if (aswUtil.gup('rrhh') != "") file = "../reports/rrhh_hours_json.mrt";

    // Create a new report instance
    var report = new Stimulsoft.Report.StiReport();
    report.loadFile(file);
    //
    var dataSet = new Stimulsoft.System.Data.DataSet("jsHours");
    dataSet.readJson(JSON.stringify(regs));
    // Remove all connections from the report template
    report.dictionary.databases.clear();
    //
    report.dictionary.variables.items[0].val = vm.dFecha();
    report.dictionary.variables.items[1].val = vm.hFecha();
    report.dictionary.variables.items[2].val = moment(vm.dFecha()).format("DD/MM/YYYY");
    report.dictionary.variables.items[3].val = moment(vm.hFecha()).format("DD/MM/YYYY");    
    //
    report.regData(dataSet.dataSetName, "", dataSet);
    report.dictionary.synchronize();
    // Assign report to the viewer, the report will be built automatically after rendering the viewer
    viewer.report = report;
};


var obtainHours = function (fromDate, toDate, workerId) {
    $("#waitprocess").show();
    var url = sprintf("%s/worker/hours?api_key=%s&fromDate=%s&toDate=%s&workerId=%s", myconfig.apiUrl, api_key, fromDate, toDate, workerId);
    $.ajax({
        type: "GET",
        url: url,
        contentType: "application/json",
        success: function (data, status) {
            $("#waitprocess").hide();
            obtainReportWithExcess(data);
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