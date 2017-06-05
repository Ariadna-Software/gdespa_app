var moLineAPI = {
    init: function () {
        // init tables
        moLineAPI.initMoLineTable();
        moLineAPI.initMoWorkerTable();
        moLineAPI.initMoVehicleTable();
        // button handlers
        $('#btnNewLine').click(moLineAPI.newMoLine());
        $('#btnNewWorker').click(moLineAPI.newMoWorker());
        $('#btnNewVehicle').click(moLineAPI.newMoVehicle());
        // avoid sending form 
        $('#moDetailLine-form').submit(function () {
            return false;
        });
        $('#moDetailWorker-form').submit(function () {
            return false;
        });
        $('#moDetailVehicle-form').submit(function () {
            return false;
        });
    },
    // WO_LINE
    initMoLineTable: function () {
        var options = aswInit.initTableOptions('dt_moLine');
        options.data = data;
        options.paging = false;
        options.bSort = false;
        options.columns = [{
            data: "composite"
        }, {
            data: "cunit.name"
        }, {
            data: "estimate",
            className: "asw-center"
        }, {
            data: "done",
            className: "asw-center"
        }, {
            data: "id",
            width: "10%",
            render: function (data, type, row) {
                var html = '<label class="input">';
                html += sprintf('<input class="asw-center" id="qty%s" name="qty%s" type="text"/>', data, data);
                html += '</label>';
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
        var dtTable = $('#dt_moLine').DataTable(options);
        dtTable.columns(0).visible(false);
    },
    newMoLine: function () {
        var mf = function (e) {
            // show modal form
            e.preventDefault();
            moModalAPI.newLine();
        };
        return mf;
    },
    deleteMoLineMessage: function (id) {
        var url = sprintf("%s/mo_line/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].cunit.name + " (Cantidad: " + data[0].quantity + ")";
                var fn = sprintf('moLineAPI.deleteMoLine(%s);', id);
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
    deleteMoLine: function (id) {
        var url = sprintf("%s/mo_line/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                moLineAPI.getMoLines(vm.id());
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    getMoLines: function (id) {
        var url = sprintf("%s/mo_line/mo/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                moLineAPI.loadMoLinesTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadMoLinesTable: function (data) {
        var dt = $('#dt_moLine').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_moLine").show();
        data.forEach(function (v) {
            var field = "#qty" + v.id;
            $(field).val(v.quantity);
            $(field).blur(function () {
                var quantity = 0;
                if ($(field).val() != "") {
                    quantity = parseFloat($(field).val());
                }
                var data = {
                    id: v.id,
                    mo: {
                        id: v.mo.id
                    },
                    cunit: {
                        id: v.cunit.id
                    },
                    estimate: v.estimate,
                    done: v.done,
                    quantity: quantity
                };
                if ((data.quantity + data.done) > data.estimate) {
                    var message = i18n.t("moDetail.estimate_exceed");
                    aswNotif.generalMessage(message);
                    $(field).val(0);
                    data.quantity = 0;
                }
                var url = "", type = "";
                // updating record
                var type = "PUT";
                var url = sprintf('%s/mo_line/%s/?api_key=%s', myconfig.apiUrl, v.id, api_key);
                $.ajax({
                    type: type,
                    url: url,
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: function (data, status) {
                    },
                    error: function (err) {
                        aswNotif.errAjax(err);
                        if (err.status == 401) {
                            window.open('index.html', '_self');
                        }
                    }
                });
            })
        });
    },
    // WO_WORKER
    initMoWorkerTable: function () {
        var options = aswInit.initTableOptions('dt_worker');
        options.data = data;
        options.columns = [{
            data: "worker.name"
        }, {
            data: "normalHours"
        }, {
            data: "extraHours"
        }, {
            data: "extraHoursNight"
        }, {
            data: "quantity"
        }, {
            data: "expenses"
        }, {
            data: "id",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='moLineAPI.deleteMoWorkerMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' data-toggle='modal' data-target='#moModal2' onclick='moModal2API.editLine(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        $('#dt_worker').dataTable(options);
    },
    initMoVehicleTable: function () {
        var options = aswInit.initTableOptions('dt_vehicle');
        options.data = data;
        options.columns = [{
            data: "worker.name"
        }, {
            data: "totalKm"
        }, {
            data: "planHours"
        }, {
            data: "quantity"
        }, {
            data: "id",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='moLineAPI.deleteMoVehicleMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' data-toggle='modal' data-target='#moModal3' onclick='moModal3API.editLine(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        $('#dt_vehicle').dataTable(options);
    },
    newMoWorker: function () {
        var mf = function (e) {
            // show modal form
            e.preventDefault();
            moModal2API.newLine();
        };
        return mf;
    },
    deleteMoWorkerMessage: function (id) {
        var url = sprintf("%s/mo_worker/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].worker.name + " (Dias: " + data[0].quantity + ")";
                var fn = sprintf('moLineAPI.deleteMoWorker(%s);', id);
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
    deleteMoWorker: function (id) {
        var url = sprintf("%s/mo_worker/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                moLineAPI.getMoWorkers(vm.id());
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    deleteMoVehicleMessage: function (id) {
        var url = sprintf("%s/mo_worker/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].worker.name + " (Horas: " + data[0].quantity + ")";
                var fn = sprintf('moLineAPI.deleteMoVehicle(%s);', id);
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
    deleteMoVehicle: function (id) {
        var url = sprintf("%s/mo_worker/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                moLineAPI.getMoVehicles(vm.id());
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    getMoWorkers: function (id) {
        var url = sprintf("%s/mo_worker/mo/worker/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                moLineAPI.loadMoWorkersTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadMoWorkersTable: function (data) {
        var dt = $('#dt_worker').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_worker").show();
    },
    getMoVehicles: function (id) {
        var url = sprintf("%s/mo_worker/mo/vehicle/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                moLineAPI.loadMoVehiclesTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadMoVehiclesTable: function (data) {
        var dt = $('#dt_vehicle').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_vehicle").show();
    },
    newMoVehicle: function () {
        var mf = function (e) {
            // show modal form
            e.preventDefault();
            moModal3API.newLine();
        };
        return mf;
    },
    newPwVehicle: function () {
        var mf = function (e) {
            // show modal form
            e.preventDefault();
            pwModal3API.newLine();
        };
        return mf;
    },
    deleteMoVehicleMessage: function (id) {
        var url = sprintf("%s/mo_worker/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].worker.name + " (Horas: " + data[0].quantity + ")";
                var fn = sprintf('moLineAPI.deleteMoVehicle(%s);', id);
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
    deleteMoVehicle: function (id) {
        var url = sprintf("%s/mo_worker/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                moLineAPI.getMoVehicles(vm.id());
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    }

};