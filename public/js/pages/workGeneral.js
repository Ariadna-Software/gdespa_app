/*
 * workGeneral.js
 * Function for the page workGeneral.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')

var data = null;

var workGeneralAPI = {
    init: function () {
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#workGeneral').attr('class', 'active');
        workGeneralAPI.initWorkTable();
        workGeneralAPI.getWorks();
        // avoid sending form 
        $('#workGeneral-form').submit(function () {
            return false;
        });
        // buttons click events 
        $('#btnNew').click(workGeneralAPI.newWork());

    },
    // initializes the table
    initWorkTable: function () {
        var options = aswInit.initTableOptions('dt_work');
        options.data = data;
        options.columns = [{
            data: "name"
        }, {
                data: "id",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='workGeneralAPI.deleteWorkMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='workGeneralAPI.editWork(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                    return html;
                }
            }];
        $('#dt_work').dataTable(options);
    },
    newWork: function () {
        // Its an event handler, return function
        var mf = function () {
            window.open(sprintf('workDetail.html?id=%s', 0), '_self');
        }
        return mf;
    },
    editWork: function (id) {
        window.open(sprintf('workDetail.html?id=%s', id), '_self');
    },
    deleteWorkMessage: function (id) {
        var url = sprintf("%s/work_type/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].name;
                var fn = sprintf('workGeneralAPI.deleteWork(%s);', id);
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
    deleteWork: function (id) {
        var url = sprintf("%s/work_type/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                workGeneralAPI.getWorks();
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
    getWorks: function () {
        var url = sprintf("%s/work_type?api_key=%s", myconfig.apiUrl, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                workGeneralAPI.loadWorksTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadWorksTable: function (data) {
        var dt = $('#dt_work').dataTable();
        dt.fnClearTable();
        if (data && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    }
};

workGeneralAPI.init();