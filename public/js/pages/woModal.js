var woModalAPI = {
    init: function () {
        // avoid sending form 
        $('#woModal-form').submit(function () {
            return false;
        });
        // button events
        $('#btnSaveLine').click(woModalAPI.saveLine());
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#woModal-form').validate({
            rules: {
                txtQuantity: {
                    required: true,
                    number: true
                },
                cmbCUnits: { required: true }
            },
            // Messages for form validation
            messages: {
            },
            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#woModal-form').valid();
    },
    newLine: function () {
        // new line id is zero.
        vm.lineId(0);
        // clean other fields
        vm.quantity(null);
        vm.estimate(null);
        vm.done(null);
        // combos
        $('#cmbCUnits').select2(select2_languages[lang]);
        woModalAPI.loadCUnits(null);
        $("#cmbCUnits").select2().on('change', function (e) {
            woModalAPI.changeCUnit(e.added);
        });
    },
    editLine: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/wo_line/%s/?api_key=%s', myconfig.apiUrl, id, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                if (data.length) {
                    vm.lineId(data[0].id);
                    vm.estimate(data[0].estimate);
                    vm.done(data[0].done);
                    vm.quantity(data[0].quantity);
                    //
                    $('#cmbCUnits').select2(select2_languages[lang]);
                    woModalAPI.loadCUnits(data[0].cunit.id);
                    var data = {
                        id: data[0].cunit.id
                    };
                    woModalAPI.changeCUnit(data);
                    $("#cmbCUnits").select2().on('change', function (e) {
                        woModalAPI.changeCUnit(e.added);
                    });
                }
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('login.html', '_self');
                }
            }
        });
    },
    saveLine: function () {
        var mf = function (e) {
            e.preventDefault();
            if (!woModalAPI.dataOk()) return;
            // mount line to save 
            var data = {
                id: vm.lineId(),
                wo: {
                    id: vm.id()
                },
                cunit: {
                    id: vm.sCUnit()
                },
                estimate: vm.estimate(),
                done: vm.done(),
                quantity: vm.quantity()
            };
            var url = "", type = "";
            if (vm.lineId() == 0) {
                // creating new record
                type = "POST";
                url = sprintf('%s/wo_line?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/wo_line/%s/?api_key=%s', myconfig.apiUrl, vm.lineId(), api_key);
            }
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    $('#woModal').modal('hide');
                    woLineAPI.getWoLines(vm.id());
                },
                error: function (err) {
                    aswNotif.errAjax(err);
                    if (err.status == 401) {
                        window.open('login.html', '_self');
                    }
                }
            });
        };
        return mf;
    },
    loadCUnits: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/cunit/pw/%s/?api_key=%s', myconfig.apiUrl, vm.sPw(), api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: null, name: "" }].concat(data);
                vm.optionsCUnits(options);
                $("#cmbCUnits").val([id]).trigger('change');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('login.html', '_self');
                }
            }
        });
    },
    changeCUnit: function (data) {
        if (!data) return;
        $.ajax({
            type: "GET",
            url: sprintf('%s/cunit/estdone/?api_key=%s&cunitId=%s&pwId=%s', myconfig.apiUrl, api_key, data.id, vm.sPw()),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                if (data.length) {
                    vm.estimate(data[0].estimate);
                    vm.done(data[0].done);
                } else {
                    vm.estimate(0);
                    vm.done(0);
                }
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('login.html', '_self');
                }
            }
        })
    }
};