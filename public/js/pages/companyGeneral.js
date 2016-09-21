/*
 * companyGeneral.js
 * Function for the page companyGeneral.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')

var data = null;

var companyGeneralAPI = {
    init: function () {
        $('#user_name').text(user.name);
        // make active menu option
        $('#companyGeneral').attr('class', 'active');
        companyGeneralAPI.initCompanyTable();
        companyGeneralAPI.getCompanys();
        // avoid sending form 
        $('#companyGeneral-form').submit(function () {
            return false;
        });
        // buttons click events 
        $('#btnNew').click(companyGeneralAPI.newCompany());

    },
    // initializes the table
    initCompanyTable: function () {
        var options = aswInit.initTableOptions('dt_company');
        options.data = data;
        options.columns = [{
            data: "name"
        }, {
                data: "id",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='companyGeneralAPI.deleteCompanyMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='companyGeneralAPI.editCompany(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                    return html;
                }
            }];
        $('#dt_company').dataTable(options);
    },
    newCompany: function () {
        // Its an event handler, return function
        var mf = function () {
            window.open(sprintf('companyDetail.html?id=%s', 0), '_self');
        }
        return mf;
    },
    editCompany: function (id) {
        window.open(sprintf('companyDetail.html?id=%s', id), '_self');
    },
    deleteCompanyMessage: function (id) {
        var url = sprintf("%s/company/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].name;
                var fn = sprintf('companyGeneralAPI.deleteCompany(%s);', id);
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
    deleteCompany: function (id) {
        var url = sprintf("%s/company/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                companyGeneralAPI.getCompanys();
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
    getCompanys: function () {
        var url = sprintf("%s/company?api_key=%s", myconfig.apiUrl, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                companyGeneralAPI.loadCompanysTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadCompanysTable: function (data) {
        var dt = $('#dt_company').dataTable();
        dt.fnClearTable();
        if (data && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    }
};

companyGeneralAPI.init();