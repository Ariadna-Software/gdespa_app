/*
 * itemInGeneral.js
 * Function for the page itemInGeneral.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')

var data = null;

var itemInGeneralAPI = {
    init: function () {
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#itemInGeneral').attr('class', 'active');
        itemInGeneralAPI.inititemInTable();
        // avoid sending form 
        $('#itemInGeneral-form').submit(function () {
            return false;
        });
        // buttons click events 
        $('#btnNew').click(itemInGeneralAPI.newitemIn());
        $('#btnSearch').click(itemInGeneralAPI.searchitemIn());
        // check if there's an id
        var id = aswUtil.gup('id');
        if (id) {
            itemInGeneralAPI.getitemIn(id);
        } else {
            itemInGeneralAPI.getitemIn('');
        }
    },
    // initializes the table
    inititemInTable: function () {
        var options = aswInit.initTableOptions('dt_itemIn');
        options.data = data;
        options.columns = [{
            data: "store.name"
        }, {
                data: "dateIn",
                render: function (data, type, row) {
                    // LANG: var html = moment(data).format(i18n.t('util.date_format'));
                    var html = moment(data).format('DD/MM/YYYY');
                    html = "<div class='asw-center'>" + html + "</div>";
                    return html;
                }
            }, {
                data: "worker.name",
            }, {
                data: "comments"
            }, {
                data: "id",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='itemInGeneralAPI.deleteitemInMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='itemInGeneralAPI.edititemIn(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                    return html;
                }
            }];
        $('#dt_itemIn').dataTable(options);
    },
    searchitemIn: function () {
        var mf = function () {
            // obtain strin to search 
            var search = $('#txtSearch').val();
            itemInGeneralAPI.getitemIns(search);
        };
        return mf;
    },
    newitemIn: function () {
        // Its an event handler, return function
        var mf = function () {
            window.open(sprintf('itemInDetail.html?id=%s', 0), '_self');
        }
        return mf;
    },
    edititemIn: function (id) {
        window.open(sprintf('itemInDetail.html?id=%s', id), '_self');
    },
    deleteitemInMessage: function (id) {
        var url = sprintf("%s/item_in/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].store.name + " [" + moment(data[0].dateIn).format(i18n.t('util.date_format')) + "]";
                var fn = sprintf('itemInGeneralAPI.deleteitemIn(%s);', id);
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
    deleteitemIn: function (id) {
        var url = sprintf("%s/item_in/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                itemInGeneralAPI.getitemIns('');
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
    getitemIns: function (name) {
        var url = sprintf("%s/item_in?api_key=%s&name=%s", myconfig.apiUrl, api_key, name);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                itemInGeneralAPI.loaditemInsTable(data);
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
    getitemIn: function (id) {
        var url = sprintf("%s/item_in/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var data2 = [];
                if (!user.seeNotOwner) {
                    if (user.worker) {
                        data.forEach(function (d) {
                            if (d.worker.id == user.worker.id) {
                                data2.push(d);
                            }
                        });
                    }
                } else {
                    data2 = data;
                }                
                itemInGeneralAPI.loaditemInsTable(data2);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loaditemInsTable: function (data) {
        var dt = $('#dt_itemIn').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_itemIn").show();
    }
};

itemInGeneralAPI.init();