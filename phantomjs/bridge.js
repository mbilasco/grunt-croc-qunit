/*
 * grunt-croc-qunit
 *
 * Copyright (c) 2013 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

/*global QUnit:true, alert:true*/
(function () {
  'use strict';

  // Don't re-order tests.
  QUnit.config.reorder = false;
  // Run tests serially, not in parallel.
  QUnit.config.autorun = false;

  // Send messages to the parent PhantomJS process via alert! Good times!!
  function sendMessage() {
    var args = [].slice.call(arguments);
    alert(JSON.stringify(args));
  }

  // These methods connect QUnit to PhantomJS.
  QUnit.log(function(obj) {
    // What is this I don't even
    if (obj.message === '[object Object], undefined:undefined') { return; }

    // Send it.
    sendMessage('qunit.log', obj.result, obj.message, obj.source);
  });

  QUnit.testStart(function(obj) {
    sendMessage('qunit.testStart', obj.name);
  });

  QUnit.testDone(function(obj) {
    sendMessage('qunit.testDone', obj.name, obj.failed, obj.passed, obj.total);
  });

  QUnit.moduleStart(function(obj) {
    sendMessage('qunit.moduleStart', obj.name);
  });

  QUnit.moduleDone(function(obj) {
    sendMessage('qunit.moduleDone', obj.name, obj.failed, obj.passed, obj.total);
  });

  QUnit.begin(function() {
    sendMessage('qunit.begin');
  });

  QUnit.done(function(obj) {
    // send coverage data if available
    if (window.__coverage__) {
      sendMessage('qunit.coverage', window.__coverage__);
    }
    sendMessage('qunit.done', obj.failed, obj.passed, obj.total, obj.runtime);
  });
}());