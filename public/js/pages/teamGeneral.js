/*
 * teamGeneral.js
 * Function for the page teamGeneral.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')

var data = null;

var teamGeneralAPI = {
    init: function () {
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#teamGeneral').attr('class', 'active');
        teamGeneralAPI.initTeamTable();
        // avoid sending form 
        $('#teamGeneral-form').submit(function () {
            return false;
        });
        // buttons click events 
        $('#btnNew').click(teamGeneralAPI.newTeam());
        $('#btnSearch').click(teamGeneralAPI.searchTeam());
        // check if there's an id
        var id = aswUtil.gup('id');
        if (id) {
            teamGeneralAPI.getTeam(id);
        } else {
            teamGeneralAPI.getTeam('');
        }
    },
    // initializes the table
    initTeamTable: function () {
        var options = aswInit.initTableOptions('dt_team');
        options.data = data;
        options.columns = [{
            data: "name"
        }, {
            data: "workerInChargeName",
        }, {
            data: "teamId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='teamGeneralAPI.deleteTeamMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='teamGeneralAPI.editTeam(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        $('#dt_team').dataTable(options);
    },
    searchTeam: function () {
        var mf = function () {
            // obtain strin to search 
            var search = $('#txtSearch').val();
            teamGeneralAPI.getTeams(search);
        };
        return mf;
    },
    newTeam: function () {
        // Its an event handler, return function
        var mf = function () {
            window.open(sprintf('teamDetail.html?id=%s', 0), '_self');
        }
        return mf;
    },
    editTeam: function (id) {
        window.open(sprintf('teamDetail.html?id=%s', id), '_self');
    },
    deleteTeamMessage: function (id) {
        var url = sprintf("%s/team/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].name + " [" + moment(data[0].dateIn).format(i18n.t('util.date_format')) + "]";
                var fn = sprintf('teamGeneralAPI.deleteTeam(%s);', id);
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
    deleteTeam: function (id) {
        var url = sprintf("%s/team/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                teamGeneralAPI.getTeams('');
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
    getTeams: function (name) {
        var url = sprintf("%s/team?api_key=%s&name=%s", myconfig.apiUrl, api_key, name);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                teamGeneralAPI.loadTeamsTable(data);
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
    getTeam: function (id) {
        var url = sprintf("%s/team/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                teamGeneralAPI.loadTeamsTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadTeamsTable: function (data) {
        var dt = $('#dt_team').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_team").show();
    }
};

teamGeneralAPI.init();