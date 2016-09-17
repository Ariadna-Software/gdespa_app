var woLineAPI = {
    init: function () {
        // init tables
        woLineAPI.initWoLineTable();
        // button handlers
        $('#btnNewLine').click(woLineAPI.newWoLine());
        // avoid sending form 
        $('#woDetailLine-form').submit(function () {
            return false;
        });
    },
    initWoLineTable: function () {
        var options = aswInit.initTableOptions('dt_woLine');
        options.data = data;
        options.columns = [{
            data: "cunit.name"
        }, {
                data: "quantity"
            }, {
                data: "id",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='woLineAPI.deleteWoLineMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' data-toggle='modal' data-target='#woModal' onclick='woModalAPI.editLine(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                    return html;
                }
            }];
        $('#dt_woLine').dataTable(options);
    },
    newWoLine: function () {
        var mf = function (e) {
            // show modal form
            e.preventDefault();
            woModalAPI.newLine();
        };
        return mf;
    },
    deleteWoLineMessage: function (id) {
        var url = sprintf("%s/wo_line/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].cunit.name + " (Cantidad: " + data[0].quantity + ")";
                var fn = sprintf('woLineAPI.deleteWoLine(%s);', id);
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
    deleteWoLine: function (id) {
        var url = sprintf("%s/wo_line/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                woLineAPI.getWoLines(vm.id());
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('login.html', '_self');
                }
            }
        });
    },
    getWoLines: function (id) {
        var url = sprintf("%s/wo_line/wo/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                woLineAPI.loadWoLinesTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('login.html', '_self');
                }
            }
        });
    },
    loadWoLinesTable: function (data) {
        var dt = $('#dt_woLine').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_woLine").show();
    }
};