var cUnitLineAPI = {
    init: function(){
        // init tables
        cUnitLineAPI.initCUnitLineTable();
        // button handlers
        $('#btnNewLine').click(cUnitLineAPI.newCUnitLine());
        // avoid sending form 
        $('#cUnitDetailLine-form').submit(function () {
            return false;
        });
    },
    initCUnitLineTable: function () {
        var options = aswInit.initTableOptions('dt_cUnitLine');
        options.data = data;
        options.columns = [{
            data: "line"
        }, {
                data: "item.name"
            }, {
                data: "unit.abb"
            }, {
                data: "quantity"
            }, {
                data: "id",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='cUnitLineAPI.deleteCUnitLineMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' data-toggle='modal' data-target='#cUnitModal' onclick='cUnitModalAPI.editLine(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                    return html;
                }
            }];
        $('#dt_cUnitLine').dataTable(options);
    },
    newCUnitLine: function(){
        var mf = function(e){
            // show modal form
            e.preventDefault();
            cUnitModalAPI.newLine();
        };
        return mf;
    },
    deleteCUnitLineMessage: function (id) {
        var url = sprintf("%s/cunit_line/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].item.name;
                var fn = sprintf('cUnitLineAPI.deleteCUnitLine(%s);', id);
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
    deleteCUnitLine: function (id) {
        var url = sprintf("%s/cunit_line/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                cUnitLineAPI.getCUnitLines(vm.id());
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    getCUnitLines: function (id) {
        var url = sprintf("%s/cunit_line/cunit/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                cUnitLineAPI.loadCUnitLinesTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadCUnitLinesTable: function (data) {
        var dt = $('#dt_cUnitLine').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_cUnitLine").show();
    }
};