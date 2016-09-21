var itemInModalAPI = {
    init: function () {
        // avoid sending form 
        $('#itemInModal-form').submit(function () {
            return false;
        });
        // button events
        $('#btnSaveLine').click(itemInModalAPI.saveLine());
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#itemInModal-form').validate({
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
        return $('#itemInModal-form').valid();
    },
    newLine: function () {
        // new line id is zero.
        vm.lineId(0);
        // clean other fields
        vm.quantity(null);
        // combos
        $('#cmbItems').select2(select2_languages[lang]);
        itemInModalAPI.loadItems(null);
    },
    editLine: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/item_in_line/%s/?api_key=%s', myconfig.apiUrl, id, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                if (data.length) {
                    vm.lineId(data[0].id);
                    vm.quantity(data[0].quantity);
                    //
                    $('#cmbItems').select2(select2_languages[lang]);
                    itemInModalAPI.loadItems(data[0].item.id);
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
            if (!itemInModalAPI.dataOk()) return;
            // mount line to save 
            var data = {
                id: vm.lineId(),
                itemIn: {
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
                url = sprintf('%s/item_in_line?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/item_in_line/%s/?api_key=%s', myconfig.apiUrl, vm.lineId(), api_key);
            }
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    $('#itemInModal').modal('hide');
                    itemInLineAPI.getItemInLines(vm.id());
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