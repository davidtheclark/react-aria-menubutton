import test from 'tape';
import sinon from 'sinon';
import React from 'react/addons';
import Button from '../src/Button';

const ReactTestUtils = React.addons.TestUtils;

function mockManager() {
  return {
    isOpen: false,
    toggleMenu: sinon.spy(),
    moveFocusDown: sinon.spy(),
    openMenu: sinon.spy(),
    handleMenuKey: sinon.spy(),
    handleKeyDown: sinon.spy(),
    handleClick: sinon.spy(),
  };
}

function mockKeyEvent(key, keyCode) {
  return { key, keyCode, preventDefault: sinon.spy() };
}

test('Button creation with only required props and text child', t => {
  const manager = mockManager();
  const rendered = ReactTestUtils.renderIntoDocument(
    <Button manager={manager}>
      foo
    </Button>
  );
  const node = React.findDOMNode(rendered);

  t.equal(manager.button, rendered);

  // DOM
  t.equal(node.tagName, 'SPAN');
  t.notOk(node.getAttribute('id'));
  t.notOk(node.getAttribute('class'));
  t.equal(node.getAttribute('role'), 'button');
  t.equal(node.getAttribute('tabindex'), '0');
  t.equal(node.getAttribute('aria-haspopup'), 'true');
  t.equal(node.getAttribute('aria-expanded'), 'false');
  t.equal(node.children.length, 0);
  t.equal(node.textContent, 'foo');

  t.end();
});

test('Button creation with all possible props and element child', t => {
  const manager = mockManager();
  manager.isOpen = true;
  const rendered = ReactTestUtils.renderIntoDocument(
    <Button
      manager={manager}
      id='foo'
      className='bar'
      tag='button'
    >
      foo
    </Button>
  );
  const node = React.findDOMNode(rendered);

  t.equal(manager.button, rendered);

  // DOM
  t.equal(node.tagName, 'BUTTON');
  t.equal(node.getAttribute('id'), 'foo');
  t.equal(node.getAttribute('class'), 'bar');
  t.equal(node.getAttribute('role'), 'button');
  t.equal(node.getAttribute('tabindex'), '0');
  t.equal(node.getAttribute('aria-haspopup'), 'true');
  t.equal(node.getAttribute('aria-expanded'), 'true');
  t.equal(node.children.length, 0);
  t.equal(node.textContent, 'foo');

  t.end();
});

test('Button click', t => {
  const manager = mockManager();
  const rendered = ReactTestUtils.renderIntoDocument(
    <Button manager={manager}>
      foo
    </Button>
  );
  const node = React.findDOMNode(rendered);

  ReactTestUtils.Simulate.click(node);
  t.ok(manager.toggleMenu.calledOnce);

  t.end();
});

test('Button keyDown', t => {
  const manager = mockManager();
  const rendered = ReactTestUtils.renderIntoDocument(
    <Button manager={manager}>
      foo
    </Button>
  );
  const node = React.findDOMNode(rendered);
  const downEvent = mockKeyEvent('ArrowDown');
  const enterEvent = mockKeyEvent('Enter');
  const spaceEvent = mockKeyEvent(' ');
  const escapeEvent = mockKeyEvent('Escape');
  const fEvent = mockKeyEvent(null, 70);

  ReactTestUtils.Simulate.keyDown(node, downEvent);
  t.ok(downEvent.preventDefault.calledOnce);
  t.ok(manager.openMenu.calledOnce);
  t.deepEqual(manager.openMenu.getCall(0).args, [{ focusMenu: true }]);

  manager.isOpen = true;
  ReactTestUtils.Simulate.keyDown(node, downEvent);
  t.ok(downEvent.preventDefault.calledTwice);
  t.ok(manager.openMenu.calledOnce);
  t.ok(manager.moveFocusDown.calledOnce);

  ReactTestUtils.Simulate.keyDown(node, enterEvent);
  t.ok(enterEvent.preventDefault.calledOnce);
  t.ok(manager.toggleMenu.calledOnce);

  ReactTestUtils.Simulate.keyDown(node, spaceEvent);
  t.ok(spaceEvent.preventDefault.calledOnce);
  t.ok(manager.toggleMenu.calledTwice);

  ReactTestUtils.Simulate.keyDown(node, escapeEvent);
  t.notOk(escapeEvent.preventDefault.called);
  t.ok(manager.handleMenuKey.calledOnce);
  t.equal(manager.handleMenuKey.getCall(0).args[0].key, 'Escape');

  ReactTestUtils.Simulate.keyDown(node, fEvent);
  t.notOk(fEvent.preventDefault.called);
  t.ok(manager.handleMenuKey.calledTwice);
  t.equal(manager.handleMenuKey.getCall(1).args[0].keyCode, 70);

  t.end();
});
