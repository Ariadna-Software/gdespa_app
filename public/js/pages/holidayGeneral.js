/*
 * holidayGeneral.js
 * Function for the page holidayGeneral.html
*/
var user = JSON.parse(aswCookies.getCookie('gdespa_user'));
var api_key = aswCookies.getCookie('api_key')

var data = null;

var holidayGeneralAPI = {
    init: function () {
        $('#user_name').text(user.name);
        aswInit.initPerm(user);
        // make active menu option
        $('#holidayGeneral').attr('class', 'active');
        holidayGeneralAPI.initHolidayTable();
        holidayGeneralAPI.getHolidays();
        // avoid sending form 
        $('#holidayGeneral-form').submit(function () {
            return false;
        });
        // buttons click events 
        $('#btnNew').click(holidayGeneralAPI.newHoliday());

    },
    // initializes the table
    initHolidayTable: function () {
        var options = aswInit.initTableOptions('dt_holiday');
        options.data = data;
        options.columns = [{
            data: "holidayDateF",
            render: function (data, type, row) {
                html = "";
                html = moment(data).format("DD/MM/YYYY");
                return html;
            }            
        },{
            data: "name"
        },{
            data: "dayTypeName"
        }, {
                data: "id",
                render: function (data, type, row) {
                    var bt1 = "<button class='btn btn-circle btn-danger btn-lg' onclick='holidayGeneralAPI.deleteHolidayMessage(" + data + ");' title='Eliminar registro'> <i class='fa fa-trash-o fa-fw'></i> </button>";
                    var bt2 = "<button class='btn btn-circle btn-success btn-lg' onclick='holidayGeneralAPI.editHoliday(" + data + ");' title='Editar registro'> <i class='fa fa-edit fa-fw'></i> </button>";
                    var html = "<div class='pull-right'>" + bt1 + " " + bt2 + "</div>";
                    return html;
                }
            }];
        $('#dt_holiday').dataTable(options);
    },
    newHoliday: function () {
        // Its an event handler, return function
        var mf = function () {
            window.open(sprintf('holidayDetail.html?id=%s', 0), '_self');
        }
        return mf;
    },
    editHoliday: function (id) {
        window.open(sprintf('holidayDetail.html?id=%s', id), '_self');
    },
    deleteHolidayMessage: function (id) {
        var url = sprintf("%s/holiday/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                var name = data[0].name;
                var fn = sprintf('holidayGeneralAPI.deleteHoliday(%s);', id);
                aswNotif.deleteRecordQuestion(name, fn);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    deleteHoliday: function (id) {
        var url = sprintf("%s/holiday/%s/?api_key=%s", myconfig.apiUrl, id, api_key);
        var data = {
            id: id
        };
        $.ajax({
            type: "DELETE",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function (data, status) {
                holidayGeneralAPI.getHolidays();
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    // obtain user groups from the API
    getHolidays: function () {
        var url = sprintf("%s/holiday?api_key=%s", myconfig.apiUrl, api_key);
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            success: function (data, status) {
                holidayGeneralAPI.loadHolidaysTable(data);
            },
            error: function (err) {
                aswNotif.errAjax(err);
                if (err.status == 401) {
                    window.open('index.html', '_self');
                }
            }
        });
    },
    loadHolidaysTable: function (data) {
        var dt = $('#dt_holiday').dataTable();
        dt.fnClearTable();
        if (data && data.length > 0) dt.fnAddData(data);
        dt.fnDraw();
    }
};

holidayGeneralAPI.init();