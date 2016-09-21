var itemInLineAPI = {
    init: function () {
        // init tables
        itemInLineAPI.initItemInLineTable();
        // button handlers
        $('#btnNewLine').click(itemInLineAPI.newItemInLine());
        // avoid sending form 
        $('#itemInDetail-form').submit(function () {
            return false;
        });
    },
    initItemInLineTable: function () {
        var options = aswInit.initTableOptions('dt_itemInLine');
        options.data = data;
        options.columns = [{
            data: "item.name"
        }, {
                data: "quantity"
            }, {
                data: "id",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='itemInLineAPI.deleteItemInLineMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' data-toggle='modal' data-target='#itemInModal' onclick='itemInModalAPI.editLine(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                    return html;
                }
            }];
        $('#dt_itemInLine').dataTable(options);
    },
    newItemInLine: function () {
        var mf = function (e) {
            // show modal form
            e.preventDefault();
            itemInModalAPI.newLine();
        };
        return mf;
    },
    deleteItemInLineMessage: function (id) {
        var url = sprintf("%s/item_in_line/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].item.name + " (Cantidad: " + data[0].quantity + ")";
                var fn = sprintf('itemInLineAPI.deleteitemInLine(%s);', id);
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
    deleteitemInLine: function (id) {
        var url = sprintf("%s/item_in_line/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                itemInLineAPI.getItemInLines(vm.id());
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    getItemInLines: function (id) {
        var url = sprintf("%s/item_in_line/itemIn/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                itemInLineAPI.loadItemInLinesTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadItemInLinesTable: function (data) {
        var dt = $('#dt_itemInLine').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_itemInLine").show();
    }
};