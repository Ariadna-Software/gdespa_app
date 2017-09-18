var pwLineAPI = {
    init: function () {
        // init tables
        pwLineAPI.initPwLineTable();
        pwLineAPI.initPwWorkerTable();
        pwLineAPI.initDocTable();
        pwLineAPI.initInvoiceTable();
        pwLineAPI.initImgTable();
        // button handlers
        $('#btnNewLine').click(pwLineAPI.newPwLine());
        $('#btnNewWorker').click(pwLineAPI.newPwWorker());
        $('#btnNewDoc').click(pwLineAPI.newDoc());
        // avoid sending form 
        $('#pwDetailLine-form').submit(function () {
            return false;
        });
        $('#pwDetailWorker-form').submit(function () {
            return false;
        });
        $('#pwDoc-form').submit(function () {
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
        options.columns = [ {
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
                var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='pwLineAPI.deleteDocMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='pwLineAPI.editDoc(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                return html;
            }
        }];
        var tabla = $('#dt_doc').DataTable(options);
        tabla.columns(3).visible(false);
    },
    newDoc: function () {
        // Its an event handler, return function
        var mf = function () {
            window.open(sprintf('docDetail.html?id=%s&pwId=%s', 0, vm.id()), '_self');
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
                var fn = sprintf("pwLineAPI.deleteDoc(%s);", id);
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
                        pwLineAPI.getDocs();
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
        var url = sprintf("%s/doc/byPwId/docs/%s/?&api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                pwLineAPI.loadDocsTable(data);
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
    },
    // ----------- PW_INOVICES
    initInvoiceTable: function () {
        var options = aswInit.initTableOptions('dt_invoice');
        options.data = data;
        options.columns = [{
            data: "invoiceNumber"
        },{
            data: "invoiceDate",
            render: function (data, type, row) {
                var html = moment(data).format('DD/MM/YYYY');
                return html;
            }
        },{
            data: "amount"
        },{
            data: "comments"
        }];
        $('#dt_invoice').dataTable(options);
    },
    getInvoices: function (pwId) {
        var url = sprintf("%s/invoice/byPwId/%s?api_key=%s", myconfig.apiUrl, pwId, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                pwLineAPI.loadInvoicesTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadInvoicesTable: function (data) {
        var dt = $('#dt_invoice').dataTable();
        dt.fnClearTable();
        if (data && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    },  
    // -- PW IMAGES
    initImgTable: function () {
        var options = aswInit.initTableOptions('dt_img');
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
        }];
        var tabla = $('#dt_img').DataTable(options);
        tabla.columns(3).visible(false);
    },
    getImgs: function (id) {
        var url = sprintf("%s/doc/byPwId/images/%s/?&api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                pwLineAPI.loadImgsTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadImgsTable: function (data) {
        var dt = $('#dt_img').dataTable();
        dt.fnClearTable();
        if (data && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    }
};