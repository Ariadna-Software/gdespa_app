/*
 * userGroupGeneral.js
 * Function for the page userGroupGeneral.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')

var data = null;

var userGroupGeneralAPI = {
    init: function () {
        $('#user_name').text(user.name);
        // make active menu option
        $('#userGroupGeneral').attr('class', 'active');
        userGroupGeneralAPI.initUserGroupTable();
        userGroupGeneralAPI.getUserGroups();
        // avoid sending form 
        $('#userGroupGeneral-form').submit(function () {
            return false;
        });
        // buttons click events 
        $('#btnNew').click(userGroupGeneralAPI.newUserGroup());

    },
    // initializes the table
    initUserGroupTable: function () {
        var options = aswInit.initTableOptions('dt_userGroup');
        options.data = data;
        options.columns = [{
            data: "name"
        }, {
                data: "id",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='userGroupGeneralAPI.deleteUserGroupMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='userGroupGeneralAPI.editUserGroup(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                    return html;
                }
            }];
        $('#dt_userGroup').dataTable(options);
    },
    newUserGroup: function () {
        // Its an event handler, return function
        var mf = function () {
            window.open(sprintf('userGroupDetail.html?id=%s', 0), '_self');
        }
        return mf;
    },
    editUserGroup: function (id) {
        window.open(sprintf('userGroupDetail.html?id=%s', id), '_self');
    },
    deleteUserGroupMessage: function (id) {
        var url = sprintf("%s/user_group/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].name;
                var fn = sprintf('userGroupGeneralAPI.deleteUserGroup(%s);', id);
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
    deleteUserGroup: function (id) {
        var url = sprintf("%s/user_group/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                userGroupGeneralAPI.getUserGroups();
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
    getUserGroups: function () {
        var url = sprintf("%s/user_group?api_key=%s", myconfig.apiUrl, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                userGroupGeneralAPI.loadUserGroupsTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadUserGroupsTable: function (data) {
        var dt = $('#dt_userGroup').dataTable();
        dt.fnClearTable();
        dt.fnAddData(data);
        dt.fnDraw();
    }
};

userGroupGeneralAPI.init();