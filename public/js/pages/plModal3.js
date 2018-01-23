var plModal3API = {
    init: function () {
        // avoid sending form 
        $('#plModal3-form').submit(function () {
            return false;
        });
        // 
        $('#cmbWorkers3').select2(select2_languages[lang]);
        plModal3API.loadWorkers3();
        // button events
        $('#btnSaveLine3').click(plModal3API.saveLine());
        // lost focus
        $("#txtInitialKm").blur(plModal3API.changeKms);
        $("#txtFinalKm").blur(plModal3API.changeKms);
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#plModal3-form').validate({
            rules: {
                cmbWorkers3: { required: true },
                txtQuantity3: { required: true }
            },
            // Messages for form validation
            messages: {
            },
            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#plModal3-form').valid();
    },
    newLine: function () {
        vm.plWorkerId(0);
        vm.quantity3(null);
        vm.normalHours(0);
        vm.extraHours(0);
        vm.initialKm(0);
        vm.finalKm(0);
        vm.fuel(0);
        vm.totalKm(0);
        plModal3API.loadWorkers3(null);
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
                    vm.quantity3(data[0].quantity);
                    vm.normalHours(data[0].normalHours);
                    vm.extraHours(data[0].extraHours);
                    vm.initialKm(data[0].initialKm);
                    vm.finalKm(data[0].finalKm);
                    vm.fuel(data[0].fuel);
                    plModal3API.loadWorkers3(data[0].worker.id);
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
            if (!plModal3API.dataOk()) return;
            // mount line to save 
            var data = {
                id: vm.plWorkerId(),
                pl: {
                    id: vm.id()
                },
                worker: {
                    id: vm.sWorker3()
                },
                quantity: vm.quantity3(),
                initialKm: vm.initialKm(),
                finalKm: vm.finalKm(),
                totalKm: vm.totalKm(),
                fuel: vm.fuel(),
                planHours: vm.planHours()
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
                    $('#plModal3').modal('hide');
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
    loadWorkers3: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/worker/vehicle?api_key=%s', myconfig.apiUrl, api_key),
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
    },
    changeKms: function () {
        vm.totalKm((vm.finalKm() * 1) - (vm.initialKm() * 1));
    }
};