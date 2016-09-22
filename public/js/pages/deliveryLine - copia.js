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
        options.columns = [{
            data: "item.name"
        }, {
                data: "estimate"
            }, {
                data: "done"
            }, {
                data: "quantity"
            }, {
                data: "id",
                render: function (data, type, row) {
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' data-toggle='modal' data-target='#deliveryModal' onclick='deliveryModalAPI.editLine(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt2 + "</div>";
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
    }
};