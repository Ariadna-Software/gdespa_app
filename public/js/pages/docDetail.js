/*
 * docDetail.js
 * Function for the page docDetail.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')
var lang = aswCookies.getCookie('gdespa_lang');


var data = null;
var vm = null;
var refPwId = 0;
var refWoId = 0;
var allowedImageExtensions = ['jpg','png','gif'];

var docDetailAPI = {
    init: function () {
        aswInit.initPage();
        validator_languages(lang);
        datepicker_languages(lang);
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#docGeneral').attr('class', 'active');
        // knockout management
        vm = new docDetailAPI.pageData();
        ko.applyBindings(vm);
        if (aswUtil.gup('pwId') != "") refPwId = aswUtil.gup('pwId');
        if (aswUtil.gup('woId') != "") refWoId = aswUtil.gup('woId');
        // buttons click events
        $('#btnOk').click(docDetailAPI.btnOk());
        $('#btnDownload').click(function (e) {
            e.preventDefault();
            docDetailAPI.downloadDoc();
        });
        $('#btnExit').click(function (e) {
            e.preventDefault();
            if (refPwId) {
                window.open('pwDetail.html?id=' + refPwId + "&doc=true", '_self');
            } else if (refWoId){
                window.open('woDetail.html?id=' + refWoId + "&doc=true", '_self');
            } else {
                window.open('docGeneral.html', '_self');
            }
        });
        $('#cmbPws').select2(select2_languages[lang]);
        $('#cmbDts').select2(select2_languages[lang]);
        if (refPwId) {
            docDetailAPI.loadPws(refPwId);
        } else {
            docDetailAPI.loadPws();
        }
        if (refWoId) $("#pwDiv").hide();
        docDetailAPI.loadDts();
        docDetailAPI.deleteUploads(user.id);
        $('#upload-input').on('change', function () {
            var files = $(this).get(0).files;
            // control file extension whether refWoId has a value
             if (files.length > 0) {
                // create a FormData object which will be sent as the data payload in the
                // AJAX request
                var formData = new FormData();
                // loop through all the selected files and add them to the formData object
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    if (refWoId){
                        var ext = file.name.split('.').pop().toLowerCase();
                        if (allowedImageExtensions.indexOf(ext) == -1) {
                            aswNotif.generalMessage(i18n.t('docDetail.onlyImages'));
                            return;
                        } 
                    }
                    // add the files to formData object for the data payload
                    formData.append('uploads[]', file, user.id + "@" + file.name);
                }
                $.ajax({
                    url: '/api/upload',
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        filename = data;
                        vm.file(filename);
                        docDetailAPI.checkVisibility(filename);
                    },
                    xhr: function () {
                        // create an XMLHttpRequest
                        var xhr = new XMLHttpRequest();
                        // listen to the 'progress' event
                        xhr.upload.addEventListener('progress', function (evt) {
                            if (evt.lengthComputable) {
                                // calculate the percentage of upload completed
                                var percentComplete = evt.loaded / evt.total;
                                percentComplete = parseInt(percentComplete * 100);
                                // update the Bootstrap progress bar with the new percentage
                                $('.progress-bar').text(percentComplete + '%');
                                $('.progress-bar').width(percentComplete + '%');
                                // once the upload reaches 100%, set the progress bar text to done
                                if (percentComplete === 100) {
                                    $('.progress-bar').html('Fichero subido');
                                }
                            }
                        }, false);
                        return xhr;
                    }
                });
            }
        });
        // check if an id have been passed
        var id = aswUtil.gup('id');
        if (!id || (id == 0)) {
            // new doc
            vm.docId(0);
            $("#P1Title").show();
            $("#P2Title").show();
            $("#P1Loader").show();
            $("#P2Title").show();
            $('#btnDownload').hide();
        } else {
            docDetailAPI.getDoc(id);
        }
    },
    pageData: function () {
        // knockout objects
        var self = this;
        self.docId = ko.observable();
        self.name = ko.observable();
        self.docDate = ko.observable();
        self.comments = ko.observable();
        self.file = ko.observable();
        // pw combo
        self.optionsPws = ko.observableArray([]);
        self.selectedPws = ko.observableArray([]);
        self.sPw = ko.observable();
        // dt combo
        self.optionsDts = ko.observableArray([]);
        self.selectedDts = ko.observableArray([]);
        self.sDt = ko.observable();
    },
    loadData: function (data) {
        vm.docId(data.docId);
        vm.name(data.name);
        vm.docDate(moment(data.docDate).format(i18n.t("util.date_format")));
        vm.comments(data.comments);
        vm.file(data.file);
        docDetailAPI.loadDoc(data.file, data.docId);
        docDetailAPI.loadPws(data.pwId);
        docDetailAPI.loadDts(data.docTypeId);
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        var options = {
            rules: {
                txtDocDate: { required: true },
                cmbPws: { required: true },
                cmbDts: { required: true }
            },
            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        };
        if (refWoId) options.rules.cmbPws.required = false;
        $('#docDetail-form').validate(options);
        return $('#docDetail-form').valid();
    },
    // obtain a doc from the API
    getDoc: function (id) {
        var url = sprintf("%s/doc/%s?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                docDetailAPI.loadData(data[0]);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    btnOk: function () {
        var mf = function (e) {
            // avoid default accion
            e.preventDefault();
            // validate form
            if (!docDetailAPI.dataOk()) return;
            // dat for post or put
            var data = {
                docId: vm.docId(),
                name: vm.name(),
                comments: vm.comments(),
                file: vm.file(),
                pwId: vm.sPw(),
                docTypeId: vm.sDt()
            };
            if (refWoId) data.woId = refWoId;
            if (moment(vm.docDate(), i18n.t("util.date_format")).isValid()) {
                data.docDate = moment(vm.docDate(), i18n.t("util.date_format")).format(i18n.t("util.date_iso"));
            }
            var url = "", type = "";
            if (vm.docId() == 0) {
                // creating new record
                type = "POST";
                url = sprintf('%s/doc?api_key=%s', myconfig.apiUrl, api_key);
            } else {
                // updating record
                type = "PUT";
                url = sprintf('%s/doc/%s/?api_key=%s', myconfig.apiUrl, vm.docId(), api_key);
            }
            $.ajax({
                type: type,
                url: url,
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data, status) {
                    if (refPwId) {
                        window.open('pwDetail.html?id=' + refPwId + "&doc=true", '_self');
                    } else if (refWoId) {
                        window.open('woDetail.html?id=' + refWoId + "&doc=true", '_self');
                    } else {
                        window.open('docGeneral.html', '_self');
                    }
                },
                error: function (err) {
                    aswNotif.errAjax(err);
                    if (err.status == 401) {
                        window.open('index.html', '_self');
                    }
                }
            });
        }
        return mf;
    },
    checkVisibility: function (filename) {
        var ext = filename.split('.').pop().toLowerCase();
        if (ext == "pdf" || ext == "jpg" || ext == "png" || ext == "gif") {
            // see it in container
            var url = "/uploads/" + filename;
            if (ext == "pdf") {
                // <iframe src="" width="100%" height="600px"></iframe>
                $("#docContainer").html('<iframe src="' + url + '"frameborder="0" width="100%" height="600px"></iframe>');
            } else {
                // .html("<img src=' + this.href + '>");
                $("#docContainer").html('<img src="' + url + '" width="100%">');;
            }
            $("#msgContainer").html('');
        } else {
            $("#msgContainer").html(i18n.t('docDetail.noVisible'));
            $("#docContainer").html('');
        }
    },
    loadDoc: function (filename, id) {
        var ext = filename.split('.').pop().toLowerCase();
        if (ext == "pdf" || ext == "jpg" || ext == "png" || ext == "gif") {
            // see it in container
            var url = "/docs/" + id + "." + ext;
            if (ext == "pdf") {
                // <iframe src="" width="100%" height="600px"></iframe>
                $("#docContainer").html('<iframe src="' + url + '"frameborder="0" width="100%" height="600px"></iframe>');
            } else {
                // .html("<img src=' + this.href + '>");
                $("#docContainer").html('<img src="' + url + '" width="100%">');;
            }
            $("#msgContainer").html('');
        } else {
            $("#msgContainer").html(i18n.t('docDetail.noVisible'));
            $("#docContainer").html('');
        }
    },
    downloadDoc: function () {
        var ext = vm.file().split('.').pop().toLowerCase();
        var url = "/docs/" + vm.docId() + "." + ext;
        window.open(url, '_new');
    },
    loadPws: function (id) {
        var myId = id;
        $.ajax({
            type: "GET",
            url: sprintf('%s/pw?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: null, name: "" }];
                var data2 = [];
                if (!user.seeNotOwner) {
                    data.forEach(function (d) {
                        if (user.workOnlyZone && (d.zone.id == user.zoneId || d.zoneId2 == user.zoneId)) {
                            data2.push(d);
                        }
                    });
                } else {
                    data2 = data;
                }
                options = options.concat(data2);
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
    },
    loadDts: function (id) {
        var myId = id;
        $.ajax({
            type: "GET",
            url: sprintf('%s/doc_type?api_key=%s', myconfig.apiUrl, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                var options = [{ id: null, name: "" }];
                options = options.concat(data);
                vm.optionsDts(options);
                $("#cmbDts").val([id]).trigger('change');
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    deleteUploads: function (id) {
        $.ajax({
            type: "DELETE",
            url: sprintf('%s/doc/uploads/%s?api_key=%s', myconfig.apiUrl, id, api_key),
            dataType: "json",
            contentType: "application/json",
            success: function (data, status) {
                // files deleted nothig to do
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
docDetailAPI.init();