/*
 * deliveryGeneral.js
 * Function for the page deliveryGeneral.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')

var data = null;

var deliveryGeneralAPI = {
    init: function () {
        $('#user_name').text(user.name);
        // make active menu option
        $('#deliveryGeneral').attr('class', 'active');
        deliveryGeneralAPI.initDeliveryPwTable();
        // avoid sending form 
        $('#deliveryGeneral-form').submit(function () {
            return false;
        });
        deliveryGeneralAPI.getPws('');
    },
    // initializes the table
    initDeliveryPwTable: function () {
        var options = aswInit.initTableOptions('dt_delivery');
        options.data = data;
        options.columns = [{
            data: "reference"
        }, {
                data: "name",
            }, {
                data: "initInCharge.name"
            }, {
                data: "id",
                render: function (data, type, row) {
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='deliveryGeneralAPI.getDeliveryPw(" + data + ");' title='Editar registro'> <i class='fa fa-external-link fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt2 + "</div>";
                    return html;
                }
            }];
        $('#dt_delivery').dataTable(options);
    },
    editDelivery: function (id) {
        // obtain delivery from project (getPw)
        window.open(sprintf('deliveryDetail.html?id=%s', id), '_self');
    },
    // obtain projects from the API
    getPws: function () {
        var url = sprintf("%s/pw/active/?api_key=%s", myconfig.apiUrl, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                deliveryGeneralAPI.loadDeliveryPwTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    // obtain projects from the API
    getDeliveryPw: function (id) {
        var url = sprintf("%s/delivery/pw/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                if (data.length == 0) {
                    // new
                    window.open(sprintf('deliveryDetail.html?id=%s&pwId=%s', 0, id), '_self');
                } else {
                    // exist
                    window.open(sprintf('deliveryDetail.html?id=%s&pwId=%s', data[0].id, data[0].pw.id), '_self');
                }
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadDeliveryPwTable: function (data) {
        var dt = $('#dt_delivery').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_delivery").show();
    }
};

deliveryGeneralAPI.init();