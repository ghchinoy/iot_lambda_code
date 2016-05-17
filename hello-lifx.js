'use strict';
var http = require('https');
console.log('Loading function');

exports.handler = (event, context, callback) => {
    
    var eventText = JSON.stringify(event, null, 2);
    //console.log('Received event:', eventText);
    console.log('Event type ' + event.clickType + " from " + event.serialNumber);
    
    // TODO: check for OAuth token existance and non-expiry, use, or get another
    // Enter token obtained from https://cloud.lifx.com/settings
    var authn = '';
    // TODO: obtain lights config from elsewhere
    // Enter light | lights IDs here
    var light = 'd073d5example1';
    var lights = ['d073d5example1', 'd073d5example2'];
    
    // switch on SINGLE, DOUBLE, LONG
    // on|off ; if on, cycle ; if on, increase increment
    switch(event.clickType) {
        case "SINGLE":
            toggle_light(authn, light);
            break;
        case "DOUBLE":
            toggle_lights(authn, lights);
            break;
        case "LONG":
            break;
        default:
            break;
    }
};

function toggle_lights(authn, lights) {
    lights.forEach(function (el, idx, a) {
       toggle_light(authn, el) 
    });
}

function toggle_light(authn, light) {
    var post_data = JSON.stringify({"duration":"2"});
    var options = {
        host: 'api.lifx.com',
        port: 443,
        path: '/v1/lights/id:' + light + '/toggle',
        method: 'POST',
        json: true,
        headers: {
            'Authorization': 'Bearer ' + authn,
            'Content-Length': Buffer.byteLength(post_data),
            'Content-Type': 'application/json'
        }
    };
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
           console.log('Response: ' + chunk);
        });
    });
    
    req.write(post_data);
    req.end();
}
