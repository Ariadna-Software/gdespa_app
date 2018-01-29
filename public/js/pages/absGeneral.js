/*
 * absGeneral.js
 * Function for the page absGeneral.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')

var data = null;

var absGeneralAPI = {
    init: function () {
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#absGeneral').attr('class', 'active');
        absGeneralAPI.initAbsTable();
        absGeneralAPI.getAbss();
        // avoid sending form 
        $('#absGeneral-form').submit(function () {
            return false;
        });
        // buttons click events 
        $('#btnNew').click(absGeneralAPI.newAbs());

    },
    // initializes the table
    initAbsTable: function () {
        var options = aswInit.initTableOptions('dt_abs');
        options.data = data;
        options.columns = [{
            data: "fromDateF",
            render: function (data, type, row) {
                html = "";
                html = moment(data).format("DD/MM/YYYY");
                return html;
            }            
        },{
            data: "toDateF",
            render: function (data, type, row) {
                html = "";
                html = moment(data).format("DD/MM/YYYY");
                return html;
            }            
        },{
            data: "workerName"
        },{
            data: "absTypeName"
        },{
                data: "id",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='absGeneralAPI.deleteAbsMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='absGeneralAPI.editAbs(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                    return html;
                }
            }];
        $('#dt_abs').dataTable(options);
    },
    newAbs: function () {
        // Its an event handler, return function
        var mf = function () {
            window.open(sprintf('absDetail.html?id=%s', 0), '_self');
        }
        return mf;
    },
    editAbs: function (id) {
        window.open(sprintf('absDetail.html?id=%s', id), '_self');
    },
    deleteAbsMessage: function (id) {
        var url = sprintf("%s/abs/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].name;
                var fn = sprintf('absGeneralAPI.deleteAbs(%s);', id);
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
    deleteAbs: function (id) {
        var url = sprintf("%s/abs/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                absGeneralAPI.getAbss();
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
    getAbss: function () {
        var url = sprintf("%s/abs?api_key=%s", myconfig.apiUrl, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                absGeneralAPI.loadAbssTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadAbssTable: function (data) {
        var dt = $('#dt_abs').dataTable();
        dt.fnClearTable();
        if (data && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    }
};

absGeneralAPI.init();