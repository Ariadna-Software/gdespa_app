var teamModalAPI = {
    init: function () {
        // avoid sending form 
        $('#teamModal-form').submit(function () {
            return false;
        });
        // button events
        $('#btnSaveLine').click(teamModalAPI.saveLine());
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#teamModal-form').validate({
            rules: {
                cmbWorkers: { required: true }
            },
            // Messages for form validation
            messages: {
            },
            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#teamModal-form').valid();
    },
    newLine: function () {
        // new line id is zero.
        vm.lineId(0);
        // clean other fields
        // combos
        $('#cmbWorkers').select2(select2_languages[lang]);
        teamModalAPI.loadWorkers(null);
        $('#cmbWorkers').prop('disabled', false);
    },
    editLine: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/team_line/%s/?api_key=%s', myconfig.apiUrl, id, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                if (data.length) {
                    vm.lineId(data[0].teamLineId);
                    //
                    $('#cmbWorkers').select2(select2_languages[lang]);
                    teamModalAPI.loadWorkers(data[0].workerId);
                    // $('#cmbWorkers').prop('disabled', 'disabled');
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
            if (!teamModalAPI.dataOk()) return;
            // mount line to save 
            var data = {
                teamLineId: vm.lineId(),
                teamId: vm.id(),
                workerId: vm.sWorker()
            };
            var url = "", type = "";
            if (vm.lineId() == 0) {
                // creating new record
                type = "POST";
                url = sprintf('%s/team_line?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/team_line/%s/?api_key=%s', myconfig.apiUrl, vm.lineId(), api_key);
            }
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    $('#teamModal').modal('hide');
                    teamLineAPI.getTeamLines(vm.id());
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
    loadWorkers: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/worker/?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: null, name: "" }].concat(data);
                vm.optionsWorkers(options);
                $("#cmbWorkers").val([id]).trigger('change');
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