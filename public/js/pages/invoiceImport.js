/*
 * invoiceImport.js
 * Function for the page invoiceImport.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')
var lang = aswCookies.getCookie('gdespa_lang');


var data = null;
var vm = null;
var refPwId = 0;
var refWoId = 0;
var allowedFileExtensions = ['xls', 'xlsx'];
var invoicesUp = [];

var invoiceImportAPI = {
    init: function () {
        aswInit.initPage();
        validator_languages(lang);
        datepicker_languages(lang);
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#invoiceImport').attr('class', 'active');
        // knockout management
        vm = new invoiceImportAPI.pageData();
        ko.applyBindings(vm);
        // buttons click events
        $('#btnOk').click(invoiceImportAPI.btnOk());
        $('#btnOk2').click(invoiceImportAPI.btnOk2);
        $('#btnExit').click(function (e) {
            e.preventDefault();
        });
        invoiceImportAPI.deleteUploads(user.id);
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
                    var ext = file.name.split('.').pop().toLowerCase();
                    if (allowedFileExtensions.indexOf(ext) == -1) {
                        aswNotif.generalMessage(i18n.t('invoiceImport.onlyExcel'));
                        return;
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
        // default values
        vm.sheetNumber(0);
        vm.firstDataRow(2);
        vm.nColInvoiceNumber('D');
        vm.nColInvoiceDate('C');
        vm.nColReference('J');
        vm.nColAmount('H');
        vm.nColAmount2('G');
        vm.nColComments('F');
        // initTabla
        invoiceImportAPI.initPwTable();

    },
    pageData: function () {
        // knockout objects
        var self = this;
        self.noFirstRow = ko.observable();
        self.firstDataRow = ko.observable();
        self.lastDataRow = ko.observable();
        self.sheetNumber = ko.observable();
        self.nColInvoiceNumber = ko.observable();
        self.nColInvoiceDate = ko.observable();
        self.nColReference = ko.observable();
        self.nColAmount = ko.observable();
        self.nColAmount2 = ko.observable();
        self.nColComments = ko.observable();
        self.file = ko.observable();
    },
    loadData: function (data) {

    },
    // Validates form (jquery validate) 
    dataOk: function () {
        var options = {
            rules: {
                "txtSheetNumber": { required: true },
                "txtfirstDataRow": { required: true },
                "txtlastDataRow": { required: true },
                "txtnColInvoiceNumber": { required: true },
                "txtnColInvoiceDate": { required: true },
                "txtnColReference": { required: true },
                "txtnColAmount": { required: true },
                "txtnColComments": { required: true }
            },
            // Do not change code below
            errorPlacement: function (error, element) {
                error.insertAfter(element.parent());
            }
        };
        $('#invoiceImport-form').validate(options);
        return $('#invoiceImport-form').valid();
    },
    btnOk: function () {
        var mf = function (e) {
            // avoid default accion
            e.preventDefault();
            // validate form
            if (!invoiceImportAPI.dataOk()) return;
            if (!vm.file() || vm.file() == "") {
                aswNotif.generalMessage(i18n.t('invoiceImport.fileNeeded'));
                return;
            }
            // dat for post or put
            var data = {
                filename: vm.file(),
                sheetNumber: vm.sheetNumber(),
                firstDataRow: vm.firstDataRow(),
                lastDataRow: vm.lastDataRow(),
                nColInvoiceNumber: vm.nColInvoiceNumber(),
                nColInvoiceDate: vm.nColInvoiceDate(),
                nColReference: vm.nColReference(),
                nColAmount: vm.nColAmount(),
                nColAmount2: vm.nColAmount2(),
                nColComments: vm.nColComments()
            }
            var url = sprintf('%s/invoice/import/file/?api_key=%s', myconfig.apiUrl, api_key);
            aswUtil.llamadaAjax("POST", url, data, function (err, data) {
                // tratar las posibles facturas
                var mens = data.mens;
                if (mens != "") aswNotif.generalMessage(mens);
                invoicesUp = data.facs;
                invoiceImportAPI.loadFacsTable(invoicesUp);
            })
        }
        return mf;
    },
    btnOk2: function (e) {
        // avoid default accion
        e.preventDefault();
        var data = invoicesUp;
        var url = sprintf('%s/invoice/import/import/?api_key=%s', myconfig.apiUrl, api_key);
        aswUtil.llamadaAjax("POST", url, data, function (err, data) {
            if (err) return;
            aswNotif.generalMessage(i18n.t('invoiceImport.endOk'));
        })        
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
    },
    initPwTable: function () {
        var options = aswInit.initTableOptions('dt_fac');
        options.bPaginate = false;
        options.data = data;
        options.columns = [{
            data: "invoiceId"
        }, {
            data: "invoiceNumber"
        }, {
            data: "invoiceDate"
        }, {
            data: "amount"
        }, {
            data: "comments"
        }, {
            data: "reference"
        }, {
            data: "pwId"
        }, {
            data: "pwName"
        }];
        options.fnRowCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            if (aData.invoiceId != "0") {
                $('td', nRow).css('background-color', '#C2EEF1');
            }
            if (aData.pwId == "0") {
                $('td', nRow).css('background-color', '#DBD4F1');
            }

        };
        $('#dt_fac').dataTable(options);
    },
    loadFacsTable: function (data) {
        var dt = $('#dt_fac').dataTable();
        dt.fnClearTable();
        if (data.length && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    }
};
invoiceImportAPI.init();