var itemOutModalAPI = {
    init: function () {
        // avoid sending form 
        $('#itemOutModal-form').submit(function () {
            return false;
        });
        // button events
        $('#btnSaveLine').click(itemOutModalAPI.saveLine());
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#itemOutModal-form').validate({
            rules: {
                txtQuantity: {
                    required: true,
                    number: true
                },
                cmbItems: { required: true }
            },
            // Messages for form validation
            messages: {
            },
            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#itemOutModal-form').valid();
    },
    newLine: function () {
        // new line id is zero.
        vm.lineId(0);
        // clean other fields
        vm.quantity(null);
        // combos
        $('#cmbItems').select2(select2_languages[lang]);
        itemOutModalAPI.loadItems(null);
    },
    editLine: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/item_out_line/%s/?api_key=%s', myconfig.apiUrl, id, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                if (data.length) {
                    vm.lineId(data[0].id);
                    vm.quantity(data[0].quantity);
                    //
                    $('#cmbItems').select2(select2_languages[lang]);
                    itemOutModalAPI.loadItems(data[0].item.id);
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
            if (!itemOutModalAPI.dataOk()) return;
            // mount line to save 
            var data = {
                id: vm.lineId(),
                itemOut: {
                    id: vm.id()
                },
                item: {
                    id: vm.sItem()
                },
                quantity: vm.quantity()
            };
            var url = "", type = "";
            if (vm.lineId() == 0) {
                // creating new record
                type = "POST";
                url = sprintf('%s/item_out_line?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/item_out_line/%s/?api_key=%s', myconfig.apiUrl, vm.lineId(), api_key);
            }
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    $('#itemOutModal').modal('hide');
                    itemOutLineAPI.getItemOutLines(vm.id());
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
                    window.open('login.html', '_self');
                }
            }
        });
    }
};