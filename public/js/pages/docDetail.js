/*
 * docDetail.js
 * Function for the page docDetail.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')
var lang = aswCookies.getCookie('gdespa_lang');


var data = null;
var vm = null;

var docDetailAPI = {
    init: function () {
        aswInit.initPage();
        validator_languages(lang);
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#docGeneral').attr('class', 'active');
        // knockout management
        vm = new docDetailAPI.pageData();
        ko.applyBindings(vm);
        // buttons click events
        $('#btnOk').click(docDetailAPI.btnOk());
        $('#btnExit').click(function (e) {
            e.preventDefault();
            window.open('docGeneral.html', '_self');
        })
        $('#upload-input').on('change', function () {
            var files = $(this).get(0).files;
            if (files.length > 0) {
                // create a FormData object which will be sent as the data payload in the
                // AJAX request
                var formData = new FormData();
                // loop through all the selected files and add them to the formData object
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    // add the files to formData object for the data payload
                    formData.append('uploads[]', file, file.name);
                }
                $.ajax({
                    url: '/api/upload',
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        filename = data;
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
    },
    loadData: function (data) {
        vm.docId(data.docId);
        vm.name(data.name);
        vm.docDate(moment(data.docDate).format(i18n.t("util.date_format")));
        vm.comments(data.comments);
        vm.file(data.file);
    },
    // Validates form (jquery validate) 
    dataOk: function () {
        $('#docDetail-form').validate({
            rules: {
                txtName: { required: true }
            },
            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        });
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
                file: vm.file()
            };
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
                    window.open('docGeneral.html', '_self');
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
    }
};
docDetailAPI.init();