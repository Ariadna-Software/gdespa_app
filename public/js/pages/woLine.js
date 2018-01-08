var woLineAPI = {
    init: function () {
        // init tables
        woLineAPI.initWoLineTable();
        woLineAPI.initWoWorkerTable();
        woLineAPI.initWoVehicleTable();
        woLineAPI.initDocTable();
        // button handlers
        $('#btnNewLine').click(woLineAPI.newWoLine());
        $('#btnNewWorker').click(woLineAPI.newWoWorker());
        $('#btnNewVehicle').click(woLineAPI.newWoVehicle());
        $('#btnNewDoc').click(woLineAPI.newDoc());
        if (woLineAPI.seeNotChange()) {
            $('#btnNewLine').hide();
            $('#btnNewWorker').hide();
            $('#btnNewVehicle').hide();
            $('#btnNewDoc').hide();
        }
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
        // woDoc-form
        $('#woDoc-form').submit(function () {
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
            if (woLineAPI.seeNotChange()) $(field).attr('disabled', 'disabled');
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
            data: "extraHoursNight"
        }, {
            data: "extraHoursMix"
        }, {
            data: "quantity"
        }, {
            data: "expenses"
        }, {
            data: "id",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='woLineAPI.deleteWoWorkerMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' data-toggle='modal' data-target='#woModal2' onclick='woModal2API.editLine(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                if (woLineAPI.seeNotChange()) return "";
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
            data: "planHours"
        }, {
            data: "quantity"
        }, {
            data: "id",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='woLineAPI.deleteWoVehicleMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' data-toggle='modal' data-target='#woModal3' onclick='woModal3API.editLine(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                if (woLineAPI.seeNotChange()) return "";
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
    newPwVehicle: function () {
        var mf = function (e) {
            // show modal form
            e.preventDefault();
            pwModal3API.newLine();
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
    },
    seeNotChange: function () {
        if (user.seeWoClosed && !user.modWoClosed && clos)
            return true;
        else
            return false;
    },
    // ----------- PW_DOCS
    initDocTable: function () {
        var options = aswInit.initTableOptions('dt_doc');
        options.sDom = "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-12 hidden-xs' C  >r>" +
            "t" +
            "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-xs-12 col-sm-6'p>>";
        options.oColVis = {
            "buttonText": "Mostrar / ocultar columnas"
        };
        options.data = data;
        options.columns = [{
            data: "docDate",
            render: function (data, type, row) {
                var html = moment(data).format('DD/MM/YYYY');
                return html;
            }
        }, {
            data: "typeName"
        }, {
            data: "comments"
        }, {
            data: "file",
            render: function (data, type, row) {
                var ext = data.split('.').pop().toLowerCase();
                var html = "DOCUMENTO NO VISUALIZABLE";
                if (ext == "pdf" || ext == "jpg" || ext == "png" || ext == "gif") {
                    // see it in container
                    var url = "/docs/" + row.docId + "." + ext;
                    if (ext == "pdf") {
                        html = '<iframe src="' + url + '"frameborder="0" width="100%" height="600px"></iframe>'
                    } else {
                        html = '<img src="' + url + '" width="100%">';
                    }
                }
                return html;
            }
        }, {
            data: "docId",
            render: function (data, type, row) {
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='woLineAPI.deleteDocMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='woLineAPI.editDoc(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                if (woLineAPI.seeNotChange()) return "";
                return html;
            }
        }];
        var tabla = $('#dt_doc').DataTable(options);
        tabla.columns(3).visible(false);
    },
    newDoc: function () {
        // Its an event handler, return function
        var mf = function () {
            var url = sprintf("%s/wo//total-quantity/%s/?&api_key=%s", myconfig.apiUrl, vm.id(), api_key);
            $.ajax({
                type: "GET",
                url: url,
                contentType: "application/json",
                success: function (data, status) {
                    if (data[0].t == 0){
                        var message = i18n.t("woDetail.noDocAllowed");
                        aswNotif.generalMessage(message);
                    }else{
                        window.open(sprintf('docDetail.html?id=%s&woId=%s', 0, vm.id()), '_self');                    
                    }
                    
                },
                error: function (err) {
                    aswNotif.errAjax(err);
                    if (err.status == 401) {
                        window.open('index.html', '_self');
                    }
                }
            });
        }
        return mf;
    },
    editDoc: function (id) {
        window.open(sprintf('docDetail.html?id=%s', id), '_blank');
    },
    deleteDocMessage: function (id) {
        var url = sprintf("%s/doc/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].name;
                var fn = sprintf("woLineAPI.deleteDoc(%s);", id);
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
    deleteDoc: function (id) {
        var url = sprintf("%s/doc/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var file = data[0].file;
                var url = sprintf("%s/doc/%s/?api_key=%s&file=%s", myconfig.apiUrl, id, api_key, file);
                var data = {
                    id: id
                };
                $.ajax({
                    type: "DELETE",
                    url: url,
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: function (data, status) {
                        woLineAPI.getDocs();
                    },
                    error: function (err) {
                        aswNotif.errAjax(err);
                        if (err.status == 401) {
                            window.open('index.html', '_self');
                        }
                    }
                });
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
    getDocs: function (id) {
        var url = sprintf("%s/doc/byWoId/images/%s/?&api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                woLineAPI.loadDocsTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadDocsTable: function (data) {
        var dt = $('#dt_doc').dataTable();
        dt.fnClearTable();
        if (data && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    }

};