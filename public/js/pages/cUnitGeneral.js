/*
 * cUnitGeneral.js
 * Function for the page cUnitGeneral.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')

var data = null;

var cUnitGeneralAPI = {
    init: function () {
        $('#user_name').text(user.name);
        // make active menu option
        $('#cUnitGeneral').attr('class', 'active');
        cUnitGeneralAPI.initCUnitTable();
        // avoid sending form 
        $('#cUnitGeneral-form').submit(function () {
            return false;
        });
        // buttons click events 
        $('#btnNew').click(cUnitGeneralAPI.newCUnit());
        $('#btnSearch').click(cUnitGeneralAPI.searchCUnit());
        // check if there's an id
        var id = aswUtil.gup('id');
        if (id) {
            cUnitGeneralAPI.getCUnit(id);
        }
    },
    // initializes the table
    initCUnitTable: function () {
        var options = aswInit.initTableOptions('dt_cUnit');
        options.data = data;
        options.columns = [{
            data: "reference"
        }, {
                data: "name"
            },{
                data: "description"
            }, {
                data: "id",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='cUnitGeneralAPI.deleteCUnitMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='cUnitGeneralAPI.editCUnit(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                    return html;
                }
            }];
        $('#dt_cUnit').dataTable(options);
    },
    searchCUnit: function () {
        var mf = function () {
            // obtain strin to search 
            var search = $('#txtSearch').val();
            cUnitGeneralAPI.getCUnits(search);
        };
        return mf;
    },
    newCUnit: function () {
        // Its an event handler, return function
        var mf = function () {
            window.open(sprintf('cUnitDetail.html?id=%s', 0), '_self');
        }
        return mf;
    },
    editCUnit: function (id) {
        window.open(sprintf('cUnitDetail.html?id=%s', id), '_self');
    },
    deleteCUnitMessage: function (id) {
        var url = sprintf("%s/cunit/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].name;
                var fn = sprintf('cUnitGeneralAPI.deleteCUnit(%s);', id);
                aswNotif.deleteRecordQuestion(name, fn);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('login.html', '_self');
                }
            }
        });
    },
    deleteCUnit: function (id) {
        var url = sprintf("%s/cunit/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                cUnitGeneralAPI.getCUnits('');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('login.html', '_self');
                }
            }
        });
    },
    // obtain user groups from the API
    getCUnits: function (name) {
        var url = sprintf("%s/cunit?api_key=%s&name=%s", myconfig.apiUrl, api_key, name);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                cUnitGeneralAPI.loadCUnitsTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('login.html', '_self');
                }
            }
        });
    },
    // obtain user groups from the API
    getCUnit: function (id) {
        var url = sprintf("%s/cunit/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                cUnitGeneralAPI.loadCUnitsTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('login.html', '_self');
                }
            }
        });
    },
    loadCUnitsTable: function (data) {
        var dt = $('#dt_cUnit').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_cUnit").show();
    }
};

cUnitGeneralAPI.init();