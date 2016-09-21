var pwModal3API = {
    init: function () {
        // avoid sending form 
        $('#pwModal3-form').submit(function () {
            return false;
        });
        // 
        $('#cmbWorkers3').select2(select2_languages[lang]);
        pwModal3API.loadWorkers3();
        // button events
        $('#btnSaveLine3').click(pwModal3API.saveLine());
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#pwModal3-form').validate({
            rules: {
                cmbWorkers3: { required: true }
            },
            // Messages for form validation
            messages: {
            },
            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#pwModal3-form').valid();
    },
    newLine: function () {
        vm.pwWorkerId(0);
        pwModal3API.loadWorkers3(null);
    },
    editLine: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/pw_worker/%s/?api_key=%s', myconfig.apiUrl, id, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                if (data.length) {
                    vm.pwWorkerId(data[0].id);
                    pwModal3API.loadWorkers3(data[0].worker.id);
                }
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    saveLine: function () {
        var mf = function (e) {
            e.preventDefault();
            if (!pwModal3API.dataOk()) return;
            // mount line to save 
            var data = {
                id: vm.pwWorkerId(),
                pw: {
                    id: vm.id()
                },
                worker: {
                    id: vm.sWorker3()
                }
            };
            var url = "", type = "";
            if (vm.pwWorkerId() == 0) {
                // creating new record
                type = "POST";
                url = sprintf('%s/pw_worker?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/pw_worker/%s/?api_key=%s', myconfig.apiUrl, vm.pwWorkerId(), api_key);
            }
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    $('#pwModal3').modal('hide');
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
        };
        return mf;
    },
    loadWorkers3: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/worker?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: null, name: "" }].concat(data);
                vm.optionsWorkers3(options);
                $("#cmbWorkers3").val([id]).trigger('change');
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