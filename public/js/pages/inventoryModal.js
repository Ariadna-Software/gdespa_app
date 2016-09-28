var inventoryModalAPI = {
    init: function () {
        // avoid sending form 
        $('#inventoryModal-form').submit(function () {
            return false;
        });
        // button events
        $('#btnSaveLine').click(inventoryModalAPI.saveLine());
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#inventoryModal-form').validate({
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
        return $('#inventoryModal-form').valid();
    },
    newLine: function () {
        // new line id is zero.
        vm.lineId(0);
        // clean other fields
        vm.estimate(null);
        vm.done(null);
        // combos
        $('#cmbPws').select2(select2_languages[lang]);
        inventoryModalAPI.loadPws(null);
    },
    editLine: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/inventory_line/%s/?api_key=%s', myconfig.apiUrl, id, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                if (data.length) {
                    vm.lineId(data[0].id);
                    vm.estimate(parseInt(data[0].estimate * 100.0));
                    vm.done(parseInt(data[0].done * 100.0));
                    //
                    $('#cmbPws').select2(select2_languages[lang]);
                    inventoryModalAPI.loadPws(data[0].pw.id);
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
            if (!inventoryModalAPI.dataOk()) return;
            // mount line to save 
            var data = {
                id: vm.lineId(),
                pw: {
                    id: vm.sPw()
                },
                estimate: vm.estimate() / 100,
                done: vm.done() / 100
            };
            var url = "", type = "";
            if (vm.lineId() == 0) {
                // creating new record
                type = "POST";
                url = sprintf('%s/inventory_line?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/inventory_line/%s/?api_key=%s', myconfig.apiUrl, vm.lineId(), api_key);
            }
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    $('#inventoryModal').modal('hide');
                    inventoryLineAPI.getInventoryLines(vm.id());
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
    loadPws: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/pw/?api_key=%s', myconfig.apiUrl, api_key),
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
                    window.open('index.html', '_self');
                }
            }
        });
    }
};