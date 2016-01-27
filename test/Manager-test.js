var test = require('tape');
var sinon = require('sinon');
var ReactDOM = require('react-dom');
var createManager = require('../lib/createManager');

function mockManager(options) {
  var manager = createManager(options);
  var firstItem = {
    node: { focus: sinon.spy() },
    text: 'first',
  };
  var secondItem = {
    node: { focus: sinon.spy() },
    content: 'second',
  };
  manager.menuItems = [firstItem, secondItem];
  manager.button = {
    focus: sinon.spy(),
    setState: sinon.spy(),
  };
  manager.menu = {
    setState: sinon.spy(),
  };
  return manager;
}

function mockKeyEvent(key, keyCode) {
  return {
    key: key,
    keyCode: keyCode,
    preventDefault: sinon.spy(),
  };
}

test('Manager initialization', function(t) {
  var m = mockManager();
  t.equal(m.currentFocus, -1);
  t.notOk(m.isOpen);
  t.ok(m.options.closeOnSelection);
  t.end();
});

test('Manager#update', function(t) {
  var m = mockManager();
  m.update();
  t.ok(m.menu.setState.calledWith({ isOpen: m.isOpen }));
  t.ok(m.button.setState.calledWith({ menuOpen: m.isOpen }));
  t.end();
});

test('Manager#openMenu without focusing in menu', function(t) {
  var m = mockManager();

  m.openMenu();
  t.ok(m.isOpen);
  t.ok(m.menu.setState.calledWith({ isOpen: true }));
  t.ok(m.button.setState.calledWith({ menuOpen: true }));
  t.equal(m.currentFocus, -1);

  t.end();
});

test('Manager#openMenu focusing in menu', function(t) {
  var m = mockManager();
  sinon.spy(m, 'moveFocus');

  t.plan(4);
  m.openMenu({ focusMenu: true });
  t.ok(m.isOpen);
  t.ok(m.menu.setState.calledWith({ isOpen: true }));
  t.ok(m.button.setState.calledWith({ menuOpen: true }));
  setTimeout(function() {
    t.ok(m.moveFocus.calledWith(0));
  }, 0);
});

test('Manager#closeMenu focusing on button', function(t) {
  var m = mockManager();
  var mockNode = { focus: sinon.spy() };
  var findDOMNodeStub = sinon.stub(ReactDOM, 'findDOMNode').returns(mockNode);

  m.closeMenu({ focusButton: true });
  t.notOk(m.isOpen);
  t.ok(m.menu.setState.calledWith({ isOpen: false }));
  t.ok(m.button.setState.calledWith({ menuOpen: false }));
  t.ok(mockNode.focus.calledOnce);

  findDOMNodeStub.restore();

  t.end();
});

test('Manager#closeMenu without focusing on button', function(t) {
  var m = mockManager();
  var mockNode = { focus: sinon.spy() };
  var findDOMNodeStub = sinon.stub(ReactDOM, 'findDOMNode').returns(mockNode);

  m.closeMenu({ focusButton: false });
  t.notOk(mockNode.focus.calledOnce);

  findDOMNodeStub.restore();

  t.end();
});

test('Manager#toggleMenu', function(t) {
  var m = mockManager();
  sinon.stub(m, 'openMenu');
  sinon.stub(m, 'closeMenu');

  m.toggleMenu();
  t.ok(m.openMenu.calledOnce, 'opens when closed');
  t.notOk(m.closeMenu.calledOnce);
  m.openMenu.reset();
  m.closeMenu.reset();

  m.isOpen = true;

  m.toggleMenu();
  t.notOk(m.openMenu.calledOnce);
  t.ok(m.closeMenu.calledOnce, 'closes when open');
  m.openMenu.reset();
  m.closeMenu.reset();

  t.end();
});


test('Manager#moveFocus', function(t) {
  var m = mockManager();

  m.moveFocus(1);
  t.equal(m.currentFocus, 1);
  t.ok(m.menuItems[1].node.focus.calledOnce);

  m.moveFocus(0);
  t.equal(m.currentFocus, 0);
  t.ok(m.menuItems[0].node.focus.calledOnce);

  t.end();
});

test('Manager#moveFocusUp', function(t) {
  var m = mockManager();
  sinon.spy(m, 'moveFocus');

  m.moveFocusUp();
  t.equal(m.moveFocus.getCall(0).args[0], 1);
  m.moveFocusUp();
  t.equal(m.moveFocus.getCall(1).args[0], 0);
  m.moveFocusUp();
  t.equal(m.moveFocus.getCall(2).args[0], 1);
  t.end();
});

test('Manager#moveFocusDown', function(t) {
  var m = mockManager();
  sinon.spy(m, 'moveFocus');

  m.moveFocusDown();
  t.equal(m.moveFocus.getCall(0).args[0], 0);
  m.moveFocusDown();
  t.equal(m.moveFocus.getCall(1).args[0], 1);
  m.moveFocusDown();
  t.equal(m.moveFocus.getCall(2).args[0], 0);
  t.end();
});

test('Manager#moveToLetter', function(t) {
  var m = mockManager();
  sinon.spy(m, 'moveFocus');

  m.moveToLetter('f');
  t.equal(m.moveFocus.getCall(0).args[0], 0);

  m.moveToLetter('a');
  t.ok(m.moveFocus.calledOnce, 'ignores irrelevant letter');

  m.moveToLetter('s');
  t.equal(m.moveFocus.getCall(1).args[0], 1);

  m.moveToLetter('f');
  t.equal(m.moveFocus.getCall(2).args[0], 0);

  t.end();
});

test('Manager#handleSelection', function(t) {
  var mOneHandler = sinon.spy();
  var mOne = mockManager({
    onSelection: mOneHandler,
  });
  sinon.stub(mOne, 'closeMenu');
  mOne.handleSelection('foo', { bar: 1 });
  t.equal(mOne.closeMenu.getCall(0).args.length, 1);
  t.deepEqual(mOne.closeMenu.getCall(0).args[0], { focusButton: true });
  t.deepEqual(mOneHandler.getCall(0).args, ['foo', { bar: 1 }]);

  var mTwoHandler = sinon.spy();
  var mTwo = mockManager({
    closeOnSelection: false,
    onSelection: mTwoHandler,
  });
  sinon.stub(mTwo, 'closeMenu');
  mTwo.handleSelection('foo', { bar: 1 });
  t.notOk(mTwo.closeMenu.called);
  t.deepEqual(mTwoHandler.getCall(0).args, ['foo', { bar: 1 }]);

  t.end();
});

test('Manager#handleMenuKey', function(t) {
  var escapeEvent = mockKeyEvent('Escape');
  var upEvent = mockKeyEvent('ArrowUp');
  var downEvent = mockKeyEvent('ArrowDown');
  var fEvent = mockKeyEvent(null, 70);
  var sEvent = mockKeyEvent(null, 83);
  var ctrlSEvent = mockKeyEvent(null, 83);
  ctrlSEvent.ctrlKey = true;

  var m = mockManager();
  sinon.stub(m, 'closeMenu');
  sinon.stub(m, 'moveFocusUp');
  sinon.stub(m, 'moveFocusDown');
  sinon.stub(m, 'moveToLetter');

  // Closed menu should do nothing
  m.handleMenuKey(upEvent);
  m.handleMenuKey(downEvent);
  m.handleMenuKey(escapeEvent);
  m.handleMenuKey(fEvent);
  m.handleMenuKey(sEvent);
  t.notOk(m.closeMenu.called, 'closeMenu not yet called');
  t.notOk(m.moveFocusUp.called, 'moveFocusUp not yet called');
  t.notOk(m.moveFocusDown.called, 'moveFocusDown not yet called');
  t.notOk(m.moveToLetter.called, 'moveToLetter not yet called');

  // Open menu responds
  m.isOpen = true;

  m.handleMenuKey(escapeEvent);
  t.ok(escapeEvent.preventDefault.calledOnce, 'escapeEvent called once');
  t.equal(m.closeMenu.getCall(0).args.length, 1, 'closeMenu called once');
  t.deepEqual(m.closeMenu.getCall(0).args[0], { focusButton: true });

  m.handleMenuKey(upEvent);
  t.ok(upEvent.preventDefault.calledOnce, 'upEvent called once');
  t.ok(m.moveFocusUp.calledOnce, 'moveFocusUp called once');

  m.handleMenuKey(downEvent);
  t.ok(downEvent.preventDefault.calledOnce, 'downEvent called once');
  t.ok(m.moveFocusDown.calledOnce, 'moveFocusDown called once');

  m.handleMenuKey(fEvent);
  t.ok(fEvent.preventDefault.calledOnce, 'fEvent called once');
  t.deepEqual(m.moveToLetter.getCall(0).args, ['F'], 'moveToLetter called with "F"');

  m.handleMenuKey(sEvent);
  t.ok(sEvent.preventDefault.calledOnce, 'sEvent called once');
  t.deepEqual(m.moveToLetter.getCall(1).args, ['S'], 'moveToLetter called with "S"');

  m.handleMenuKey(ctrlSEvent);
  t.notOk(ctrlSEvent.preventDefault.called, 'ctrlSEvent not called');

  t.end();
});
