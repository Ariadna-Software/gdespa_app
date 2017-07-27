/*
 * insGeneral.js
 * Function for the page insGeneral.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')

var data = null;

var insGeneralAPI = {
    init: function () {
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#insGeneral').attr('class', 'active');
        insGeneralAPI.initInsTable();
        insGeneralAPI.getInss();
        // avoid sending form 
        $('#insGeneral-form').submit(function () {
            return false;
        });
        // buttons click events 
        $('#btnNew').click(insGeneralAPI.newIns());

    },
    // initializes the table
    initInsTable: function () {
        var options = aswInit.initTableOptions('dt_ins');
        options.data = data;
        options.columns = [{
            data: "name"
        }, {
                data: "id",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='insGeneralAPI.deleteInsMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='insGeneralAPI.editIns(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                    return html;
                }
            }];
        $('#dt_ins').dataTable(options);
    },
    newIns: function () {
        // Its an event handler, return function
        var mf = function () {
            window.open(sprintf('insDetail.html?id=%s', 0), '_self');
        }
        return mf;
    },
    editIns: function (id) {
        window.open(sprintf('insDetail.html?id=%s', id), '_self');
    },
    deleteInsMessage: function (id) {
        var url = sprintf("%s/ins_type/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].name;
                var fn = sprintf('insGeneralAPI.deleteIns(%s);', id);
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
    deleteIns: function (id) {
        var url = sprintf("%s/ins_type/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                insGeneralAPI.getInss();
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
    getInss: function () {
        var url = sprintf("%s/ins_type?api_key=%s", myconfig.apiUrl, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                insGeneralAPI.loadInssTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadInssTable: function (data) {
        var dt = $('#dt_ins').dataTable();
        dt.fnClearTable();
        if (data && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    }
};

insGeneralAPI.init();