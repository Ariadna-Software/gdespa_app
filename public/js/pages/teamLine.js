var teamLineAPI = {
    init: function () {
        // init tables
        teamLineAPI.initTeamLineTable();
        // button handlers
        $('#btnNewLine').click(teamLineAPI.newTeamLine());
        // avoid sending form 
        $('#teamDetail-form').submit(function () {
            return false;
        });
    },
    initTeamLineTable: function () {
        var options = aswInit.initTableOptions('dt_teamLine');
        options.data = data;
        options.columns = [{
            data: "workerName"
        }, {
                data: "teamLineId",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='teamLineAPI.deleteTeamLineMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' data-toggle='modal' data-target='#teamModal' onclick='teamModalAPI.editLine(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                    return html;
                }
            }];
        $('#dt_teamLine').dataTable(options);
    },
    newTeamLine: function () {
        var mf = function (e) {
            // show modal form
            e.preventDefault();
            teamModalAPI.newLine();
        };
        return mf;
    },
    deleteTeamLineMessage: function (id) {
        var url = sprintf("%s/team_line/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].workerName;
                var fn = sprintf('teamLineAPI.deleteteamLine(%s);', id);
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
    deleteteamLine: function (id) {
        var url = sprintf("%s/team_line/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                teamLineAPI.getTeamLines(vm.id());
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    getTeamLines: function (id) {
        var url = sprintf("%s/team_line/team/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                teamLineAPI.loadTeamLinesTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadTeamLinesTable: function (data) {
        var dt = $('#dt_teamLine').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_teamLine").show();
    }
};