var deliveryModalAPI = {
    init: function () {
        // avoid sending form 
        $('#deliveryModal-form').submit(function () {
            return false;
        });
        // button events
        $('#btnSaveLine').click(deliveryModalAPI.saveLine());
        // combos
        $('#cmbItems').select2(select2_languages[lang]);
        deliveryModalAPI.loadItems(null);
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#deliveryModal-form').validate({
            rules: {
                txtQuantity: {
                    required: true,
                    number: true
                }
            },
            // Messages for form validation
            messages: {
            },
            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#deliveryModal-form').valid();
    },
    editLine: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/delivery_line/%s/?api_key=%s', myconfig.apiUrl, id, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                if (data.length) {
                    vm.lineId(data[0].id);
                    vm.estimate(data[0].estimate);
                    vm.done(data[0].done);
                    vm.quantity(data[0].quantity);
                    //
                    $('#cmbItems').select2(select2_languages[lang]);
                    deliveryModalAPI.loadItems(data[0].item.id);
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
            if (!deliveryModalAPI.dataOk()) return;
            // mount line to save 
            var data = {
                id: vm.lineId(),
                delivery: {
                    id: vm.id()
                },
                item: {
                    id: vm.sItem()
                },
                quantity: vm.quantity()
            };
            var url = "", type = "";
            // updating record
            type = "PUT";
            url = sprintf('%s/delivery_line/%s/?api_key=%s', myconfig.apiUrl, vm.lineId(), api_key);

            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    $('#deliveryModal').modal('hide');
                    deliveryLineAPI.getDeliveryLines(vm.id());
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
    loadItems: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/item/?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: null, name: "" }].concat(data);
                vm.optionsItems(options);
                $("#cmbItems").val([id]).trigger('change');
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