/*
 * docGeneral.js
 * Function for the page docGeneral.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')

var data = null;

var docGeneralAPI = {
    init: function () {
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#doc').attr('class', 'active');
        docGeneralAPI.initDocTable();
        docGeneralAPI.getDocs();
        // avoid sending form 
        $('#docGeneral-form').submit(function () {
            return false;
        });
        // buttons click events 
        $('#btnNew').click(docGeneralAPI.newDoc());

    },
    // initializes the table
    initDocTable: function () {
        var options = aswInit.initTableOptions('dt_doc');
        options.data = data;
        options.columns = [{
            data: "name"
        }, {
            data: "docDate",
            render: function (data, type, row) {
                var html = moment(data).format('DD/MM/YYYY');
                return html;
            }
        }, {
            data: "comments"
        }, {
            data: "docId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='docGeneralAPI.deleteDocMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='docGeneralAPI.editDoc(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        $('#dt_doc').dataTable(options);
    },
    newDoc: function () {
        // Its an event handler, return function
        var mf = function () {
            window.open(sprintf('docDetail.html?id=%s', 0), '_self');
        }
        return mf;
    },
    editDoc: function (id) {
        window.open(sprintf('docDetail.html?id=%s', id), '_self');
    },
    deleteDocMessage: function (id) {
        var url = sprintf("%s/doc/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].name;
                var fn = sprintf("docGeneralAPI.deleteDoc(%s);", id);
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
    deleteDoc: function (id) {
        var url = sprintf("%s/doc/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var file = data[0].file;
                var url = sprintf("%s/doc/%s/?api_key=%s&file=%s", myconfig.apiUrl, id, api_key, file);
                var data = {
                    id: id
                };
                $.ajax({
                    type: "DELETE",
                    url: url,
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: function (data, status) {
                        docGeneralAPI.getDocs();
                    },
                    error: function (err) {
                        aswNotif.errAjax(err);
                        if (err.status == 401) {
                            window.open('index.html', '_self');
                        }
                    }
                });                
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
    getDocs: function () {
        var url = sprintf("%s/doc?api_key=%s", myconfig.apiUrl, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                docGeneralAPI.loadDocsTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadDocsTable: function (data) {
        var dt = $('#dt_doc').dataTable();
        dt.fnClearTable();
        if (data && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    }
};

docGeneralAPI.init();