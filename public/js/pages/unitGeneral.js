/*
 * unitGeneral.js
 * Function for the page unitGeneral.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')

var data = null;

var unitGeneralAPI = {
    init: function () {
        $('#user_name').text(user.name);
        if (user.login != "admin"){
            $('#administration').hide();
        }
        // make active menu option
        $('#unitGeneral').attr('class', 'active');
        unitGeneralAPI.initUnitTable();
        unitGeneralAPI.getUnits();
        // avoid sending form 
        $('#unitGeneral-form').submit(function () {
            return false;
        });
        // buttons click events 
        $('#btnNew').click(unitGeneralAPI.newUnit());

    },
    // initializes the table
    initUnitTable: function () {
        var options = aswInit.initTableOptions('dt_unit');
        options.data = data;
        options.columns = [{
            data: "name"
        },{
            data: "abb"
        }, {
                data: "id",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='unitGeneralAPI.deleteUnitMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='unitGeneralAPI.editUnit(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                    return html;
                }
            }];
        $('#dt_unit').dataTable(options);
    },
    newUnit: function () {
        // Its an event handler, return function
        var mf = function () {
            window.open(sprintf('unitDetail.html?id=%s', 0), '_self');
        }
        return mf;
    },
    editUnit: function (id) {
        window.open(sprintf('unitDetail.html?id=%s', id), '_self');
    },
    deleteUnitMessage: function (id) {
        var url = sprintf("%s/unit/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].name;
                var fn = sprintf('unitGeneralAPI.deleteUnit(%s);', id);
                aswNotif.deleteRecordQuestion(name, fn);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    deleteUnit: function (id) {
        var url = sprintf("%s/unit/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                unitGeneralAPI.getUnits();
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    // obtain user groups from the API
    getUnits: function () {
        var url = sprintf("%s/unit?api_key=%s", myconfig.apiUrl, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                unitGeneralAPI.loadUnitsTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadUnitsTable: function (data) {
        var dt = $('#dt_unit').dataTable();
        dt.fnClearTable();
        if (data && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    }
};

unitGeneralAPI.init();