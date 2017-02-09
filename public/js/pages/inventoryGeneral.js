/*
 * inventoryGeneral.js
 * Function for the page inventoryGeneral.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')

var data = null;

var inventoryGeneralAPI = {
    init: function () {
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#inventoryGeneral').attr('class', 'active');
        inventoryGeneralAPI.initInventoryTable();
        // avoid sending form 
        $('#inventoryGeneral-form').submit(function () {
            return false;
        });
        // buttons click events 
        $('#btnNew').click(inventoryGeneralAPI.newInventory());
        $('#btnSearch').click(inventoryGeneralAPI.searchInventory());
        // check if there's an id
        var id = aswUtil.gup('id');
        if (id) {
            inventoryGeneralAPI.getInventory(id);
        } else {
            inventoryGeneralAPI.getInventory('');
        }
    },
    // initializes the table
    initInventoryTable: function () {
        var options = aswInit.initTableOptions('dt_inventory');
        options.data = data;
        options.columns = [{
            data: "store.name"
        }, {
            data: "worker.name"
        }, {
            data: "inventoryDate",
            render: function (data, type, row) {
                // LANG: var html = moment(data).format(i18n.t('util.date_format'));
                var html = moment(data).format('DD/MM/YYYY');
                html = "<div class='asw-center'>" + html + "</div>";
                return html;
            }
        }, {
            data: "comments"
        }, {
            data: "id",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='inventoryGeneralAPI.deleteInventoryMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='inventoryGeneralAPI.editInventory(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        $('#dt_inventory').dataTable(options);
    },
    searchInventory: function () {
        var mf = function () {
            // obtain strin to search 
            var search = $('#txtSearch').val();
            inventoryGeneralAPI.getInventorys(search);
        };
        return mf;
    },
    newInventory: function () {
        // Its an event handler, return function
        var mf = function () {
            window.open(sprintf('inventoryDetail.html?id=%s', 0), '_self');
        }
        return mf;
    },
    editInventory: function (id) {
        window.open(sprintf('inventoryDetail.html?id=%s', id), '_self');
    },
    deleteInventoryMessage: function (id) {
        var url = sprintf("%s/inventory/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].worker.name + " [" + moment(data[0].inventoryDate).format(i18n.t('util.date_format')) + "]";
                var fn = sprintf('inventoryGeneralAPI.deleteInventory(%s);', id);
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
    deleteInventory: function (id) {
        var url = sprintf("%s/inventory/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                inventoryGeneralAPI.getInventorys('');
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
    getInventorys: function (name) {
        var url = sprintf("%s/inventory?api_key=%s&name=%s", myconfig.apiUrl, api_key, name);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var data2 = [];
                if (!user.seeNotOwner) {
                    data.forEach(function (d) {
                        if (user.seeZone && (d.zoneId == user.zoneId)) {
                            data2.push(d);
                        }
                    });
                } else {
                    data2 = data;
                }
                inventoryGeneralAPI.loadInventorysTable(data2);
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
    getInventory: function (id) {
        var url = sprintf("%s/inventory/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var data2 = [];
                if (!user.seeNotOwner) {
                    data.forEach(function (d) {
                        if (user.seeZone && (d.zoneId == user.zoneId)) {
                            data2.push(d);
                        }
                    });
                } else {
                    data2 = data;
                }
                inventoryGeneralAPI.loadInventorysTable(data2);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadInventorysTable: function (data) {
        var dt = $('#dt_inventory').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_inventory").show();
    }
};

inventoryGeneralAPI.init();