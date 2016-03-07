var test = require('tape');
var sinon = require('sinon');
var React = require('react');
var ReactDOM = require('react-dom');
var ReactDOMServer = require('react-dom/server');
var ReactTestUtils = require('react-addons-test-utils');
var MockWrapper = require('./MockWrapper');
var MenuItem = require('../lib/MenuItem');

var el = React.createElement;

function mockManager() {
  return {
    handleSelection: sinon.spy(),
    currentFocus: -1,
    menuItems: [1, 2],
    addItem: sinon.spy(),
  };
}

test('MenuItem DOM with only required props', function(t) {
  var renderedWrapper = ReactTestUtils.renderIntoDocument(
    el(MockWrapper, { mockManager: mockManager() },
      el(MenuItem, null, 'foo')
    )
  );
  var renderedMenuItem = ReactTestUtils.findRenderedComponentWithType(renderedWrapper, MenuItem);
  var renderedMenuItemNode = ReactDOM.findDOMNode(renderedMenuItem);

  t.equal(renderedMenuItemNode.tagName.toLowerCase(), 'div');
  t.notOk(renderedMenuItemNode.getAttribute('id'));
  t.notOk(renderedMenuItemNode.getAttribute('class'));
  t.notOk(renderedMenuItemNode.getAttribute('style'));
  t.equal(renderedMenuItemNode.getAttribute('role'), 'menuitem');
  t.equal(renderedMenuItemNode.getAttribute('tabindex'), '-1');
  t.equal(renderedMenuItemNode.children.length, 0);
  t.equal(renderedMenuItemNode.innerHTML, 'foo');

  t.end();
});

test('MenuItem DOM with all possible props and element child', function(t) {
  var manager = mockManager();
  var renderedWrapper = ReactTestUtils.renderIntoDocument(
    el(MockWrapper, { mockManager: manager },
      el(MenuItem, {
        className: 'foobar',
        id: 'hogwash',
        tag: 'li',
        style: { right: '1em' },
        text: 'horse',
        value: 'lamb',
        'data-something-something': 'seven', // arbitrary prop
      }, el('a', { href: '#' }, 'foo'))
    )
  );
  var renderedMenuItem = ReactTestUtils.findRenderedComponentWithType(renderedWrapper, MenuItem);
  var renderedMenuItemNode = ReactDOM.findDOMNode(renderedMenuItem);

  t.equal(renderedMenuItemNode.tagName.toLowerCase(), 'li');
  t.equal(renderedMenuItemNode.getAttribute('id'), 'hogwash');
  t.equal(renderedMenuItemNode.getAttribute('class'), 'foobar');
  t.equal(renderedMenuItemNode.getAttribute('style').replace(/[ ;]/g, ''), 'right:1em');
  t.equal(renderedMenuItemNode.getAttribute('role'), 'menuitem');
  t.equal(renderedMenuItemNode.getAttribute('tabindex'), '-1');
  t.equal(renderedMenuItemNode.getAttribute('data-something-something'), 'seven');
  t.equal(renderedMenuItemNode.children.length, 1);
  t.equal(renderedMenuItemNode.children[0].tagName.toLowerCase(), 'a');
  t.equal(renderedMenuItemNode.children[0].innerHTML, 'foo');

  t.end();
});

test('MenuItem click without specified value prop', function(t) {
  var manager = mockManager();
  var renderedWrapper = ReactTestUtils.renderIntoDocument(
    el(MockWrapper, { mockManager: manager },
      el(MenuItem, null, 'foo')
    )
  );
  var renderedMenuItem = ReactTestUtils.findRenderedComponentWithType(renderedWrapper, MenuItem);
  var renderedMenuItemNode = ReactDOM.findDOMNode(renderedMenuItem);
  var mockEvent = { bee: 'baa' };

  ReactTestUtils.Simulate.click(renderedMenuItemNode, mockEvent);
  t.ok(manager.handleSelection.calledOnce);
  t.ok(manager.handleSelection.calledWithMatch('foo', mockEvent));

  t.end();
});

test('MenuItem click with specified value prop', function(t) {
  var manager = mockManager();
  var renderedWrapper = ReactTestUtils.renderIntoDocument(
    el(MockWrapper, { mockManager: manager },
      el(MenuItem, { value: 'bar' }, 'foo')
    )
  );
  var renderedMenuItem = ReactTestUtils.findRenderedComponentWithType(renderedWrapper, MenuItem);
  var renderedMenuItemNode = ReactDOM.findDOMNode(renderedMenuItem);
  var mockEvent = { bee: 'baa' };

  ReactTestUtils.Simulate.click(renderedMenuItemNode, mockEvent);
  t.ok(manager.handleSelection.calledOnce);
  t.ok(manager.handleSelection.calledWithMatch('bar', mockEvent));

  t.end();
});

test('MenuItem keyDown', function(t) {
  var manager = mockManager();
  var renderedWrapper = ReactTestUtils.renderIntoDocument(
    el(MockWrapper, { mockManager: manager },
      el(MenuItem, null, 'foo')
    )
  );
  var renderedMenuItem = ReactTestUtils.findRenderedComponentWithType(renderedWrapper, MenuItem);
  var renderedMenuItemNode = ReactDOM.findDOMNode(renderedMenuItem);
  var mockEnterEvent = { key: 'Enter' };
  var mockSpaceEvent = { key: ' ' };
  var mockEscapeEvent = { key: 'Escape' };

  ReactTestUtils.Simulate.keyDown(renderedMenuItemNode, mockEnterEvent);
  ReactTestUtils.Simulate.keyDown(renderedMenuItemNode, mockSpaceEvent);
  ReactTestUtils.Simulate.keyDown(renderedMenuItemNode, mockEscapeEvent); // should be ignored
  t.ok(manager.handleSelection.calledTwice);
  t.ok(manager.handleSelection.alwaysCalledWith('foo'));

  t.end();
});

test('MenuItem rendered via renderToString', function(t) {
  var manager = mockManager();
  t.doesNotThrow(function() {
    ReactDOMServer.renderToString(
      el(MockWrapper, { mockManager: manager },
        el(MenuItem, null, 'foo')
      )
    );
  });

  t.end();
});
