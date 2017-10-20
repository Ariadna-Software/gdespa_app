var pwModal4API = {
    init: function () {
        // avoid sending form 
        $('#pwModal4-form').submit(function () {
            return false;
        });
        $('#cmbChapters').select2(select2_languages[lang]);
        pwModal4API.loadChapters();
        $("#cmbChapters").select2().on('change', function (e) {
            pwModal4API.changeChapter(e.added);
        });        
        // button events
        $('#btnSaveChapter').click(pwModal4API.saveChapter);
        $('#btnNewChapter').click(pwModal4API.newChapter);
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#pwModal4-form').validate({
            rules: {
                txtChapterOrder: {
                    required: true,
                    number: true
                },
                txtChapterName: {
                    required: true
                }
            },
            // Messages for form validation
            messages: {},
            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
        return $('#pwModal4-form').valid();
    },
    newChapter: function () {
        // new line id is zero.
        vm.chapterId(0);
        vm.currentChapterId(0);
        // clean other fields
        vm.chapterOrder(null);
        vm.chapterName(null);
        vm.chapterComments(null);
        // obtain next line number
        pwModal4API.newOrderNumber(vm.id());
        // 
        pwModal4API.loadChapters(vm.currentChapterId(), vm.id())
    },
    editChapter: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/chapter/%s/?api_key=%s', myconfig.apiUrl, id, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                if (data.length) {
                    vm.chapterId(data[0].chapterId);
                    vm.chapterOrder(data[0].order);
                    vm.chapterName(data[0].name);
                    vm.chapterComments(data[0].comments);
                    vm.currentChapterId(data[0].chapterId);
                }
                $('#pwModal4').modal('show');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    saveChapter: function () {
        // Docs needed for open PW?
        pwDetailAPI.checkDocsNeedToOpen(vm.id(), function(err, data) {
            if (err) return aswNotif.errAjaxShort(err);
            var myInitDate = moment(vm.initDate(), 'DD/MM/YYYY').toDate();
            var myInitControl = moment(parameters.initControlDocs).toDate();
            if (data[0].ndocs < 3 && !user.perNoDocsInOpen && myInitDate >= myInitControl) return aswNotif.generalMessage(i18n.t('pwDetail.docsNeedToOpen'));
            if (!pwModal4API.dataOk()) return;
            // mount line to save 
            var data = {
                chapterId: vm.chapterId(),
                order: vm.chapterOrder(),
                name: vm.chapterName(),
                comments: vm.chapterComments(),
                pwId: vm.id()
            };
            var url = "",
                type = "";
            if (vm.chapterId() == 0) {
                // creating new record
                type = "POST";
                url = sprintf('%s/chapter?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/chapter/%s/?api_key=%s', myconfig.apiUrl, vm.chapterId(), api_key);
            }
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    $('#pwModal4').modal('hide');
                    // pwpwModal4API.getPwChapters(vm.id());
                    // pwDetailAPI.getPw(vm.id());
                    if (type == "POST") {
                        vm.currentChapterId(data.chapterId);
                        vm.chapterId(data.chapterId);
                        pwModalAPI.newLine(data.chapterId);
                        $('#pwModal').modal('show');
                    }
                },
                error: function (err) {
                    aswNotif.errAjax(err);
                    if (err.status == 401) {
                        window.open('index.html', '_self');
                    }
                }
            });
        })
    },
    newOrderNumber: function (id) {
        $.ajax({
            type: "GET",
            url: sprintf('%s/chapter/newline/%s/?api_key=%s', myconfig.apiUrl, id, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                if (data) {
                    vm.chapterOrder(data.contador);
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
    loadChapters: function (chapterId, pwId) {
        if (!pwId) {
            console.log('loadChapters: Bad parameteres');
            return;
        }
        if (!chapterId) chapterId = vm.currentChapterId();
        $.ajax({
            type: "GET",
            url: sprintf('%s/chapter/chaptersByPwId/%s?api_key=%s', myconfig.apiUrl, pwId, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{
                    chapterId: null,
                    name: ""
                }].concat(data);
                vm.optionsChapters(options);
                $("#cmbChapters").val([chapterId]).trigger('change');
                if (chapterId == 0){
                    $("#cmbChapters").prop("disabled", false);
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
    deleteChapterMessage: function (id) {
        var url = sprintf("%s/chapter/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].name;
                var fn = sprintf('pwModal4API.deleteChapter(%s);', id);
                aswNotif.deleteChapterQuestion(name, fn);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    deleteChapter: function (id) {
        var url = sprintf("%s/chapter/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id,
            pw: {
                id: vm.id()
            }
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
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
    },
    changeChapter: function (data) {
        if (!data) return;
        if (data.id){
            vm.currentChapterId(data.id);
        }
    }

};