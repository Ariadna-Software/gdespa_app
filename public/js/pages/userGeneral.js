/*
 * userGeneral.js
 * Function for the page userGeneral.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')

var data = null;

var userGeneralAPI = {
    init: function () {
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#userGeneral').attr('class', 'active');
        userGeneralAPI.initUserTable();
        userGeneralAPI.getUsers();
        // avoid sending form 
        $('#userGeneral-form').submit(function () {
            return false;
        });
        // buttons click events 
        $('#btnNew').click(userGeneralAPI.newUser());
    },
    // initializes the table
    initUserTable: function () {
        var options = aswInit.initTableOptions('dt_user');
        options.data = data;
        options.columns = [{
            data: "name"
        }, {
                data: "userGroup.name"
            }, {
                data: "id",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='userGeneralAPI.deleteUserMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='userGeneralAPI.editUser(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                    return html;
                }
            }];
        $('#dt_user').dataTable(options);
    },
    newUser: function () {
        // Its an event handler, return function
        var mf = function () {
            window.open(sprintf('userDetail.html?id=%s', 0), '_self');
        }
        return mf;
    },
    editUser: function (id) {
        window.open(sprintf('userDetail.html?id=%s', id), '_self');
    },
    deleteUserMessage: function (id) {
        var url = sprintf("%s/user/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].name;
                var fn = sprintf('userGeneralAPI.deleteUser(%s);', id);
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
    deleteUser: function (id) {
        var url = sprintf("%s/user/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                userGeneralAPI.getUsers();
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
    getUsers: function () {
        var url = sprintf("%s/user?api_key=%s", myconfig.apiUrl, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                userGeneralAPI.loadUsersTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadUsersTable: function (data) {
        var dt = $('#dt_user').dataTable();
        dt.fnClearTable();
        dt.fnAddData(data);
        dt.fnDraw();
    }
};

userGeneralAPI.init();