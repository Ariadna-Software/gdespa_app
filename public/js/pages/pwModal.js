var pwModalAPI = {
    init: function () {
        // combos
        $("#cmbCUnits").select2().on('change', function (e) {
            pwModalAPI.changeCUnits(e.added);
        });
        // avoid sending form 
        $('#pwModal-form').submit(function () {
            return false;
        });
        // button events
        $('#btnSaveLine').click(pwModalAPI.saveLine());
        // lostfocus events
        $("#txtCost").blur(pwModalAPI.updateTotal());
        $("#txtK").blur(pwModalAPI.updateTotal());
        $("#txtQuantity").blur(pwModalAPI.updateTotal());
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#pwModal-form').validate({
            rules: {
                txtQuantity: { required: true, number: true },
                txtCost: { required: true, number: true },
                txtK: { required: true, number: true },
                txtAmount: { required: true, number: true },
                cmbCUnits: { required: true }
            },
            // Messages for form validation
            messages: {
            },
            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#pwModal-form').valid();
    },
    newLine: function () {
        // new line id is zero.
        vm.pwLineId(0);
        // clean other fields
        vm.line(null);
        vm.quantity(null);
        vm.cost(null);
        vm.k(vm.defaultK());
        vm.amount(null);
        pwModalAPI.loadCUnits(null);
    },
    editLine: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/pw_line/%s/?api_key=%s', myconfig.apiUrl, id, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                if (data.length) {
                    vm.pwLineId(data[0].id);
                    vm.line(data[0].line);
                    pwModalAPI.loadCUnits(data[0].cunit.id);
                    vm.quantity(data[0].quantity);
                    vm.cost(data[0].cost);
                    vm.k(data[0].k);
                    vm.amount(data[0].amount);
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
            if (!pwModalAPI.dataOk()) return;
            // mount line to save 
            var data = {
                id: vm.pwLineId(),
                line: vm.line(),
                pw: {
                    id: vm.id()
                },
                cunit: {
                    id: vm.sCUnit()
                },
                quantity: vm.quantity(),
                k: vm.k(),
                cost: vm.cost(),
                amount: vm.amount()
            };
            var url = "", type = "";
            if (vm.pwLineId() == 0) {
                // creating new record
                type = "POST";
                url = sprintf('%s/pw_line?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/pw_line/%s/?api_key=%s', myconfig.apiUrl, vm.pwLineId(), api_key);
            }
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    $('#pwModal').modal('hide');
                    // pwLineAPI.getPwLines(vm.id());
                    pwDetailAPI.getPw(vm.id());
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
    loadCUnits: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/cunit?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: null, name: "" }].concat(data);
                vm.optionsCUnits(options);
                $("#cmbCUnits").val([id]).trigger('change');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('login.html', '_self');
                }
            }
        });
    },
    changeCUnits: function (data) {
        if (!data) return;
        $.ajax({
            type: "GET",
            url: sprintf('%s/cunit/%s/?api_key=%s', myconfig.apiUrl, data.id, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                if (data.length) {
                    // TODO: cost
                    vm.cost(data[0].cost);
                    vm.quantity(1);
                    pwModalAPI.updateTotal()();
                }
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('login.html', '_self');
                }
            }
        })
    },
    updateTotal: function () {
        var mf = function () {
            var t = vm.cost() * vm.quantity() * vm.k();
            vm.amount(aswUtil.round2(t));
        };
        return mf;
    }
};