/*
 * itemOutGeneral.js
 * Function for the page itemOutGeneral.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')

var data = null;

var itemOutGeneralAPI = {
    init: function () {
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#itemOutGeneral').attr('class', 'active');
        itemOutGeneralAPI.initItemOutTable();
        // avoid sending form 
        $('#itemOutGeneral-form').submit(function () {
            return false;
        });
        // buttons click events 
        $('#btnNew').click(itemOutGeneralAPI.newItemOut());
        $('#btnSearch').click(itemOutGeneralAPI.searchItemOut());
        // check if there's an id
        var id = aswUtil.gup('id');
        if (id) {
            itemOutGeneralAPI.getItemOut(id);
        } else {
            itemOutGeneralAPI.getItemOut('');
        }
    },
    // initializes the table
    initItemOutTable: function () {
        var options = aswInit.initTableOptions('dt_itemOut');
        options.data = data;
        options.columns = [{
            data: "store.name"
        }, {
                data: "dateOut",
                render: function (data, type, row) {
                    // LANG: var html = moment(data).format(i18n.t('util.date_format'));
                    var html = moment(data).format('DD/MM/YYYY');
                    html = "<div class='asw-center'>" + html + "</div>";
                    return html;
                }
            }, {
                data: "worker.name",
            }, {
                data: "pw.name",
            },{
                data: "comments"
            }, {
                data: "id",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='itemOutGeneralAPI.deleteItemOutMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='itemOutGeneralAPI.editItemOut(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                    return html;
                }
            }];
        $('#dt_itemOut').dataTable(options);
    },
    searchItemOut: function () {
        var mf = function () {
            // obtain strin to search 
            var search = $('#txtSearch').val();
            itemOutGeneralAPI.getItemOuts(search);
        };
        return mf;
    },
    newItemOut: function () {
        // Its an event handler, return function
        var mf = function () {
            window.open(sprintf('itemOutDetail.html?id=%s', 0), '_self');
        }
        return mf;
    },
    editItemOut: function (id) {
        window.open(sprintf('itemOutDetail.html?id=%s', id), '_self');
    },
    deleteItemOutMessage: function (id) {
        var url = sprintf("%s/item_out/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].store.name + " [" + moment(data[0].dateOut).format(i18n.t('util.date_format')) + "]";
                var fn = sprintf('itemOutGeneralAPI.deleteItemOut(%s);', id);
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
    deleteItemOut: function (id) {
        var url = sprintf("%s/item_out/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                itemOutGeneralAPI.getItemOuts('');
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
    getItemOuts: function (name) {
        var url = sprintf("%s/item_out?api_key=%s&name=%s", myconfig.apiUrl, api_key, name);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                itemOutGeneralAPI.loadItemOutsTable(data);
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
    getItemOut: function (id) {
        var url = sprintf("%s/item_out/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                itemOutGeneralAPI.loadItemOutsTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadItemOutsTable: function (data) {
        var dt = $('#dt_itemOut').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_itemOut").show();
    }
};

itemOutGeneralAPI.init();