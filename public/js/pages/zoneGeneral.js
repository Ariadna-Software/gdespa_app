/*
 * zoneGeneral.js
 * Function for the page zoneGeneral.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')

var data = null;

var zoneGeneralAPI = {
    init: function () {
        $('#user_name').text(user.name);
        if (user.login != "admin"){
            $('#administration').hide();
        }
        // make active menu option
        $('#zoneGeneral').attr('class', 'active');
        zoneGeneralAPI.initZoneTable();
        zoneGeneralAPI.getZones();
        // avoid sending form 
        $('#zoneGeneral-form').submit(function () {
            return false;
        });
        // buttons click events 
        $('#btnNew').click(zoneGeneralAPI.newZone());

    },
    // initializes the table
    initZoneTable: function () {
        var options = aswInit.initTableOptions('dt_zone');
        options.data = data;
        options.columns = [{
            data: "name"
        }, {
                data: "id",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='zoneGeneralAPI.deleteZoneMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='zoneGeneralAPI.editZone(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                    return html;
                }
            }];
        $('#dt_zone').dataTable(options);
    },
    newZone: function () {
        // Its an event handler, return function
        var mf = function () {
            window.open(sprintf('zoneDetail.html?id=%s', 0), '_self');
        }
        return mf;
    },
    editZone: function (id) {
        window.open(sprintf('zoneDetail.html?id=%s', id), '_self');
    },
    deleteZoneMessage: function (id) {
        var url = sprintf("%s/zone/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].name;
                var fn = sprintf('zoneGeneralAPI.deleteZone(%s);', id);
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
    deleteZone: function (id) {
        var url = sprintf("%s/zone/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                zoneGeneralAPI.getZones();
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
    getZones: function () {
        var url = sprintf("%s/zone?api_key=%s", myconfig.apiUrl, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                zoneGeneralAPI.loadZonesTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadZonesTable: function (data) {
        var dt = $('#dt_zone').dataTable();
        dt.fnClearTable();
        if (data && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    }
};

zoneGeneralAPI.init();