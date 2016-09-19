var itemOutLineAPI = {
    init: function () {
        // init tables
        itemOutLineAPI.initItemOutLineTable();
        // button handlers
        $('#btnNewLine').click(itemOutLineAPI.newItemOutLine());
        // avoid sending form 
        $('#itemOutDetail-form').submit(function () {
            return false;
        });
    },
    initItemOutLineTable: function () {
        var options = aswInit.initTableOptions('dt_itemOutLine');
        options.data = data;
        options.columns = [{
            data: "item.name"
        }, {
                data: "quantity"
            }, {
                data: "id",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='itemOutLineAPI.deleteItemOutLineMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' data-toggle='modal' data-target='#itemOutModal' onclick='itemOutModalAPI.editLine(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                    return html;
                }
            }];
        $('#dt_itemOutLine').dataTable(options);
    },
    newItemOutLine: function () {
        var mf = function (e) {
            // show modal form
            e.preventDefault();
            itemOutModalAPI.newLine();
        };
        return mf;
    },
    deleteItemOutLineMessage: function (id) {
        var url = sprintf("%s/item_out_line/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].item.name + " (Cantidad: " + data[0].quantity + ")";
                var fn = sprintf('itemOutLineAPI.deleteItemOutLine(%s);', id);
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
    deleteItemOutLine: function (id) {
        var url = sprintf("%s/item_out_line/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                itemOutLineAPI.getItemOutLines(vm.id());
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('login.html', '_self');
                }
            }
        });
    },
    getItemOutLines: function (id) {
        var url = sprintf("%s/item_out_line/itemOut/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                itemOutLineAPI.loadItemOutLinesTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('login.html', '_self');
                }
            }
        });
    },
    loadItemOutLinesTable: function (data) {
        var dt = $('#dt_itemOutLine').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_itemOutLine").show();
    }
};