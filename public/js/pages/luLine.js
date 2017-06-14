var luLineAPI = {
    init: function () {
        // init tables
        luLineAPI.initMoLineTable();
        luLineAPI.initMoWorkerTable();
        luLineAPI.initMoVehicleTable();
        // button handlers
        $('#btnNewLine').click(luLineAPI.newMoLine());
        $('#btnNewWorker').click(luLineAPI.newMoWorker());
        $('#btnNewVehicle').click(luLineAPI.newMoVehicle());
        // avoid sending form 
        $('#luDetailLine-form').submit(function () {
            return false;
        });
        $('#luDetailWorker-form').submit(function () {
            return false;
        });
        $('#luDetailVehicle-form').submit(function () {
            return false;
        });
    },
    // WO_LINE
    initMoLineTable: function () {
        var options = aswInit.initTableOptions('dt_luline');
        options.data = data;
        options.columns = [{
            data: "meaName"
        }, {
            data: "quantity"
        }, {
            data: "cost"
        }, {
            data: "moLineId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='luLineAPI.deleteMoLineMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' data-toggle='modal' data-target='#luModal' onclick='luModalAPI.editLine(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        $('#dt_luline').dataTable(options);
    },
    newMoLine: function () {
        var mf = function (e) {
            // show modal form
            e.preventDefault();
            luModalAPI.newLine();
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
                var name = data[0].meaName + " (Cantidad: " + data[0].quantity + ")";
                var fn = sprintf('luLineAPI.deleteMoLine(%s);', id);
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
                luLineAPI.getMoLines(vm.id());
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
                luLineAPI.loadMoLinesTable(data);
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
        var dt = $('#dt_luline').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_luline").show();

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
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='luLineAPI.deleteMoWorkerMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' data-toggle='modal' data-target='#luModal2' onclick='luModal2API.editLine(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
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
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='luLineAPI.deleteMoVehicleMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' data-toggle='modal' data-target='#luModal3' onclick='luModal3API.editLine(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
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
            luModal2API.newLine();
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
                var fn = sprintf('luLineAPI.deleteMoWorker(%s);', id);
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
                luLineAPI.getMoWorkers(vm.id());
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
                var fn = sprintf('luLineAPI.deleteMoVehicle(%s);', id);
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
                luLineAPI.getMoVehicles(vm.id());
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
                luLineAPI.loadMoWorkersTable(data);
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
                luLineAPI.loadMoVehiclesTable(data);
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
            luModal3API.newLine();
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
                var fn = sprintf('luLineAPI.deleteMoVehicle(%s);', id);
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
                luLineAPI.getMoVehicles(vm.id());
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