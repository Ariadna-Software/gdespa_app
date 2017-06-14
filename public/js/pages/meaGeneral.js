/*
 * meaGeneral.js
 * Function for the page meaGeneral.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')

var data = null;

var meaGeneralAPI = {
    init: function () {
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#meaGeneral').attr('class', 'active');
        meaGeneralAPI.initMeaTable();
        // avoid sending form 
        $('#meaGeneral-form').submit(function () {
            return false;
        });
        // buttons click events 
        $('#btnNew').click(meaGeneralAPI.newMea());
        $('#btnSearch').click(meaGeneralAPI.searchMea());
        // check if there's an id
        var id = aswUtil.gup('id');
        if (id) {
            meaGeneralAPI.getMea(id);
        }
    },
    // initializes the table
    initMeaTable: function () {
        var options = aswInit.initTableOptions('dt_mea');
        options.data = data;
        options.columns = [{
            data: "reference"
        }, {
            data: "name"
        }, {
            data: "meaType"
        }, {
            data: "id",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='meaGeneralAPI.deleteMeaMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='meaGeneralAPI.editMea(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        $('#dt_mea').dataTable(options);
    },
    searchMea: function () {
        var mf = function () {
            // obtain strin to search 
            var search = $('#txtSearch').val();
            meaGeneralAPI.getMeas(search);
        };
        return mf;
    },
    newMea: function () {
        // Its an event handler, return function
        var mf = function () {
            window.open(sprintf('meaDetail.html?id=%s', 0), '_self');
        }
        return mf;
    },
    editMea: function (id) {
        window.open(sprintf('meaDetail.html?id=%s', id), '_self');
    },
    deleteMeaMessage: function (id) {
        var url = sprintf("%s/mea/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].name;
                var fn = sprintf('meaGeneralAPI.deleteMea(%s);', id);
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
    deleteMea: function (id) {
        var url = sprintf("%s/mea/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                meaGeneralAPI.getMeas('');
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
    getMeas: function (name) {
        var url = sprintf("%s/mea?api_key=%s&name=%s", myconfig.apiUrl, api_key, name);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                meaGeneralAPI.loadMeasTable(data);
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
    getMea: function (id) {
        var url = sprintf("%s/mea/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                meaGeneralAPI.loadMeasTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadMeasTable: function (data) {
        var dt = $('#dt_mea').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_mea").show();
    }
};

meaGeneralAPI.init();