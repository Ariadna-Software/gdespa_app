/*
 * itemGeneral.js
 * Function for the page itemGeneral.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')

var data = null;

var itemGeneralAPI = {
    init: function () {
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#itemGeneral').attr('class', 'active');
        itemGeneralAPI.initWorkerTable();
        // avoid sending form 
        $('#itemGeneral-form').submit(function () {
            return false;
        });
        // buttons click events 
        $('#btnNew').click(itemGeneralAPI.newWorker());
        $('#btnSearch').click(itemGeneralAPI.searchWorker());
        // check if there's an id
        var id = aswUtil.gup('id');
        if (id) {
            itemGeneralAPI.getWorker(id);
        }
    },
    // initializes the table
    initWorkerTable: function () {
        var options = aswInit.initTableOptions('dt_item');
        options.data = data;
        options.columns = [{
            data: "reference"
        }, {
                data: "name"
            }, {
                data: "id",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='itemGeneralAPI.deleteWorkerMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='itemGeneralAPI.editWorker(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                    return html;
                }
            }];
        $('#dt_item').dataTable(options);
    },
    searchWorker: function () {
        var mf = function () {
            // obtain strin to search 
            var search = $('#txtSearch').val();
            itemGeneralAPI.getItems(search);
        };
        return mf;
    },
    newWorker: function () {
        // Its an event handler, return function
        var mf = function () {
            window.open(sprintf('itemDetail.html?id=%s', 0), '_self');
        }
        return mf;
    },
    editWorker: function (id) {
        window.open(sprintf('itemDetail.html?id=%s', id), '_self');
    },
    deleteWorkerMessage: function (id) {
        var url = sprintf("%s/item/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].name;
                var fn = sprintf('itemGeneralAPI.deleteWorker(%s);', id);
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
    deleteWorker: function (id) {
        var url = sprintf("%s/item/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                itemGeneralAPI.getItems('');
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
    getItems: function (name) {
        var url = sprintf("%s/item?api_key=%s&name=%s", myconfig.apiUrl, api_key, name);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                itemGeneralAPI.loadItemsTable(data);
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
    getWorker: function (id) {
        var url = sprintf("%s/item/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                itemGeneralAPI.loadItemsTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadItemsTable: function (data) {
        var dt = $('#dt_item').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_item").show();
    }
};

itemGeneralAPI.init();