"use strict";
var setupModuleLoader = require("./loader");
var $QProvider  = require('./q')
function publishExternalAPI() {
  setupModuleLoader(window);

  var ngModule = window.angular.module("ng", []);
  ngModule.provider('$filter', require('./filter'));
  ngModule.provider('$parse', require('./parse'));
  ngModule.provider('$rootScope', require('./scope'));
  ngModule.provider("$q", $QProvider);
  ngModule.provider('$$q', $$QProvider);
}

module.exports = publishExternalAPI;
