var moModalAPI = {
    init: function () {
        // avoid sending form 
        $('#moModal-form').submit(function () {
            return false;
        });
        // button events
        $('#btnSaveLine').click(moModalAPI.saveLine());
        // lost focus
        $("#txtPrice").blur(moModalAPI.changePriceQuantity);
        $("#txtQuantity").blur(moModalAPI.changePriceQuantity);
        $("#txtMoK").blur(moModalAPI.changePriceQuantity);
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#moModal-form').validate({
            rules: {
                txtQuantity: {
                    required: true,
                    number: true
                },
                cmbMeas: { required: true }
            },
            // Messages for form validation
            messages: {
            },
            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#moModal-form').valid();
    },
    newLine: function () {
        // new line id is zero.
        vm.lineId(0);
        // clean other fields
        vm.quantity(null);
        vm.price(null);
        vm.cost(null);
        vm.moLineK(vm.moK());
        // combos
        $('#cmbMeas').select2(select2_languages[lang]);
        moModalAPI.loadMeas(null);
        $("#cmbMeas").select2().on('change', function (e) {
            moModalAPI.changeMea(e.added);
        });
    },
    editLine: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/mo_line/%s/?api_key=%s', myconfig.apiUrl, id, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                if (data.length) {
                    vm.lineId(data[0].moLineId);
                    vm.price(data[0].price);
                    vm.cost(data[0].cost);
                    vm.quantity(data[0].quantity);
                    vm.moLineK(data[0].moK);
                    //
                    $('#cmbMeas').select2(select2_languages[lang]);
                    moModalAPI.loadMeas(data[0].meaId);
                    var data = {
                        id: data[0].meaId
                    };
                    moModalAPI.changeMea(data);
                    $("#cmbMeas").select2().on('change', function (e) {
                        moModalAPI.changeMea(e.added);
                    });
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
            if (!moModalAPI.dataOk()) return;
            // mount line to save 
            var data = {
                moLineId: vm.lineId(),
                moId: vm.id(),
                meaId: vm.sMea(),
                price: vm.price(),
                cost: vm.cost(),
                quantity: vm.quantity(),
                moK: vm.moLineK()
            };
            var url = "", type = "";
            if (vm.lineId() == 0) {
                // creating new record
                type = "POST";
                url = sprintf('%s/mo_line?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/mo_line/%s/?api_key=%s', myconfig.apiUrl, vm.lineId(), api_key);
            }
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    $('#moModal').modal('hide');
                    moLineAPI.getMoLines(vm.id());
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
    loadMeas: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/mea/contadores/?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: null, name: "" }].concat(data);
                vm.optionsMeas(options);
                $("#cmbMeas").val([id]).trigger('change');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    changeMea: function (data) {
        if (!data) return;
        $.ajax({
            type: "GET",
            url: sprintf('%s/mea/%s/?api_key=%s', myconfig.apiUrl, data.id, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                if (data.length) {
                    vm.price(data[0].cost);
                } else {
                    vm.price(0);
                }
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        })
    },
    changePriceQuantity: function () {
        vm.cost((vm.quantity() * 1) * (vm.price() * 1) * (vm.moLineK() * 1));
    }
};