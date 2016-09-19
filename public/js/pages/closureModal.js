var closureModalAPI = {
    init: function () {
        // avoid sending form 
        $('#closureModal-form').submit(function () {
            return false;
        });
        // button events
        $('#btnSaveLine').click(closureModalAPI.saveLine());
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#closureModal-form').validate({
            rules: {
                txtDone: {
                    required: true,
                    number: true
                },
                cmbPws: { required: true }
            },
            // Messages for form validation
            messages: {
            },
            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#closureModal-form').valid();
    },
    newLine: function () {
        // new line id is zero.
        vm.lineId(0);
        // clean other fields
        vm.estimate(null);
        vm.done(null);
        // combos
        $('#cmbPws').select2(select2_languages[lang]);
        closureModalAPI.loadPws(null);
        $("#cmbPws").select2().on('change', function (e) {
            closureModalAPI.changePw(e.added);
        });
    },
    editLine: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/closure_line/%s/?api_key=%s', myconfig.apiUrl, id, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                if (data.length) {
                    vm.lineId(data[0].id);
                    vm.estimate(data[0].estimate);
                    vm.done(data[0].done);
                    vm.quantity(data[0].quantity);
                    //
                    $('#cmbPws').select2(select2_languages[lang]);
                    closureModalAPI.loadPws(null);
                    $("#cmbPws").select2().on('change', function (e) {
                        closureModalAPI.changePw(e.added);
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
            if (!closureModalAPI.dataOk()) return;
            // mount line to save 
            var data = {
                id: vm.lineId(),
                pw: {
                    id: vm.sPw()
                },
                estimate: vm.estimate(),
                done: vm.done()
            };
            var url = "", type = "";
            if (vm.lineId() == 0) {
                // creating new record
                type = "POST";
                url = sprintf('%s/closure_line?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/closure_line/%s/?api_key=%s', myconfig.apiUrl, vm.lineId(), api_key);
            }
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    $('#closureModal').modal('hide');
                    closureLineAPI.getWoLines(vm.id());
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
    loadPws: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/pw/pw/%s/?api_key=%s', myconfig.apiUrl, vm.sPw(), api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: null, name: "" }].concat(data);
                vm.optionsPws(options);
                $("#cmbPws").val([id]).trigger('change');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('login.html', '_self');
                }
            }
        });
    },
    changePw: function (data) {
        if (!data) return;
        $.ajax({
            type: "GET",
            url: sprintf('%s/pw/estdone/?api_key=%s&pwId=%s&pwId=%s', myconfig.apiUrl, api_key, data.id, vm.sPw()),
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