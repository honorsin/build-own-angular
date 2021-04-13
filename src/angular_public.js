"use strict";
var setupModuleLoader = require('./loader');
function publishExternalAPI() {

  setupModuleLoader(window);

  var ngModule =angular.module('ng', []);
  ngModule.provider('$filter', $FilterProvider);
  ngModule.provider('$parse', $ParseProvider);
  ngModule.provider('$rootScope', $RootScopeProvider);
}

module.exports = publishExternalAPI;
