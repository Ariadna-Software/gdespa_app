var woLineAPI = {
    init: function () {
        // init tables
        woLineAPI.initWoLineTable();
        woLineAPI.initWoWorkerTable();
        woLineAPI.initWoVehicleTable();
        // button handlers
        $('#btnNewLine').click(woLineAPI.newWoLine());
        $('#btnNewWorker').click(woLineAPI.newWoWorker());
        // avoid sending form 
        $('#woDetailLine-form').submit(function () {
            return false;
        });
        $('#woDetailWorker-form').submit(function () {
            return false;
        });
        $('#woDetailVehicle-form').submit(function () {
            return false;
        });        
    },
    // WO_LINE
    initWoLineTable: function () {
        var options = aswInit.initTableOptions('dt_woLine');
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
        var dtTable = $('#dt_woLine').DataTable(options);
        dtTable.columns(0).visible(false);
    },
    newWoLine: function () {
        var mf = function (e) {
            // show modal form
            e.preventDefault();
            woModalAPI.newLine();
        };
        return mf;
    },
    deleteWoLineMessage: function (id) {
        var url = sprintf("%s/wo_line/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].cunit.name + " (Cantidad: " + data[0].quantity + ")";
                var fn = sprintf('woLineAPI.deleteWoLine(%s);', id);
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
    deleteWoLine: function (id) {
        var url = sprintf("%s/wo_line/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                woLineAPI.getWoLines(vm.id());
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    getWoLines: function (id) {
        var url = sprintf("%s/wo_line/wo/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                woLineAPI.loadWoLinesTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadWoLinesTable: function (data) {
        var dt = $('#dt_woLine').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_woLine").show();
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
                    wo: {
                        id: v.wo.id
                    },
                    cunit: {
                        id: v.cunit.id
                    },
                    estimate: v.estimate,
                    done: v.done,
                    quantity: quantity
                };
                if ((data.quantity + data.done) > data.estimate) {
                    var message = i18n.t("woDetail.estimate_exceed");
                    aswNotif.generalMessage(message);
                    $(field).val(0);
                    data.quantity = 0;
                }
                var url = "", type = "";
                // updating record
                var type = "PUT";
                var url = sprintf('%s/wo_line/%s/?api_key=%s', myconfig.apiUrl, v.id, api_key);
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
    initWoWorkerTable: function () {
        var options = aswInit.initTableOptions('dt_worker');
        options.data = data;
        options.columns = [{
            data: "worker.name"
        }, {
            data: "normalHours"
        }, {
            data: "extraHours"
        }, {
            data: "quantity"
        }, {
            data: "id",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='woLineAPI.deleteWoWorkerMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' data-toggle='modal' data-target='#woModal2' onclick='woModal2API.editLine(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        $('#dt_worker').dataTable(options);
    },
    initWoVehicleTable: function () {
        var options = aswInit.initTableOptions('dt_vehicle');
        options.data = data;
        options.columns = [{
            data: "worker.name"
        }, {
            data: "totalKm"
        }, {
            data: "quantity"
        }, {
            data: "id",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='woLineAPI.deleteWoWorkerMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' data-toggle='modal' data-target='#woModal3' onclick='woModal3API.editLine(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        $('#dt_vehicle').dataTable(options);
    },
    newWoWorker: function () {
        var mf = function (e) {
            // show modal form
            e.preventDefault();
            woModal2API.newLine();
        };
        return mf;
    },
    deleteWoWorkerMessage: function (id) {
        var url = sprintf("%s/wo_worker/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].worker.name + " (Dias: " + data[0].quantity + ")";
                var fn = sprintf('woLineAPI.deleteWoWorker(%s);', id);
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
    deleteWoWorker: function (id) {
        var url = sprintf("%s/wo_worker/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                woLineAPI.getWoWorkers(vm.id());
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    getWoWorkers: function (id) {
        var url = sprintf("%s/wo_worker/wo/worker/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                woLineAPI.loadWoWorkersTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadWoWorkersTable: function (data) {
        var dt = $('#dt_worker').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_worker").show();
    },
    getWoVehicles: function (id) {
        var url = sprintf("%s/wo_worker/wo/vehicle/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                woLineAPI.loadWoVehiclesTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadWoVehiclesTable: function (data) {
        var dt = $('#dt_vehicle').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_vehicle").show();
    },
    newWoVehicle: function () {
        var mf = function (e) {
            // show modal form
            e.preventDefault();
            woModal3API.newLine();
        };
        return mf;
    },
    deleteWoVehicleMessage: function (id) {
        var url = sprintf("%s/wo_worker/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].worker.name + " (Horas: " + data[0].quantity + ")";
                var fn = sprintf('woLineAPI.deleteWoVehicle(%s);', id);
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
    deleteWoVehicle: function (id) {
        var url = sprintf("%s/wo_worker/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                woLineAPI.getWoVehicles(vm.id());
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