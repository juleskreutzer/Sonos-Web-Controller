'use strict';

var http = require('http');
var SonosDiscovery = require('sonos-discovery');
var SonosHttpAPI = require('./lib/sonos-http-api.js');
var nodeStatic = require('node-static');
var fs = require('fs');
var path = require('path');
var webroot = path.resolve(__dirname, 'static');

var settings = {
  port: 5005,
  cacheDir: './cache',
  webroot: webroot
};

// Create webroot + tts if not exist
if (!fs.existsSync(webroot)) {
  fs.mkdirSync(webroot);
}
if (!fs.existsSync(webroot + '/tts/')) {
  fs.mkdirSync(webroot + '/tts/');
}

// load user settings
try {
  var userSettings = require(path.resolve(__dirname, 'settings.json'));
} catch (e) {
  console.log('no settings file found, will only use default settings');
}

if (userSettings) {
  for (var i in userSettings) {
    settings[i] = userSettings[i];
  }
}

var fileServer = new nodeStatic.Server(webroot);
var discovery = new SonosDiscovery(settings);
var api = new SonosHttpAPI(discovery, settings);

var server = http.createServer(function (req, res) {
  req.addListener('end', function () {
    fileServer.serve(req, res, function (err) {
      // If error, route it.
      if (!err) {
        return;
      }

      if (req.method === 'GET') {
        api.requestHandler(req, res);
      }
    });
  }).resume();
});
var bridgeDiscovery = require("./hue-api/bridge-discovery")
    , Hue = require("./hue-api")
    , lightState = require("./hue-api/lightstate")
    , scheduledEvent = require("./hue-api/scheduledEvent.js")
    , ApiError = require("./hue-api/errors.js").ApiError
    ;


function deprecated(fn, message) {
    return function () {
        var args = Array.prototype.slice.call(arguments);
        console.error(message);
        return fn.apply(this, args);
    };
}


module.exports = {
    HueApi: Hue,
    BridgeApi: Hue,
    api: Hue,

    //TODO document this
    connect: function(config) {
        return new Hue(config);
    },

    lightState: lightState,
    scheduledEvent: scheduledEvent,

    upnpSearch: bridgeDiscovery.networkSearch,
    nupnpSearch: bridgeDiscovery.locateBridges,

    locateBridges: deprecated(bridgeDiscovery.locateBridges
        , "'locateBridges' is deprecated, please use 'nupnpSearch' instead"),

    searchForBridges: deprecated(
        bridgeDiscovery.networkSearch
        , "'searchForBridges' is deprecated, please use 'upnpSearch' instead"
    ),

    ApiError: ApiError
};

server.listen(settings.port, function () {
  console.log('http server listening on port', settings.port);
});
