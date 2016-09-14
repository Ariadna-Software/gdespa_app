var cUnitModalAPI = {
    init: function () {
        // combos
        $('#cmbUnits').select2(select2_languages[lang]);
        cUnitModalAPI.loadUnits();
        $('#cmbItems').select2(select2_languages[lang]);
        cUnitModalAPI.loadItems();
        $("#cmbItems").select2().on('change', function (e) {
            cUnitModalAPI.changeItem(e.added);
        });
        // avoid sending form 
        $('#cUnitModal-form').submit(function () {
            return false;
        });
        // button events
        $('#btnSaveLine').click(cUnitModalAPI.saveLine());
    },
    newLine: function () {
        // new line id is zero.
        vm.lineId(0);
        // clean other fields
        vm.line(null);
        vm.quantity(null);
        cUnitModalAPI.loadUnits(0);
        cUnitModalAPI.loadItems(0);
    },
    editLine: function(id){
        $.ajax({
            type: "GET",
            url: sprintf('%s/cunit_line/%s/?api_key=%s', myconfig.apiUrl, id, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                if (data.length){
                    vm.lineId(data[0].id);
                    vm.line(data[0].line);
                    cUnitModalAPI.loadItems(data[0].item.id);
                    cUnitModalAPI.loadUnits(data[0].unit.id);
                    vm.quantity(data[0].quantity);
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
            // mount line to save 
            var data = {
                id: vm.lineId(),
                line: vm.line(),
                cUnit: {
                    id: vm.id()
                },
                item: {
                    id: vm.sItem()
                },
                unit: {
                    id: vm.sUnit()
                },
                quantity: vm.quantity()
            };
            var url = "", type = "";
            if (vm.lineId() == 0) {
                // creating new record
                type = "POST";
                url = sprintf('%s/cunit_line?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/cunit_line/%s/?api_key=%s', myconfig.apiUrl, vm.lineId(), api_key);
            }
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    $('#cUnitModal').modal('hide');
                    cUnitLineAPI.getCUnitLines(vm.id());
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
            url: sprintf('%s/item?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: 0, name: " " }].concat(data);
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
    },
    loadUnits: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/unit?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var abbs = [];
                data.forEach(function (v) {
                    abbs.push({
                        id: v.id,
                        name: v.abb
                    });
                });
                var options = [{ id: 0, name: " " }].concat(abbs);
                vm.optionsUnits(options);
                $("#cmbUnits").val([id]).trigger('change');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('login.html', '_self');
                }
            }
        });
    },
    changeItem: function (data) {
        if (!data) return;
        $.ajax({
            type: "GET",
            url: sprintf('%s/item/%s/?api_key=%s', myconfig.apiUrl, data.id, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                if (data.length) {
                    cUnitModalAPI.loadUnits(data[0].unit.id);
                }
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('login.html', '_self');
                }
            }
        })
    }
};