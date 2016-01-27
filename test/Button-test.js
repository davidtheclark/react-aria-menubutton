var test = require('tape');
var sinon = require('sinon');
var React = require('react');
var ReactDOM = require('react-dom');
var ReactDOMServer = require('react-dom/server');
var ReactTestUtils = require('react-addons-test-utils');
var MockWrapper = require('./MockWrapper');
var Button = require('../lib/Button');

var el = React.createElement;

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
  return {
    key: key,
    keyCode: keyCode,
    preventDefault: sinon.spy(),
  };
}

test('Button DOM with only required props and text child', function(t) {
  var renderedWrapper = ReactTestUtils.renderIntoDocument(
    el(MockWrapper, { mockManager: mockManager() },
      el(Button, null, 'foo')
    )
  );
  var renderedButton = ReactTestUtils.findRenderedComponentWithType(renderedWrapper, Button);
  var renderedButtonNode = ReactDOM.findDOMNode(renderedButton);

  t.equal(renderedWrapper.manager.button, renderedButton);

  // DOM
  t.equal(renderedButtonNode.tagName.toLowerCase(), 'span');
  t.notOk(renderedButtonNode.getAttribute('id'));
  t.notOk(renderedButtonNode.getAttribute('class'));
  t.notOk(renderedButtonNode.getAttribute('style'));
  t.equal(renderedButtonNode.getAttribute('role'), 'button');
  t.equal(renderedButtonNode.getAttribute('tabindex'), '0');
  t.equal(renderedButtonNode.getAttribute('aria-haspopup'), 'true');
  t.equal(renderedButtonNode.getAttribute('aria-expanded'), 'false');
  t.equal(renderedButtonNode.children.length, 0);
  t.equal(renderedButtonNode.textContent, 'foo');

  t.end();
});

test('Button DOM with all possible props and element child', function(t) {
  var renderedWrapper = ReactTestUtils.renderIntoDocument(
    el(MockWrapper, { mockManager: mockManager() },
      el(Button, {
        id: 'foo',
        className: 'bar',
        style: { top: 2 },
        tag: 'button',
        disabled: true,
      },
        el('span', null, 'hooha')
      )
    )
  );
  var renderedButton = ReactTestUtils.findRenderedComponentWithType(renderedWrapper, Button);
  var renderedButtonNode = ReactDOM.findDOMNode(renderedButton);

  t.equal(renderedWrapper.manager.button, renderedButton);

  // DOM
  t.equal(renderedButtonNode.tagName.toLowerCase(), 'button');
  t.equal(renderedButtonNode.getAttribute('id'), 'foo');
  t.equal(renderedButtonNode.getAttribute('class'), 'bar');
  t.equal(renderedButtonNode.getAttribute('style').replace(/[ ;]/g, ''), 'top:2px');
  t.equal(renderedButtonNode.getAttribute('role'), 'button');
  t.ok(renderedButtonNode.getAttribute('tabindex') !== '0');
  t.equal(renderedButtonNode.getAttribute('aria-haspopup'), 'true');
  t.equal(renderedButtonNode.getAttribute('aria-expanded'), 'false');
  t.equal(renderedButtonNode.getAttribute('aria-disabled'), 'true');
  t.equal(renderedButtonNode.children.length, 1);
  t.equal(renderedButtonNode.children[0].tagName.toLowerCase(), 'span');
  t.equal(renderedButtonNode.textContent, 'hooha');

  t.end();
});

test('Button click', function(t) {
  var renderedWrapper = ReactTestUtils.renderIntoDocument(
    el(MockWrapper, { mockManager: mockManager() },
      el(Button, null, 'foo')
    )
  );
  var renderedButton = ReactTestUtils.findRenderedComponentWithType(renderedWrapper, Button);
  var renderedButtonNode = ReactDOM.findDOMNode(renderedButton);

  ReactTestUtils.Simulate.click(renderedButtonNode);
  t.ok(renderedWrapper.manager.toggleMenu.calledOnce);

  var disabledRenderedWrapper = ReactTestUtils.renderIntoDocument(
    el(MockWrapper, { mockManager: mockManager() },
      el(Button, { disabled: true }, 'foo')
    )
  );
  var disabledRenderedButton = ReactTestUtils.findRenderedComponentWithType(disabledRenderedWrapper, Button);
  var disabledRenderedButtonNode = ReactDOM.findDOMNode(disabledRenderedButton);

  ReactTestUtils.Simulate.click(disabledRenderedButtonNode);
  t.notOk(disabledRenderedWrapper.manager.toggleMenu.calledOnce, 'no effect when disabled');

  t.end();
});

test('Button keyDown', function(t) {
  var renderedWrapper = ReactTestUtils.renderIntoDocument(
    el(MockWrapper, { mockManager: mockManager() },
      el(Button, null, 'foo')
    )
  );
  var renderedButton = ReactTestUtils.findRenderedComponentWithType(renderedWrapper, Button);
  var renderedButtonNode = ReactDOM.findDOMNode(renderedButton);
  var manager = renderedWrapper.manager;
  var downEvent = mockKeyEvent('ArrowDown');
  var enterEvent = mockKeyEvent('Enter');
  var spaceEvent = mockKeyEvent(' ');
  var escapeEvent = mockKeyEvent('Escape');
  var fEvent = mockKeyEvent(null, 70);

  ReactTestUtils.Simulate.keyDown(renderedButtonNode, downEvent);
  t.ok(downEvent.preventDefault.calledOnce);
  t.ok(manager.openMenu.calledOnce);
  t.deepEqual(manager.openMenu.getCall(0).args, [{ focusMenu: true }]);

  manager.isOpen = true;
  ReactTestUtils.Simulate.keyDown(renderedButtonNode, downEvent);
  t.ok(downEvent.preventDefault.calledTwice);
  t.ok(manager.openMenu.calledOnce);
  t.ok(manager.moveFocusDown.calledOnce);

  ReactTestUtils.Simulate.keyDown(renderedButtonNode, enterEvent);
  t.ok(enterEvent.preventDefault.calledOnce);
  t.ok(manager.toggleMenu.calledOnce);

  ReactTestUtils.Simulate.keyDown(renderedButtonNode, spaceEvent);
  t.ok(spaceEvent.preventDefault.calledOnce);
  t.ok(manager.toggleMenu.calledTwice);

  ReactTestUtils.Simulate.keyDown(renderedButtonNode, escapeEvent);
  t.notOk(escapeEvent.preventDefault.called);
  t.ok(manager.handleMenuKey.calledOnce);
  t.equal(manager.handleMenuKey.getCall(0).args[0].key, 'Escape');

  ReactTestUtils.Simulate.keyDown(renderedButtonNode, fEvent);
  t.notOk(fEvent.preventDefault.called);
  t.ok(manager.handleMenuKey.calledTwice);
  t.equal(manager.handleMenuKey.getCall(1).args[0].keyCode, 70);

  enterEvent.preventDefault.reset();
  var disabledRenderedWrapper = ReactTestUtils.renderIntoDocument(
    el(MockWrapper, { mockManager: mockManager() },
      el(Button, { disabled: true }, 'foo')
    )
  );
  var disabledRenderedButton = ReactTestUtils.findRenderedComponentWithType(disabledRenderedWrapper, Button);
  var disabledRenderedButtonNode = ReactDOM.findDOMNode(disabledRenderedButton);

  ReactTestUtils.Simulate.keyDown(disabledRenderedButtonNode, enterEvent);
  t.notOk(enterEvent.preventDefault.calledOnce, 'no effect when disabled');

  t.end();
});

test('Button rendered via renderToString', function(t) {
  t.doesNotThrow(function() {
    ReactDOMServer.renderToString(
      el(MockWrapper, { mockManager: mockManager() },
        el(Button, null, 'foo')
      )
    );
  });

  t.end();
});
