var woModal2API = {
    init: function () {
        // avoid sending form 
        $('#woModal2-form').submit(function () {
            return false;
        });
        // 
        $('#cmbWorkers2').select2(select2_languages[lang]);
        woModal2API.loadWorkers2();
        // button events
        $('#btnSaveLine2').click(woModal2API.saveLine());
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#woModal2-form').validate({
            rules: {
                cmbWorkers2: { required: true },
                txtQuantity2: { required: true }
            },
            // Messages for form validation
            messages: {
            },
            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#woModal2-form').valid();
    },
    newLine: function () {
        vm.woWorkerId(0);
        vm.quantity2(0);
        woModal2API.loadWorkers2(null);
    },
    editLine: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/wo_worker/%s/?api_key=%s', myconfig.apiUrl, id, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                if (data.length) {
                    vm.woWorkerId(data[0].id);
                    vm.quantity2(data[0].quantity);
                    woModal2API.loadWorkers2(data[0].worker.id);
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
            if (!woModal2API.dataOk()) return;
            // mount line to save 
            var data = {
                id: vm.woWorkerId(),
                wo: {
                    id: vm.id()
                },
                worker: {
                    id: vm.sWorker2()
                },
                quantity: vm.quantity2()
            };
            var url = "", type = "";
            if (vm.woWorkerId() == 0) {
                // creating new record
                type = "POST";
                url = sprintf('%s/wo_worker?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/wo_worker/%s/?api_key=%s', myconfig.apiUrl, vm.woWorkerId(), api_key);
            }
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    $('#woModal2').modal('hide');
                    // woLineAPI.getPwLines(vm.id());
                    woDetailAPI.getWo(vm.id());
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
    loadWorkers2: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/worker?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: null, name: "" }].concat(data);
                vm.optionsWorkers2(options);
                $("#cmbWorkers2").val([id]).trigger('change');
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