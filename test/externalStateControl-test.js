var test = require('tape');
var externalStateControl = require('../lib/externalStateControl');
var createManager = require('../lib/createManager');
var sinon = require('sinon');

test('externalStateControl#focusItem', function(t) {
  function mockManager(options) {
    var manager = createManager(options);
    manager.focusItem = sinon.stub();
    manager.isOpen = true;

    return manager;
  }

  var manager = mockManager();
  externalStateControl.registerManager('test menu id', manager);
  externalStateControl.focusItem('test menu id', 5);
  setTimeout(function() {
    t.ok(manager.focusItem.calledOnce);
    t.ok(manager.focusItem.calledWith(5));
    t.end();
  }, 0);
});
