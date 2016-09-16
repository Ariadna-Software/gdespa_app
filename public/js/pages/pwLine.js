var pwLineAPI = {
    init: function () {
        // init tables
        pwLineAPI.initPwLineTable();
        // button handlers
        $('#btnNewLine').click(pwLineAPI.newPwLine());
        // avoid sending form 
        $('#pwDetailLine-form').submit(function () {
            return false;
        });
    },
    initPwLineTable: function () {
        var options = aswInit.initTableOptions('dt_pwLine');
        options.data = data;
        options.columns = [{
            data: "line"
        }, {
                data: "cunit.name"
            }, {
                data: "cost"
            }, {
                data: "k"
            }, {
                data: "amount"
            }, {
                data: "id",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='pwLineAPI.deletePwLineMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' data-toggle='modal' data-target='#pwModal' onclick='pwModalAPI.editLine(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                    return html;
                }
            }];
        $('#dt_pwLine').dataTable(options);
    },
    newPwLine: function () {
        var mf = function (e) {
            // show modal form
            e.preventDefault();
            pwModalAPI.newLine();
        };
        return mf;
    },
    deletePwLineMessage: function (id) {
        var url = sprintf("%s/pw_line/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].cunit.name;
                var fn = sprintf('pwLineAPI.deletePwLine(%s);', id);
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
    deletePwLine: function (id) {
        var url = sprintf("%s/pw_line/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id,
            pw: {
                id: vm.id()
            }
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // pwLineAPI.getPwLines(vm.id());
                pwDetailAPI.getPw(vm.id());
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('login.html', '_self');
                }
            }
        });
    },
    getPwLines: function (id) {
        var url = sprintf("%s/pw_line/pw/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                pwLineAPI.loadPwLinesTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('login.html', '_self');
                }
            }
        });
    },
    loadPwLinesTable: function (data) {
        var dt = $('#dt_pwLine').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_pwLine").show();
    }
};