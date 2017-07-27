/*
 * areaGeneral.js
 * Function for the page areaGeneral.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')

var data = null;

var areaGeneralAPI = {
    init: function () {
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#areaGeneral').attr('class', 'active');
        areaGeneralAPI.initAreaTable();
        areaGeneralAPI.getAreas();
        // avoid sending form 
        $('#areaGeneral-form').submit(function () {
            return false;
        });
        // buttons click events 
        $('#btnNew').click(areaGeneralAPI.newArea());

    },
    // initializes the table
    initAreaTable: function () {
        var options = aswInit.initTableOptions('dt_area');
        options.data = data;
        options.columns = [{
            data: "name"
        }, {
                data: "id",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='areaGeneralAPI.deleteAreaMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='areaGeneralAPI.editArea(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                    return html;
                }
            }];
        $('#dt_area').dataTable(options);
    },
    newArea: function () {
        // Its an event handler, return function
        var mf = function () {
            window.open(sprintf('areaDetail.html?id=%s', 0), '_self');
        }
        return mf;
    },
    editArea: function (id) {
        window.open(sprintf('areaDetail.html?id=%s', id), '_self');
    },
    deleteAreaMessage: function (id) {
        var url = sprintf("%s/area_type/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].name;
                var fn = sprintf('areaGeneralAPI.deleteArea(%s);', id);
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
    deleteArea: function (id) {
        var url = sprintf("%s/area_type/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                areaGeneralAPI.getAreas();
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
    getAreas: function () {
        var url = sprintf("%s/area_type?api_key=%s", myconfig.apiUrl, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                areaGeneralAPI.loadAreasTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadAreasTable: function (data) {
        var dt = $('#dt_area').dataTable();
        dt.fnClearTable();
        if (data && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    }
};

areaGeneralAPI.init();