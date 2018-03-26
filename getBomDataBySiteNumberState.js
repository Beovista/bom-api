var request = require('request');
var wrapCallback = require('request-callback-wrapper');
var safeParse = require('safe-json-parse/callback');

var IDCodes = {
    tas: 'IDT60801',
    vic: 'IDV60801',
    nsw: 'IDN60801',
    qld: 'IDQ60801',
    sa: 'IDS60801',
    wa: 'IDW60801',
    nt: 'IDD60801',
    act: 'IDN60903'
};

function getBomDataBySiteNumberState(siteNumber, stateName, callback) {
    var url = 'http://www.bom.gov.au/fwo/' + IDCodes[stateName] + '/' + IDCodes[stateName] + '.' + siteNumber + '.json';

    request({ url: url, json: true }, wrapCallback(function(error, data) {
        if (error || !data || !data.observations || !data.observations.data) {
            return callback('Incorrect state and siteNumber combination: ' + error);
        }

        var observationData = data.observations.data;
        var bomInfoArray = [];

        for (var i = 0; i < observationData.length; i++) {
            var observation = observationData[i];

            var bomInfo = {
                air_temp: observation.air_temp,
                apparent_t: observation.apparent_t,
                rel_hum: observation.rel_hum,
                local_date_time_full: observation.local_date_time_full,
                utc_date_time_full: observation.aifstime_utc,
                dew_point: observation.dewpt
            };

            bomInfoArray.push(bomInfo);
        }

        callback(null, bomInfoArray);
    }));
}
module.exports = getBomDataBySiteNumberState;