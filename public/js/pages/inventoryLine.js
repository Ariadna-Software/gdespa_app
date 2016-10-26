var inventoryLineAPI = {
    init: function () {
        // init tables
        inventoryLineAPI.initInventoryLineTable();
    },
    initInventoryLineTable: function () {
        var options = aswInit.initTableOptions('dt_inventoryLine');
        options.data = data;
        options.paging = false;
        options.columns = [{
            data: "item.name"
        }, {
                data: "oldStock",
                render: function (data, type, row) {
                    var html = data  ;
                    return html;
                }
            }, {
                data: "id",
                width: "10%",
                render: function (data, type, row) {
                    var html = '<label class="input">';
                    html += sprintf('<input class="asw-center" id="qty%s" name="qty%s" type="text"/>', data, data);
                    html += '</label>';
                    return html;
                }
            }];
        $('#dt_inventoryLine').dataTable(options);
    },
    getInventoryLines: function (id) {
        var url = sprintf("%s/inventory_line/inventory/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                inventoryLineAPI.loadInventoryLinesTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadInventoryLinesTable: function (data) {
        var dt = $('#dt_inventoryLine').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_inventoryLine").show();
        // quantity field handlers
        data.forEach(function (v) {
            var field = "#qty" + v.id;
            $(field).val(v.newStock);
            if (vm.close()){
                $(field).attr('disabled', 'true');
            }
            $(field).blur(function () {
                var quantity = 0;
                if ($(field).val() != ""){
                    quantity = parseFloat($(field).val());
                }
                if (quantity < 0){
                    aswNotif.generalMessage(i18n.t('negative_inventory'));
                    return;
                }
                var data = {
                    id: v.id,
                    inventory: {
                        id: v.inventory.id
                    },
                    item: {
                        id: v.item.id
                    },
                    newStock: quantity
                };
                var url = "", type = "";
                // updating record
                var type = "PUT";
                var url = sprintf('%s/inventory_line/%s/?api_key=%s', myconfig.apiUrl, v.id, api_key);

                $.ajax({
                    type: type,
                    url: url,
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: function (data, status) {
                    },
                    error: function (err) {
                        aswNotif.errAjax(err);
                        if (err.status == 401) {
                            window.open('index.html', '_self');
                        }
                    }
                });
            })
        });        
    }
};