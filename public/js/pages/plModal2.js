var plModal2API = {
    init: function () {
        // avoid sending form 
        $('#plModal2-form').submit(function () {
            return false;
        });
        // 
        $('#cmbWorkers2').select2(select2_languages[lang]);
        plModal2API.loadWorkers2();
        // button events
        $('#btnSaveLine2').click(plModal2API.saveLine());
        // lost focus
        $("#txtNormalHours").blur(plModal2API.changeHours);
        $("#txtExtraHours").blur(plModal2API.changeHours);
        $("#txtExtraHoursNight").blur(plModal2API.changeHours);
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#plModal2-form').validate({
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
        return $('#plModal2-form').valid();
    },
    newLine: function () {
        vm.plWorkerId(0);
        vm.quantity2(null);
        vm.normalHours(0);
        vm.extraHours(0);
        vm.extraHoursNight(0);
        vm.expenses(0);
        plModal2API.loadWorkers2(null);
    },
    editLine: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/pl_worker/%s/?api_key=%s', myconfig.apiUrl, id, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                if (data.length) {
                    vm.plWorkerId(data[0].id);
                    vm.quantity2(data[0].quantity);
                    vm.normalHours(data[0].normalHours);
                    vm.extraHours(data[0].extraHours);
                    vm.extraHoursNight(data[0].extraHoursNight);
                    vm.expenses(data[0].expenses);
                    plModal2API.loadWorkers2(data[0].worker.id);
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
            if (!plModal2API.dataOk()) return;
            // mount line to save 
            var data = {
                id: vm.plWorkerId(),
                pl: {
                    id: vm.id()
                },
                worker: {
                    id: vm.sWorker2()
                },
                quantity: vm.quantity2(),
                normalHours: vm.normalHours(),
                extraHours: vm.extraHours(),
                planHours: vm.planHours(),
                extraHoursNight: vm.extraHoursNight(),
                expenses: vm.expenses()
            };
            var url = "", type = "";
            if (vm.plWorkerId() == 0) {
                // creating new record
                type = "POST";
                url = sprintf('%s/pl_worker?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/pl_worker/%s/?api_key=%s', myconfig.apiUrl, vm.plWorkerId(), api_key);
            }
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    $('#plModal2').modal('hide');
                    // plLineAPI.getPwLines(vm.id());
                    plDetailAPI.getWo(vm.id());
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
            url: sprintf('%s/worker/worker?api_key=%s', myconfig.apiUrl, api_key),
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
    },
    changeHours: function () {
        vm.quantity2((vm.normalHours() * 1) + (vm.extraHours() * 1) + (vm.extraHoursNight() * 1));
    }
};