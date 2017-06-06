/*
 * pwGeneral.js
 * Function for the page pwGeneral.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')

var data = null;

var pwGeneralAPI = {
    init: function () {
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#pwGeneral').attr('class', 'active');
        pwGeneralAPI.initPwTable();
        // avoid sending form 
        $('#pwGeneral-form').submit(function () {
            return false;
        });
        // buttons click events 
        $('#btnNew').click(pwGeneralAPI.newPw());
        $('#btnSearch').click(pwGeneralAPI.searchPw());
        // check if there's an id
        var id = aswUtil.gup('id');
        if (id) {
            pwGeneralAPI.getPw(id);
        } else {
            // we load all records by default
            pwGeneralAPI.getPws('');
        }
    },
    // initializes the table
    initPwTable: function () {
        var options = aswInit.initTableOptions('dt_pw');
        options.data = data;
        options.columns = [{
            data: "reference"
        }, {
            data: "status.name"
        }, {
            data: "name"
        }, {
            data: "description"
        }, {
            data: "zone.name"
        }, {
            data: "total"
        }, {
            data: "endDate"
        }, {
            data: "percentage",
            render: function (data) {
                return data * 100 + " %";
            }
        }, {
            data: "id",
            render: function (data, type, row) {
                html = "";
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='pwGeneralAPI.deletePwMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='pwGeneralAPI.editPw(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        $('#dt_pw').dataTable(options);
    },
    searchPw: function () {
        var mf = function () {
            // obtain strin to search 
            var search = $('#txtSearch').val();
            pwGeneralAPI.getPws(search);
        };
        return mf;
    },
    newPw: function () {
        // Its an event handler, return function
        var mf = function () {
            window.open(sprintf('pwDetail.html?id=%s', 0), '_self');
        }
        return mf;
    },
    editPw: function (id) {
        window.open(sprintf('pwDetail.html?id=%s', id), '_self');
    },
    deletePwMessage: function (id) {
        var url = sprintf("%s/pw/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].name;
                var fn = sprintf('pwGeneralAPI.deletePw(%s);', id);
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
    deletePw: function (id) {
        var url = sprintf("%s/pw/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                pwGeneralAPI.getPws('');
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
    getPws: function (name) {
        var url = sprintf("%s/pw?api_key=%s&name=%s", myconfig.apiUrl, api_key, name);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var data2 = [];
                if (!user.seeNotOwner) {
                    if (user.worker) {
                        data.forEach(function (d) {
                            if (d.initInCharge.id == user.worker.id) {
                                data2.push(d);
                            }
                        });
                    }
                } else {
                    if (user.seeZone) {
                        data.forEach(function (d) {
                            if (d.zone.id == user.zoneId) {
                                data2.push(d);
                            }
                        })
                    } else {
                        data2 = data;
                    }
                }
                pwGeneralAPI.loadPwsTable(data2);
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
    getPw: function (id) {
        var url = sprintf("%s/pw/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                pwGeneralAPI.loadPwsTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    //
    loadPwsTable: function (data) {
        var dt = $('#dt_pw').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_pw").show();
    }
};

pwGeneralAPI.init();