var deliveryLineAPI = {
    init: function () {
        // init tables
        deliveryLineAPI.initDeliveryLineTable();
        // avoid sending form 
        $('#delivery-form').submit(function () {
            return false;
        });
        // deliveryModal-form
        $('#deliveryModal-form').submit(function () {
            return false;
        });
        // deliveryDetail-form
        $('#deliveryDetail-form').submit(function () {
            return false;
        });
    },
    initDeliveryLineTable: function () {
        var options = aswInit.initTableOptions('dt_deliveryLine');
        options.data = data;
        options.paging = false;
        options.columns = [{
            data: "item.name"
        }, {
                data: "estimate",
                className: "asw-center"
            }, {
                data: "done",
                className: "asw-center"
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
        $('#dt_deliveryLine').dataTable(options);
    },
    getDeliveryLines: function (id) {
        var url = sprintf("%s/delivery_line/delivery/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                deliveryLineAPI.loadDeliveryLinesTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadDeliveryLinesTable: function (data) {
        var dt = $('#dt_deliveryLine').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_deliveryLine").show();
        // quantity field handlers
        data.forEach(function (v) {
            var field = "#qty" + v.id;
            $(field).val(v.quantity);
            $(field).blur(function () {
                var quantity = 0;
                if ($(field).val() != ""){
                    quantity = parseFloat($(field).val());
                }
                var data = {
                    id: v.id,
                    delivery: {
                        id: v.delivery.id
                    },
                    item: {
                        id: v.item.id
                    },
                    quantity: quantity
                };
                var url = "", type = "";
                // updating record
                var type = "PUT";
                var url = sprintf('%s/delivery_line/%s/?api_key=%s', myconfig.apiUrl, vm.lineId(), api_key);

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
    },
    quantityBlur: function (id) {
        var mf = function () {
            alert("ID: " + id);
        };
        return;
    },
    saveQuantity: function () {
        alert("ID2");
        alert(v.id);
    }
};