/*
 * absTypeGeneral.js
 * Function for the page absTypeGeneral.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')

var data = null;

var absTypeGeneralAPI = {
    init: function () {
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#absTypeGeneral').attr('class', 'active');
        absTypeGeneralAPI.initAbsTypeTable();
        absTypeGeneralAPI.getAbsTypes();
        // avoid sending form 
        $('#absTypeGeneral-form').submit(function () {
            return false;
        });
        // buttons click events 
        $('#btnNew').click(absTypeGeneralAPI.newAbsType());

    },
    // initializes the table
    initAbsTypeTable: function () {
        var options = aswInit.initTableOptions('dt_absType');
        options.data = data;
        options.columns = [{
            data: "name"
        }, {
                data: "id",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='absTypeGeneralAPI.deleteAbsTypeMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='absTypeGeneralAPI.editAbsType(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                    return html;
                }
            }];
        $('#dt_absType').dataTable(options);
    },
    newAbsType: function () {
        // Its an event handler, return function
        var mf = function () {
            window.open(sprintf('absTypeDetail.html?id=%s', 0), '_self');
        }
        return mf;
    },
    editAbsType: function (id) {
        window.open(sprintf('absTypeDetail.html?id=%s', id), '_self');
    },
    deleteAbsTypeMessage: function (id) {
        var url = sprintf("%s/abs_type/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].name;
                var fn = sprintf('absTypeGeneralAPI.deleteAbsType(%s);', id);
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
    deleteAbsType: function (id) {
        var url = sprintf("%s/abs_type/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                absTypeGeneralAPI.getAbsTypes();
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
    getAbsTypes: function () {
        var url = sprintf("%s/abs_type?api_key=%s", myconfig.apiUrl, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                absTypeGeneralAPI.loadAbsTypesTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadAbsTypesTable: function (data) {
        var dt = $('#dt_absType').dataTable();
        dt.fnClearTable();
        if (data && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    }
};

absTypeGeneralAPI.init();