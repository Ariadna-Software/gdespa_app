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
    // comprobar llamada
    var storeId = aswUtil.gup('storeId');
    var itemId = aswUtil.gup('itemId');
    var pDfecha = aswUtil.gup('pDfecha');
    var pHfecha = aswUtil.gup('pHfecha');
    if (storeId != "") {
        vm.storeId(storeId);
        vm.itemId(itemId);
        vm.pDfecha(pDfecha);
        vm.pHfecha(pHfecha);
        obtainReport();
    }

}

function admData() {
    var self = this;
    //
    self.storeId = ko.observable();
    self.pDfecha = ko.observable();
    self.pHfecha = ko.observable();
    self.itemId = ko.observable();
};

var obtainReport = function () {
    StiOptions.WebServer.url = "/api/streport";
    var file = "../reports/movimiento_articulos.mrt";

    // Create a new report instance
    var report = new Stimulsoft.Report.StiReport();
    report.loadFile(file);
    
    var connectionString = "Server=" + myconfig.report.host + ";";
    connectionString += "Port=" + myconfig.report.port + ";"
    connectionString += "Database=" + myconfig.report.database + ";"
    connectionString += "UserId=" + myconfig.report.user + ";"
    connectionString += "Pwd=" + myconfig.report.password + ";";
    report.dictionary.databases.list[0].connectionString = connectionString;

    // Parámetros
    report.dictionary.variables.items[0].val = vm.pDfecha();
    report.dictionary.variables.items[1].val = vm.pHfecha();
    report.dictionary.variables.items[2].val = moment(vm.pDfecha()).format("DD/MM/YYYY");
    report.dictionary.variables.items[3].val = moment(vm.pHfecha()).format("DD/MM/YYYY");
    report.dictionary.variables.items[4].val = vm.storeId();
    report.dictionary.variables.items[5].val = vm.itemId();

    viewer.report = report;
};
