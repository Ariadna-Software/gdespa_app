/*
 * invoiceGeneral.js
 * Function for the page invoiceGeneral.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')

var data = null;

var invoiceGeneralAPI = {
    init: function () {
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#invoiceGeneral').attr('class', 'active');
        invoiceGeneralAPI.initInvoiceTable();
        invoiceGeneralAPI.getInvoices();
        // avoid sending form 
        $('#invoiceGeneral-form').submit(function () {
            return false;
        });
        // buttons click events 
        $('#btnNew').click(invoiceGeneralAPI.newInvoice());

    },
    // initializes the table
    initInvoiceTable: function () {
        var options = aswInit.initTableOptions('dt_invoice');
        options.data = data;
        options.columns = [{
            data: "invoiceNumber"
        },{
            data: "invoiceDate",
            render: function (data, type, row) {
                var html = moment(data).format('DD/MM/YYYY');
                return html;
            }
        },{
            data: "pwName"
        },{
            data: "amount"
        },{
            data: "comments"
        }, {
                data: "invoiceId",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='invoiceGeneralAPI.deleteInvoiceMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='invoiceGeneralAPI.editInvoice(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                    return html;
                }
            }];
        $('#dt_invoice').dataTable(options);
    },
    newInvoice: function () {
        // Its an event handler, return function
        var mf = function () {
            window.open(sprintf('invoiceDetail.html?id=%s', 0), '_self');
        }
        return mf;
    },
    editInvoice: function (id) {
        window.open(sprintf('invoiceDetail.html?id=%s', id), '_self');
    },
    deleteInvoiceMessage: function (id) {
        var url = sprintf("%s/invoice/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].invoiceNumber;
                var fn = sprintf('invoiceGeneralAPI.deleteInvoice(%s);', id);
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
    deleteInvoice: function (id) {
        var url = sprintf("%s/invoice/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                invoiceGeneralAPI.getInvoices();
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    // obtain user groups from the API
    getInvoices: function () {
        var url = sprintf("%s/invoice?api_key=%s", myconfig.apiUrl, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                invoiceGeneralAPI.loadInvoicesTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadInvoicesTable: function (data) {
        var dt = $('#dt_invoice').dataTable();
        dt.fnClearTable();
        if (data && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    }
};

invoiceGeneralAPI.init();