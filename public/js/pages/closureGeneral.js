/*
 * closureGeneral.js
 * Function for the page closureGeneral.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')

var data = null;

var closureGeneralAPI = {
    init: function () {
        $('#user_name').text(user.name);
        if (user.login != "admin"){
            $('#administration').hide();
        }
        // make active menu option
        $('#closureGeneral').attr('class', 'active');
        closureGeneralAPI.initClosureTable();
        // avoid sending form 
        $('#closureGeneral-form').submit(function () {
            return false;
        });
        // buttons click events 
        $('#btnNew').click(closureGeneralAPI.newClosure());
        $('#btnSearch').click(closureGeneralAPI.searchClosure());
        // check if there's an id
        var id = aswUtil.gup('id');
        if (id) {
            closureGeneralAPI.getClosure(id);
        }else{
            closureGeneralAPI.getClosure('');
        }
    },
    // initializes the table
    initClosureTable: function () {
        var options = aswInit.initTableOptions('dt_closure');
        options.data = data;
        options.columns = [{
            data: "worker.name"
        }, {
                data: "closureDate",
                render: function (data, type, row) {
                    // LANG: var html = moment(data).format(i18n.t('util.date_format'));
                    var html = moment(data).format('DD/MM/YYYY');
                    html = "<div class='asw-center'>" + html + "</div>";
                    return html;
                }
            }, {
                data: "comments"
            }, {
                data: "id",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='closureGeneralAPI.deleteClosureMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='closureGeneralAPI.editClosure(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                    return html;
                }
            }];
        $('#dt_closure').dataTable(options);
    },
    searchClosure: function () {
        var mf = function () {
            // obtain strin to search 
            var search = $('#txtSearch').val();
            closureGeneralAPI.getClosures(search);
        };
        return mf;
    },
    newClosure: function () {
        // Its an event handler, return function
        var mf = function () {
            window.open(sprintf('closureDetail.html?id=%s', 0), '_self');
        }
        return mf;
    },
    editClosure: function (id) {
        window.open(sprintf('closureDetail.html?id=%s', id), '_self');
    },
    deleteClosureMessage: function (id) {
        var url = sprintf("%s/closure/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].worker.name + " [" + moment(data[0].closureDate).format(i18n.t('util.date_format'))  + "]" ;
                var fn = sprintf('closureGeneralAPI.deleteClosure(%s);', id);
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
    deleteClosure: function (id) {
        var url = sprintf("%s/closure/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                closureGeneralAPI.getClosures('');
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
    getClosures: function (name) {
        var url = sprintf("%s/closure?api_key=%s&name=%s", myconfig.apiUrl, api_key, name);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                closureGeneralAPI.loadClosuresTable(data);
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
    getClosure: function (id) {
        var url = sprintf("%s/closure/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                closureGeneralAPI.loadClosuresTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadClosuresTable: function (data) {
        var dt = $('#dt_closure').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_closure").show();
    }
};

closureGeneralAPI.init();