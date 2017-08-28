/*
 * luGeneral.js
 * Function for the page luGeneral.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')

var data = null;

var luGeneralAPI = {
    init: function () {
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#luGeneral').attr('class', 'active');
        luGeneralAPI.initMoTable();
        // avoid sending form 
        $('#luGeneral-form').submit(function () {
            return false;
        });
        // buttons click events 
        $('#btnNew').click(luGeneralAPI.newMo());
        $('#btnSearch').click(luGeneralAPI.searchMo());
        //
        $('#chkClosed').change(luGeneralAPI.checkClosedChange());
        // 
        if (!user.modWoClosed) {
            $("#seeClosed").hide();
        }
        // check if there's an id
        var id = aswUtil.gup('id');
        if (id) {
            luGeneralAPI.getMo(id);
        } else {
            luGeneralAPI.getMos('', false);
        }
    },
    // initializes the table
    initMoTable: function () {
        var options = aswInit.initTableOptions('dt_lu');
        options.data = data;
        options.ordering = false;
        options.columns = [{
            data: "teamName"
        }, {
            data: "initDate",
            render: function (data, type, row) {
                // LANG: var html = moment(data).format(i18n.t('util.date_format'));
                var html = moment(data).format('DD/MM/YYYY');
                html = "<div class='asw-center'>" + html + "</div>";
                return html;
            }
        }, {
            data: "worker.name"
        }, {
            data: "comments"
        }, {
            data: "id",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='luGeneralAPI.deleteMoMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='luGeneralAPI.editMo(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        $('#dt_lu').dataTable(options);
    },
    searchMo: function () {
        var mf = function () {
            // obtain strin to search 
            var search = $('#txtSearch').val();
            luGeneralAPI.getMos(search);
        };
        return mf;
    },
    newMo: function () {
        // Its an event handler, return function
        var mf = function () {
            window.open(sprintf('luDetail.html?id=%s', 0), '_self');
        }
        return mf;
    },
    editMo: function (id) {
        window.open(sprintf('luDetail.html?id=%s', id), '_self');
    },
    deleteMoMessage: function (id) {
        var url = sprintf("%s/lu/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].pw.name + " [" + moment(data[0].initDate).format(i18n.t('util.date_format')) + " - " + moment(data[0].endDate).format(i18n.t('util.date_format')) + "]";
                var fn = sprintf('luGeneralAPI.deleteMo(%s);', id);
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
    deleteMo: function (id) {
        var url = sprintf("%s/mo/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                luGeneralAPI.getMos('');
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
    getMos: function (name, chk) {
        var url = sprintf("%s/mo/luminarias/?api_key=%s&name=%s", myconfig.apiUrl, api_key, name);
        if (chk) url = sprintf("%s/mo/luminarias/all/?api_key=%s&name=%s", myconfig.apiUrl, api_key, name);
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
                    if (user.seeZone) {
                        data.forEach(function (d) {
                            if (d.zoneId == user.zoneId) {
                                data2.push(d);
                            }
                        })
                    } else {
                        data2 = data;
                    }
                }
                luGeneralAPI.loadMosTable(data2);
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
    getMo: function (id) {
        var url = sprintf("%s/mo/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                luGeneralAPI.loadMosTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadMosTable: function (data) {
        var dt = $('#dt_lu').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_lu").show();
    },
    checkClosedChange: function () {
        var mf = function () {
            var chk = $(this).is(':checked');
            luGeneralAPI.getMos('', chk);
        }
        return mf;
    }
};

luGeneralAPI.init();