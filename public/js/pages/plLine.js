var plLineAPI = {
    init: function () {
        // init tables
        plLineAPI.initPlLineTable();
        // button handlers
        $('#btnNewLine').click(plLineAPI.newPlLine());
        if (plLineAPI.seeNotChange()) {
            $('#btnNewLine').hide();
        }
        // avoid sending form 
        $('#plDetailLine-form').submit(function () {
            return false;
        });
    },
    // WO_LINE
    initPlLineTable: function () {
        var options = aswInit.initTableOptions('dt_plLine');
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
            data: "prevPlanned",
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
        var dtTable = $('#dt_plLine').DataTable(options);
        dtTable.columns(0).visible(false);
    },
    newPlLine: function () {
        var mf = function (e) {
            // show modal form
            e.preventDefault();
            plModalAPI.newLine();
        };
        return mf;
    },
    deletePlLineMessage: function (id) {
        var url = sprintf("%s/pl_line/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].cunit.name + " (Cantidad: " + data[0].quantity + ")";
                var fn = sprintf('plLineAPI.deletePlLine(%s);', id);
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
    deletePlLine: function (id) {
        var url = sprintf("%s/pl_line/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                plLineAPI.getPlLines(vm.id());
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    getPlLines: function (id) {
        var url = sprintf("%s/pl_line/pl/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                plLineAPI.loadPlLinesTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadPlLinesTable: function (data) {
        var dt = $('#dt_plLine').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
        $("#tb_plLine").show();
        data.forEach(function (v) {
            var field = "#qty" + v.id;
            $(field).val(v.quantity);
            if (plLineAPI.seeNotChange()) $(field).attr('disabled', 'disabled');
            $(field).blur(function () {
                var quantity = 0;
                if ($(field).val() != "") {
                    quantity = parseFloat($(field).val());
                }
                var data = {
                    id: v.id,
                    pl: {
                        id: v.pl.id
                    },
                    cunit: {
                        id: v.cunit.id
                    },
                    estimate: v.estimate,
                    done: v.done,
                    quantity: quantity
                };
                if ((data.quantity + data.done) > data.estimate) {
                    var message = i18n.t("plDetail.estimate_exceed");
                    aswNotif.generalMessage(message);
                    $(field).val(0);
                    data.quantity = 0;
                }
                var url = "", type = "";
                // updating record
                var type = "PUT";
                var url = sprintf('%s/pl_line/%s/?api_key=%s', myconfig.apiUrl, v.id, api_key);
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
    seeNotChange: function () {
        if (user.seePlClosed && !user.modPlClosed && clos)
            return true;
        else
            return false;
    }
};