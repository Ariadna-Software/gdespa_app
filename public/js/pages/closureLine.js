var closureLineAPI = {
    init: function () {
        // init tables
        closureLineAPI.initClosureLineTable();
        // button handlers
        $('#btnNewLine').click(closureLineAPI.newClosureLine());
        // avoid sending form 
        $('#closureDetailLine-form').submit(function () {
            return false;
        });
    },
    initClosureLineTable: function () {
        var options = aswInit.initTableOptions('dt_closureLine');
        options.data = data;
        options.columns = [{
            data: "pw.name"
        }, {
                data: "estimate"
            }, {
                data: "done"
            }, {
                data: "id",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='closureLineAPI.deleteClosureLineMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' data-toggle='modal' data-target='#closureModal' onclick='closureModalAPI.editLine(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                    return html;
                }
            }];
        $('#dt_closureLine').dataTable(options);
    },
    newClosureLine: function () {
        var mf = function (e) {
            // show modal form
            e.preventDefault();
            closureModalAPI.newLine();
        };
        return mf;
    },
    deleteClosureLineMessage: function (id) {
        var url = sprintf("%s/closure_line/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].cunit.name + " (Cantidad: " + data[0].quantity + ")";
                var fn = sprintf('closureLineAPI.deleteClosureLine(%s);', id);
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
    deleteClosureLine: function (id) {
        var url = sprintf("%s/closure_line/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                closureLineAPI.getClosureLines(vm.id());
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('login.html', '_self');
                }
            }
        });
    },
    getClosureLines: function (id) {
        var url = sprintf("%s/closure_line/closure/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                closureLineAPI.loadClosureLinesTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('login.html', '_self');
                }
            }
        });
    },
    loadClosureLinesTable: function (data) {
        var dt = $('#dt_closureLine').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_closureLine").show();
    }
};