var test = require('tape');
var sinon = require('sinon');
var ReactDOM = require('react-dom');
var createManager = require('../lib/createManager');

var nodeOne = document.createElement('button');
sinon.spy(nodeOne, 'focus');
var nodeTwo = document.createElement('button');
sinon.spy(nodeTwo, 'focus');
document.body.appendChild(nodeOne);
document.body.appendChild(nodeTwo);

function mockManager(options) {
  var manager = createManager(options);
  manager.focusGroup.addMember({
    node: nodeOne,
    text: 'first',
  });
  manager.focusGroup.addMember({
    node: nodeTwo,
    text: 'second',
  });
  manager.button = {
    focus: sinon.spy(),
    setState: sinon.spy(),
  };
  manager.menu = {
    setState: sinon.spy(),
  };
  manager.focusItemSpy = sinon.spy(manager, 'focusItem');
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

  t.end();
});

test('Manager#openMenu focusing in menu', function(t) {
  var m = mockManager();
  t.plan(4);
  m.openMenu({ focusMenu: true });
  t.ok(m.isOpen, 'opens');
  t.ok(m.menu.setState.calledWith({ isOpen: true }), 'sets open state on menu');
  t.ok(m.button.setState.calledWith({ menuOpen: true }), 'sets open state on button');
  setTimeout(function() {
    t.ok(m.focusItemSpy.calledWith(0), 'focuses first item');
  }, 0);
});

test('Manager#closeMenu focusing on button', function(t) {
  var m = mockManager();
  var mockNode = { focus: sinon.spy() };
  var findDOMNodeStub = sinon.stub(ReactDOM, 'findDOMNode').returns(mockNode);

  m.isOpen = true;
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

  m.isOpen = true;
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

  var m = mockManager();
  sinon.stub(m, 'closeMenu');

  // Closed menu should do nothing
  m.handleMenuKey(escapeEvent);

  // Open menu responds
  m.isOpen = true;

  m.handleMenuKey(escapeEvent);
  t.ok(escapeEvent.preventDefault.calledOnce, 'escapeEvent called once');
  t.equal(m.closeMenu.getCall(0).args.length, 1, 'closeMenu called once');
  t.deepEqual(m.closeMenu.getCall(0).args[0], { focusButton: true });

  t.end();
});
