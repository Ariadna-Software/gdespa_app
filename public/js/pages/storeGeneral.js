/*
 * storeGeneral.js
 * Function for the page storeGeneral.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')

var data = null;

var storeGeneralAPI = {
    init: function () {
        $('#user_name').text(user.name);
        // make active menu option
        $('#storeGeneral').attr('class', 'active');
        storeGeneralAPI.initStoreTable();
        storeGeneralAPI.getStores();
        // avoid sending form 
        $('#storeGeneral-form').submit(function () {
            return false;
        });
        // buttons click events 
        $('#btnNew').click(storeGeneralAPI.newStore());

    },
    // initializes the table
    initStoreTable: function () {
        var options = aswInit.initTableOptions('dt_store');
        options.data = data;
        options.columns = [{
            data: "name"
        }, {
                data: "id",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='storeGeneralAPI.deleteStoreMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='storeGeneralAPI.editStore(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                    return html;
                }
            }];
        $('#dt_store').dataTable(options);
    },
    newStore: function () {
        // Its an event handler, return function
        var mf = function () {
            window.open(sprintf('storeDetail.html?id=%s', 0), '_self');
        }
        return mf;
    },
    editStore: function (id) {
        window.open(sprintf('storeDetail.html?id=%s', id), '_self');
    },
    deleteStoreMessage: function (id) {
        var url = sprintf("%s/store/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].name;
                var fn = sprintf('storeGeneralAPI.deleteStore(%s);', id);
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
    deleteStore: function (id) {
        var url = sprintf("%s/store/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                storeGeneralAPI.getStores();
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
    getStores: function () {
        var url = sprintf("%s/store?api_key=%s", myconfig.apiUrl, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                storeGeneralAPI.loadStoresTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('login.html', '_self');
                }
            }
        });
    },
    loadStoresTable: function (data) {
        var dt = $('#dt_store').dataTable();
        dt.fnClearTable();
        if (data && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    }
};

storeGeneralAPI.init();