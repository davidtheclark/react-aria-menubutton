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
    handleMenuKey: sinon.spy(),
    moveFocusDown: sinon.spy(),
    openMenu: sinon.spy(),
    closeMenu: sinon.spy(),
    handleKeyDown: sinon.spy(),
    handleClick: sinon.spy(),
    handleButtonNonArrowKey: sinon.spy(),
    focusItem: sinon.spy(),
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
        'data-something-something': 'seven', // arbitrary prop
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
  t.equal(renderedButtonNode.getAttribute('data-something-something'), 'seven');
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
  t.ok(renderedWrapper.manager.openMenu.calledOnce);

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

  t.test('down arrow', function(st) {
    ReactTestUtils.Simulate.keyDown(renderedButtonNode, downEvent);
    st.ok(downEvent.preventDefault.calledOnce, 'calls event.preventDefault');
    st.ok(manager.openMenu.calledOnce, 'calls open menu');
    st.end();
  });

  t.test('down arrow a second time', function(st) {
    manager.isOpen = true;
    ReactTestUtils.Simulate.keyDown(renderedButtonNode, downEvent);
    st.ok(downEvent.preventDefault.calledTwice, 'dcalls event.preventDefault');
    st.ok(manager.openMenu.calledTwice, 'ddoes not open menu again');
    st.end();
  });

  t.test('enter', function(st) {
    manager.isOpen = false;
    ReactTestUtils.Simulate.keyDown(renderedButtonNode, enterEvent);
    st.ok(enterEvent.preventDefault.calledOnce, 'enter calls event.preventDefault');
    st.ok(manager.openMenu.calledThrice, 'calls open menu');
    st.end();
  });

  t.test('space', function(st) {
    manager.isOpen = false;
    ReactTestUtils.Simulate.keyDown(renderedButtonNode, spaceEvent);
    st.ok(spaceEvent.preventDefault.calledOnce, 'space calls event.preventDefault');
    st.ok(manager.openMenu.callCount === 4, 'calls open menu');
    st.end();
  });

  t.test('escape', function(st) {
    ReactTestUtils.Simulate.keyDown(renderedButtonNode, escapeEvent);
    st.notOk(escapeEvent.preventDefault.calledOne, 'escape calls event.preventDefault');
    st.ok(manager.handleMenuKey.calledOnce, 'escape calls closeMenu');
    st.equal(manager.handleMenuKey.getCall(0).args[0].key, 'Escape', 'escape passes event');
    st.end();
  });

  t.test('f key', function(st) {
    ReactTestUtils.Simulate.keyDown(renderedButtonNode, fEvent);
    st.notOk(fEvent.preventDefault.called, 'f key calls event.preventDefault');
    st.ok(manager.handleButtonNonArrowKey.calledOnce, 'f key calls handleButtonNonArrowKey');
    st.equal(manager.handleButtonNonArrowKey.getCall(0).args[0].keyCode, 70, 'f key passes event');
    st.end();
  });

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
