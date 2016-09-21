/*
 * workerGeneral.js
 * Function for the page workerGeneral.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')

var data = null;

var workerGeneralAPI = {
    init: function () {
        $('#user_name').text(user.name);
        // make active menu option
        $('#workerGeneral').attr('class', 'active');
        workerGeneralAPI.initWorkerTable();
        // avoid sending form 
        $('#workerGeneral-form').submit(function () {
            return false;
        });
        // buttons click events 
        $('#btnNew').click(workerGeneralAPI.newWorker());
        $('#btnSearch').click(workerGeneralAPI.searchWorker());
        // check if there's an id
        var id = aswUtil.gup('id');
        if (id){
            workerGeneralAPI.getWorker(id);
        }
    },
    // initializes the table
    initWorkerTable: function () {
        var options = aswInit.initTableOptions('dt_worker');
        options.data = data;
        options.columns = [{
            data: "name"
        }, {
                data: "user.name"
            }, {
                data: "id",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='workerGeneralAPI.deleteWorkerMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='workerGeneralAPI.editWorker(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                    return html;
                }
            }];
        $('#dt_worker').dataTable(options);
    },
    searchWorker: function () {
        var mf = function () {
            // obtain strin to search 
            var search = $('#txtSearch').val();
            workerGeneralAPI.getWorkers(search);
        };
        return mf;
    },
    newWorker: function () {
        // Its an event handler, return function
        var mf = function () {
            window.open(sprintf('workerDetail.html?id=%s', 0), '_self');
        }
        return mf;
    },
    editWorker: function (id) {
        window.open(sprintf('workerDetail.html?id=%s', id), '_self');
    },
    deleteWorkerMessage: function (id) {
        var url = sprintf("%s/worker/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].name;
                var fn = sprintf('workerGeneralAPI.deleteWorker(%s);', id);
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
    deleteWorker: function (id) {
        var url = sprintf("%s/worker/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                workerGeneralAPI.getWorkers('');
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
    getWorkers: function (name) {
        var url = sprintf("%s/worker?api_key=%s&name=%s", myconfig.apiUrl, api_key, name);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                workerGeneralAPI.loadWorkersTable(data);
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
    getWorker: function (id) {
        var url = sprintf("%s/worker/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                workerGeneralAPI.loadWorkersTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },    
    loadWorkersTable: function (data) {
        var dt = $('#dt_worker').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_worker").show();
    }
};

workerGeneralAPI.init();