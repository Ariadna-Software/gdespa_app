var pwLineAPI = {
    init: function () {
        // init tables
        pwLineAPI.initPwLineTable();
        pwLineAPI.initPwWorkerTable();
        // button handlers
        $('#btnNewLine').click(pwLineAPI.newPwLine());
        $('#btnNewWorker').click(pwLineAPI.newPwWorker());
        // avoid sending form 
        $('#pwDetailLine-form').submit(function () {
            return false;
        });
        $('#pwDetailWorker-form').submit(function () {
            return false;
        });
    },
    // ---------- PW_LINE
    initPwLineTable: function () {
        var options = aswInit.initTableOptions('dt_pwLine');
        options.data = data;
        options.columns = [{
            data: "composite"
        }, {
            data: "line"
        }, {
            data: "cunit.name"
        }, {
            data: "cost"
        }, {
            data: "quantity"
        }, {
            data: "k"
        }, {
            data: "amount"
        }, {
            data: "comments"
        }, {
            data: "id",
            render: function (data, type, row) {
                var html = "";
                var bt1 = "<button class='btn btn-circle btn-danger btn-md' onclick='pwLineAPI.deletePwLineMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-md' data-toggle='modal' data-target='#pwModal' onclick='pwModalAPI.editLine(" + data + ");' title='Editar registro'> <i class='fa fa-pencil fa-fw'></i> </button>";
                html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                if (vm.sStatus() > 0 && !user.modPw) {
                    html = "";
                }
                return html;
            }
        }];
        // Group by chapter
        options.drawCallback = function (oSettings) {
            responsiveHelper_dt_basic.respond();
            var api = this.api();
            var rows = api.rows({
                page: 'current'
            }).nodes();
            var last = null;
            api.column(0, {
                page: 'current'
            }).data().each(function (group, i, v1, v2, v3, v4) {
                if (last !== group) {
                    var composite = JSON.parse(group);

                    var html = "<tr class='group'><td colspan='9'>";
                    html += sprintf("<h3><i class='fa fa-pencil fa-bookmark-o'></i> <strong>CAPITULO %s: </strong> %s </h3>", composite.chapterOrder, composite.chapterName);
                    if (composite.chapterComments) html += composite.chapterComments;
                    var editButton = "onclick='pwModal4API.editChapter(" + composite.chapterId + ");'";
                    html += "<div>";
                    html += " <button " + editButton + " class='btn btn-circle btn-success btn-md pull-right'><i class='fa fa-pencil fa-fw'></i></button> ";
                    var deleteButton = "onclick='pwModal4API.deleteChapterMessage(" + composite.chapterId + ");'";
                    html += " <button " + deleteButton + " class='btn btn-circle btn-danger btn-md pull-right'><i class='fa fa-trash fa-fw'></i></button> ";
                    var newButton = "onclick='pwModalAPI.newLine(" + composite.chapterId + ");'";
                    html += " <button id='btnNewLine'" + newButton + " data-i18n='[title]pwDetail.newLine' data-toggle='modal' data-target='#pwModal' class='btn btn-circle btn-primary btn-md pull-right'><i class='fa fa-sitemap fa-fw'></i></button> ";
                    html += "</div>";
                    html += "</td></tr>"

                    $(rows).eq(i).before(
                        html
                    );
                    last = group;
                }
            });
            var mdata = api.column(0, {
                page: 'current'
            }).data();
            var stop = true;
        }
        var dtTable = $('#dt_pwLine').DataTable(options);
        dtTable.columns(0).visible(false);
    },
    newPwLine: function () {
        var mf = function (e) {
            // show modal form
            e.preventDefault();
            pwModalAPI.newLine();
        };
        return mf;
    },
    deletePwLineMessage: function (id) {
        var url = sprintf("%s/pw_line/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].cunit.name;
                var fn = sprintf('pwLineAPI.deletePwLine(%s);', id);
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
    deletePwLine: function (id) {
        var url = sprintf("%s/pw_line/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id,
            pw: {
                id: vm.id()
            }
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // pwLineAPI.getPwLines(vm.id());
                pwDetailAPI.getPw(vm.id());
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    getPwLines: function (id) {
        var url = sprintf("%s/pw_line/pw/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                pwLineAPI.loadPwLinesTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadPwLinesTable: function (data) {
        var dt = $('#dt_pwLine').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_pwLine").show();
    },
    // ---------- PW_WORKER
    initPwWorkerTable: function () {
        var options = aswInit.initTableOptions('dt_worker');
        options.data = data;
        options.columns = [{
            data: "worker.name"
        }, {
            data: "id",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-md' onclick='pwLineAPI.deletePwWorkerMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-md' data-toggle='modal' data-target='#pwModal3' onclick='pwModal3API.editLine(" + data + ");' title='Editar registro'> <i class='fa fa-pencil fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        $('#dt_worker').dataTable(options);
    },
    newPwWorker: function () {
        var mf = function (e) {
            // show modal form
            e.preventDefault();
            pwModal2API.newLine();
        };
        return mf;
    },
    deletePwWorkerMessage: function (id) {
        var url = sprintf("%s/pw_worker/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].worker.name;
                var fn = sprintf('pwLineAPI.deletePwWorker(%s);', id);
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
    deletePwWorker: function (id) {
        var url = sprintf("%s/pw_worker/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id,
            pw: {
                id: vm.id()
            }
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                // pwLineAPI.getPwWorkers(vm.id());
                pwDetailAPI.getPw(vm.id());
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    getPwWorkers: function (id) {
        var url = sprintf("%s/pw_worker/pw/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                pwLineAPI.loadPwWorkersTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadPwWorkersTable: function (data) {
        var dt = $('#dt_worker').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_worker").show();
    }

};