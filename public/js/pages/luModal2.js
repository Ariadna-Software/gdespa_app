var luModal2API = {
    init: function () {
        // avoid sending form 
        $('#luModal2-form').submit(function () {
            return false;
        });
        // 
        $('#cmbWorkers2').select2(select2_languages[lang]);
        luModal2API.loadWorkers2();
        // button events
        $('#btnSaveLine2').click(luModal2API.saveLine());
        // lost focus
        $("#txtNormalHours").blur(luModal2API.changeHours);
        $("#txtExtraHours").blur(luModal2API.changeHours);
        $("#txtExtraHoursNight").blur(luModal2API.changeHours);
        $("#txtExtraHoursMix").blur(luModal2API.changeHours);
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#luModal2-form').validate({
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
        return $('#luModal2-form').valid();
    },
    newLine: function () {
        vm.moWorkerId(0);
        vm.quantity2(null);
        vm.normalHours(0);
        vm.extraHours(0);
        vm.extraHoursNight(0);
        vm.extraHoursMix(0);
        vm.expenses(0);
        luModal2API.loadWorkers2(null);
    },
    editLine: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/mo_worker/%s/?api_key=%s', myconfig.apiUrl, id, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                if (data.length) {
                    vm.moWorkerId(data[0].id);
                    vm.quantity2(data[0].quantity);
                    vm.normalHours(data[0].normalHours);
                    vm.extraHours(data[0].extraHours);
                    vm.extraHoursNight(data[0].extraHoursNight);
                    vm.extraHoursMix(data[0].extraHoursMix);
                    vm.expenses(data[0].expenses);
                    luModal2API.loadWorkers2(data[0].worker.id);
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
            if (!luModal2API.dataOk()) return;
            // mount line to save 
            var data = {
                id: vm.moWorkerId(),
                mo: {
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
                extraHoursMix: vm.extraHoursMix(),
                expenses: vm.expenses()
            };
            var url = "", type = "";
            if (vm.moWorkerId() == 0) {
                // creating new record
                type = "POST";
                url = sprintf('%s/mo_worker?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/mo_worker/%s/?api_key=%s', myconfig.apiUrl, vm.moWorkerId(), api_key);
            }
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    $('#luModal2').modal('hide');
                    // luLineAPI.getPwLines(vm.id());
                    luDetailAPI.getMo(vm.id());
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
        var url = sprintf('%s/worker/worker/active?api_key=%s', myconfig.apiUrl, api_key);
        if (id) url = sprintf('%s/worker/worker?api_key=%s', myconfig.apiUrl, api_key);
        $.ajax({
            type: "GET",
            url: url,
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
        vm.quantity2((vm.normalHours() * 1) + (vm.extraHours() * 1) + (vm.extraHoursNight() * 1) + (vm.extraHoursMix() * 1));
    }
};