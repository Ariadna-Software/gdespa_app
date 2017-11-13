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
        $('#btnSaveLineNew').click(pwModalAPI.saveLineNew());
        // lostfocus events
        $("#txtCost").blur(pwModalAPI.updateTotal());
        $("#txtK").blur(pwModalAPI.updateTotal());
        $("#txtQuantity").blur(pwModalAPI.updateTotal);
        $("#txtPlannedQuantity").blur(pwModalAPI.changePlannedQuantity);
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
    newLine: function (chapterId) {
        // new line id is zero.
        vm.pwLineId(0);
        vm.chapterId(chapterId);
        vm.currentChapterId(chapterId);
        // clean other fields
        vm.line(null);
        vm.quantity(null);
        vm.plannedQuantity(null);
        vm.cost(null);
        vm.k(vm.defaultK());
        vm.amount(null);
        vm.comments(null);
        pwModalAPI.loadCUnits(null);
        pwModal4API.loadChapters(vm.currentChapterId(), vm.id());
        // obtain next line number
        pwModalAPI.newLineNumber(vm.id(), vm.currentChapterId());
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
                    vm.plannedQuantity(data[0].plannedQuantity);
                    vm.quantity(data[0].quantity);
                    vm.cost(data[0].cost);
                    vm.k(data[0].k);
                    vm.amount(data[0].amount);
                    vm.comments(data[0].comments);
                    vm.currentChapterId(data[0].chapterId);
                    pwModal4API.loadChapters(vm.currentChapterId(), vm.id());
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
    infLine: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/pw_line/%s/?api_key=%s', myconfig.apiUrl, id, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                if (data.length) {
                    window.open('cUnitDetail.html?id=' + data[0].cunit.id + '&ucinfo=1', '_blank');
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
                plannedQuantity: vm.plannedQuantity(),
                k: vm.k(),
                cost: vm.cost(),
                amount: vm.amount(),
                comments: vm.comments(),
                chapterId: vm.currentChapterId()
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
                        window.open('index.html', '_self');
                    }
                }
            });
        };
        return mf;
    },
    saveLineNew: function () {
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
                plannedQuantity: vm.plannedQuantity(),
                k: vm.k(),
                cost: vm.cost(),
                amount: vm.amount(),
                comments: vm.comments(),
                chapterId: vm.currentChapterId()
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
                    pwDetailAPI.getPw(vm.id());
                    pwModalAPI.newLine(vm.chapterId());
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
    loadCUnits: function (id) {
        var url = sprintf('%s/cunit?api_key=%s', myconfig.apiUrl, api_key);
        if (user.perCunitBlock) {
            url += "&perCunitBlock=true";
        }
        $.ajax({
            type: "GET",
            url: url,
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
                    window.open('index.html', '_self');
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
                    vm.plannedQuantity(1);
                    vm.quantity(1);
                    pwModalAPI.updateTotal();
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
    updateTotal: function () {
        var t = vm.cost() * vm.quantity() * vm.k();
        vm.amount(aswUtil.round2(t));
    },
    newLineNumber: function (id, chapterId) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/pw_line/newline/%s/%s?api_key=%s', myconfig.apiUrl, id, chapterId, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                if (data) {
                    vm.line(data.contador);
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
    changePlannedQuantity: function () {
        if (vm.pwLineId() == 0) {
            vm.quantity(vm.plannedQuantity());
            updateTotal();
        }
    }

};