/*
 * docTypeGeneral.js
 * Function for the page docTypeGeneral.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')

var data = null;

var docTypeGeneralAPI = {
    init: function () {
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#docTypeGeneral').attr('class', 'active');
        docTypeGeneralAPI.initDocTypeTable();
        docTypeGeneralAPI.getDocTypes();
        // avoid sending form 
        $('#docTypeGeneral-form').submit(function () {
            return false;
        });
        // buttons click events 
        $('#btnNew').click(docTypeGeneralAPI.newDocType());

    },
    // initializes the table
    initDocTypeTable: function () {
        var options = aswInit.initTableOptions('dt_docType');
        options.data = data;
        options.columns = [{
            data: "name"
        }, {
                data: "id",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='docTypeGeneralAPI.deleteDocTypeMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='docTypeGeneralAPI.editDocType(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                    return html;
                }
            }];
        $('#dt_docType').dataTable(options);
    },
    newDocType: function () {
        // Its an event handler, return function
        var mf = function () {
            window.open(sprintf('docTypeDetail.html?id=%s', 0), '_self');
        }
        return mf;
    },
    editDocType: function (id) {
        window.open(sprintf('docTypeDetail.html?id=%s', id), '_self');
    },
    deleteDocTypeMessage: function (id) {
        var url = sprintf("%s/doc_type/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].name;
                var fn = sprintf('docTypeGeneralAPI.deleteDocType(%s);', id);
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
    deleteDocType: function (id) {
        var url = sprintf("%s/doc_type/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                docTypeGeneralAPI.getDocTypes();
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
    getDocTypes: function () {
        var url = sprintf("%s/doc_type?api_key=%s", myconfig.apiUrl, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                docTypeGeneralAPI.loadDocTypesTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadDocTypesTable: function (data) {
        var dt = $('#dt_docType').dataTable();
        dt.fnClearTable();
        if (data && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    }
};

docTypeGeneralAPI.init();