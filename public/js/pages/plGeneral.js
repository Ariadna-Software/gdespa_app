/*
 * plGeneral.js
 * Function for the page plGeneral.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')

var data = null;

var plGeneralAPI = {
    init: function () {
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#plGeneral').attr('class', 'active');
        plGeneralAPI.initPlTable();
        // avoid sending form 
        $('#plGeneral-form').submit(function () {
            return false;
        });
        // buttons click events 
        $('#btnNew').click(plGeneralAPI.newPl());
        $('#btnSearch').click(plGeneralAPI.searchPl());
        //
        $('#chkClosed').change(plGeneralAPI.checkClosedChange());
        // 
        if (!user.perSeePlansClosed){
            $("#seeClosed").hide();
        }
        // check if there's an id
        var id = aswUtil.gup('id');
        if (id) {
            plGeneralAPI.getPl(id);
        } else {
            plGeneralAPI.getPls('', false);
        }
    },
    // initializes the table
    initPlTable: function () {
        var options = aswInit.initTableOptions('dt_pl');
        options.data = data;
        options.ordering = false;
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
            data: "worker.name"
        }, {
            data: "comments"
        }, {
            data: "id",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='plGeneralAPI.deletePlMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='plGeneralAPI.editPl(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        $('#dt_pl').dataTable(options);
    },
    searchPl: function () {
        var mf = function () {
            // obtain strin to search 
            var search = $('#txtSearch').val();
            plGeneralAPI.getPls(search);
        };
        return mf;
    },
    newPl: function () {
        // Its an event handler, return function
        var mf = function () {
            window.open(sprintf('plDetail.html?id=%s', 0), '_self');
        }
        return mf;
    },
    editPl: function (id) {
        var url = sprintf("%s/pl/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var closed = false;
                if (data.length && data[0].closureId) {
                    closed = true;
                }
                window.open(sprintf('plDetail.html?id=%s&closed=%s', id, closed), '_self');        
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });        
    },
    deletePlMessage: function (id) {
        var url = sprintf("%s/pl/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].pw.name + " [" + moment(data[0].initDate).format(i18n.t('util.date_format')) + "]";
                var fn = sprintf('plGeneralAPI.deletePl(%s);', id);
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
    deletePl: function (id) {
        var url = sprintf("%s/pl/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                plGeneralAPI.getPls('');
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
    getPls: function (name, chk) {
        var url = sprintf("%s/pl?api_key=%s&name=%s", myconfig.apiUrl, api_key, name);
        if (chk) url = sprintf("%s/pl/all/?api_key=%s&name=%s", myconfig.apiUrl, api_key, name);
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
                        data.forEach(function(d){
                            if (d.zoneId == user.zoneId || d.zoneId2 == user.zoneId) {
                                data2.push(d);
                            }
                        })
                    } else {
                        data2 = data;
                    }                    
                }
                plGeneralAPI.loadPlsTable(data2);
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
    getPl: function (id) {
        var url = sprintf("%s/pl/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                plGeneralAPI.loadPlsTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadPlsTable: function (data) {
        var dt = $('#dt_pl').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_pl").show();
    },
    checkClosedChange: function () {
        var mf = function () {
            var chk = $(this).is(':checked');
            plGeneralAPI.getPls('', chk);
        }
        return mf;
    }
};

plGeneralAPI.init();