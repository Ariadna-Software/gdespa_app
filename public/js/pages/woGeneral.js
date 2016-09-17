/*
 * woGeneral.js
 * Function for the page woGeneral.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')

var data = null;

var woGeneralAPI = {
    init: function () {
        $('#user_name').text(user.name);
        // make active menu option
        $('#woGeneral').attr('class', 'active');
        woGeneralAPI.initWoTable();
        // avoid sending form 
        $('#woGeneral-form').submit(function () {
            return false;
        });
        // buttons click events 
        $('#btnNew').click(woGeneralAPI.newWo());
        $('#btnSearch').click(woGeneralAPI.searchWo());
        // check if there's an id
        var id = aswUtil.gup('id');
        if (id) {
            woGeneralAPI.getWo(id);
        }else{
            woGeneralAPI.getWo('');
        }
    },
    // initializes the table
    initWoTable: function () {
        var options = aswInit.initTableOptions('dt_wo');
        options.data = data;
        options.columns = [{
            data: "pw.name"
        }, {
                data: "initDate",
                render: function (data, type, row) {
                    // LANG: var html = moment(data).format(i18n.t('util.date_format'));
                    var html = moment(data).format('DD/MM/YYYY');
                    html = "<div class='asw-center'>" + html + "</div>";
                    return html;
                }
            }, {
                data: "endDate",
                render: function (data, type, row) {
                    // LANG: var html = moment(data).format(i18n.t('util.date_format'));
                    var html = moment(data).format('DD/MM/YYYY');
                    html = "<div class='asw-center'>" + html + "</div>";
                    return html;
                }
            }, {
                data: "worker.name"
            }, {
                data: "id",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='woGeneralAPI.deleteWoMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='woGeneralAPI.editWo(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                    return html;
                }
            }];
        $('#dt_wo').dataTable(options);
    },
    searchWo: function () {
        var mf = function () {
            // obtain strin to search 
            var search = $('#txtSearch').val();
            woGeneralAPI.getWos(search);
        };
        return mf;
    },
    newWo: function () {
        // Its an event handler, return function
        var mf = function () {
            window.open(sprintf('woDetail.html?id=%s', 0), '_self');
        }
        return mf;
    },
    editWo: function (id) {
        window.open(sprintf('woDetail.html?id=%s', id), '_self');
    },
    deleteWoMessage: function (id) {
        var url = sprintf("%s/wo/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].pw.name + " [" + moment(data[0].initDate).format(i18n.t('util.date_format')) + " - " + moment(data[0].endDate).format(i18n.t('util.date_format')) + "]" ;
                var fn = sprintf('woGeneralAPI.deleteWo(%s);', id);
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
    deleteWo: function (id) {
        var url = sprintf("%s/wo/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                woGeneralAPI.getWos('');
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
    getWos: function (name) {
        var url = sprintf("%s/wo?api_key=%s&name=%s", myconfig.apiUrl, api_key, name);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                woGeneralAPI.loadWosTable(data);
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
    getWo: function (id) {
        var url = sprintf("%s/wo/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                woGeneralAPI.loadWosTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('login.html', '_self');
                }
            }
        });
    },
    loadWosTable: function (data) {
        var dt = $('#dt_wo').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_wo").show();
    }
};

woGeneralAPI.init();