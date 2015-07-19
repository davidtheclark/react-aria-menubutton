import test from 'tape';
import sinon from 'sinon';
import React from 'react';
import Manager from '../src/Manager';

function mockManager(options) {
  const manager = new Manager(options);
  const firstItem = {
    node: { focus: sinon.spy() },
    text: 'first',
  };
  const secondItem = {
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
  return { key, keyCode, preventDefault: sinon.spy() };
}

test('Manager initialization', t => {
  const m = mockManager();
  t.equal(m.currentFocus, -1);
  t.notOk(m.isOpen);
  t.ok(m.options.closeOnSelection);
  t.end();
});

test('Manager#update', t => {
  const m = mockManager();
  m.update();
  t.ok(m.menu.setState.calledWith({ isOpen: m.isOpen }));
  t.ok(m.button.setState.calledWith({ menuOpen: m.isOpen }));
  t.end();
});

test('Manager#openMenu without focusing in menu', t => {
  const m = mockManager();

  m.openMenu();
  t.ok(m.isOpen);
  t.ok(m.menu.setState.calledWith({ isOpen: true }));
  t.ok(m.button.setState.calledWith({ menuOpen: true }));
  t.equal(m.currentFocus, -1);

  t.end();
});

test('Manager#openMenu focusing in menu', t => {
  const m = mockManager();
  sinon.spy(m, 'moveFocus');

  t.plan(4);
  m.openMenu({ focusMenu: true });
  t.ok(m.isOpen);
  t.ok(m.menu.setState.calledWith({ isOpen: true }));
  t.ok(m.button.setState.calledWith({ menuOpen: true }));
  setTimeout(() => {
    t.ok(m.moveFocus.calledWith(0));
  }, 0);
});

test('Manager#closeMenu focusing on button', t => {
  const m = mockManager();
  const mockNode = { focus: sinon.spy() };
  const findDOMNodeStub = sinon.stub(React, 'findDOMNode').returns(mockNode);

  m.closeMenu();
  t.notOk(m.isOpen);
  t.ok(m.menu.setState.calledWith({ isOpen: false }));
  t.ok(m.button.setState.calledWith({ menuOpen: false }));
  t.ok(mockNode.focus.calledOnce);

  findDOMNodeStub.restore();

  t.end();
});

test('Manager#closeMenu without focusing on button', t => {
  const m = mockManager();
  const mockNode = { focus: sinon.spy() };
  const findDOMNodeStub = sinon.stub(React, 'findDOMNode').returns(mockNode);

  m.closeMenu({ focusButton: false });
  t.notOk(mockNode.focus.calledOnce);

  findDOMNodeStub.restore();

  t.end();
});

test('Manager#toggleMenu', t => {
  const m = mockManager();
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


test('Manager#moveFocus', t => {
  const m = mockManager();

  m.moveFocus(1);
  t.equal(m.currentFocus, 1);
  t.ok(m.menuItems[1].node.focus.calledOnce);

  m.moveFocus(0);
  t.equal(m.currentFocus, 0);
  t.ok(m.menuItems[0].node.focus.calledOnce);

  t.end();
});

test('Manager#moveFocusUp', t => {
  const m = mockManager();
  sinon.spy(m, 'moveFocus');

  m.moveFocusUp();
  t.equal(m.moveFocus.getCall(0).args[0], 1);
  m.moveFocusUp();
  t.equal(m.moveFocus.getCall(1).args[0], 0);
  m.moveFocusUp();
  t.equal(m.moveFocus.getCall(2).args[0], 1);
  t.end();
});

test('Manager#moveFocusDown', t => {
  const m = mockManager();
  sinon.spy(m, 'moveFocus');

  m.moveFocusDown();
  t.equal(m.moveFocus.getCall(0).args[0], 0);
  m.moveFocusDown();
  t.equal(m.moveFocus.getCall(1).args[0], 1);
  m.moveFocusDown();
  t.equal(m.moveFocus.getCall(2).args[0], 0);
  t.end();
});

test('Manager#moveToLetter', t => {
  const m = mockManager();
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

test('Manager#handleSelection', t => {
  const mOneHandler = sinon.spy();
  const mOne = mockManager({
    onSelection: mOneHandler,
  });
  sinon.stub(mOne, 'closeMenu');
  mOne.handleSelection('foo', { bar: 1 });
  t.equal(mOne.closeMenu.getCall(0).args.length, 0);
  t.deepEqual(mOneHandler.getCall(0).args, ['foo', { bar: 1 }]);

  const mTwoHandler = sinon.spy();
  const mTwo = mockManager({
    closeOnSelection: false,
    onSelection: mTwoHandler,
  });
  sinon.stub(mTwo, 'closeMenu');
  mTwo.handleSelection('foo', { bar: 1 });
  t.notOk(mTwo.closeMenu.called);
  t.deepEqual(mTwoHandler.getCall(0).args, ['foo', { bar: 1 }]);

  t.end();
});

test('Manager#handleMenuKey', t => {
  const escapeEvent = mockKeyEvent('Escape');
  const upEvent = mockKeyEvent('ArrowUp');
  const downEvent = mockKeyEvent('ArrowDown');
  const fEvent = mockKeyEvent(null, 70);
  const sEvent = mockKeyEvent(null, 83);

  const m = mockManager();
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
  t.notOk(m.closeMenu.called);
  t.notOk(m.moveFocusUp.called);
  t.notOk(m.moveFocusDown.called);
  t.notOk(m.moveToLetter.called);

  // Open menu responds
  m.isOpen = true;

  m.handleMenuKey(escapeEvent);
  t.ok(escapeEvent.preventDefault.calledOnce);
  t.equal(m.closeMenu.getCall(0).args.length, 0);

  m.handleMenuKey(upEvent);
  t.ok(upEvent.preventDefault.calledOnce);
  t.ok(m.moveFocusUp.calledOnce);

  m.handleMenuKey(downEvent);
  t.ok(downEvent.preventDefault.calledOnce);
  t.ok(m.moveFocusDown.calledOnce);

  m.handleMenuKey(fEvent);
  t.ok(fEvent.preventDefault.calledOnce);
  t.deepEqual(m.moveToLetter.getCall(0).args, ['F']);

  m.handleMenuKey(sEvent);
  t.ok(sEvent.preventDefault.calledOnce);
  t.deepEqual(m.moveToLetter.getCall(1).args, ['S']);

  t.end();
});
