var test = require('tape');
var sinon = require('sinon');
var React = require('react');
var ReactDOM = require('react-dom');
var ReactDOMServer = require('react-dom/server');
var ReactTestUtils = require('react-addons-test-utils');
var MockWrapper = require('./MockWrapper');
var Menu = require('../lib/Menu');

var el = React.createElement;

function mockManager() {
  return {
    menuItems: [1, 2],
    isOpen: false,
    handleMenuKey: sinon.spy(),
    clearItems: sinon.spy(),
  };
}

test('Closed Menu DOM with only required props and element child', function(t) {
  var renderedWrapper = ReactTestUtils.renderIntoDocument(
    el(MockWrapper, { mockManager: mockManager() },
      el(Menu, null,
        el('div', null, 'foo')
      )
    )
  );
  var renderedMenu = ReactTestUtils.findRenderedComponentWithType(renderedWrapper, Menu);
  var renderedMenuNode = ReactDOM.findDOMNode(renderedMenu);

  t.equal(renderedWrapper.manager.menu, renderedMenu);
  t.equal(renderedMenuNode, null);

  t.end();
});

test('Open Menu DOM with only required props and element child', function(t) {
  var manager = mockManager();
  manager.isOpen = true;
  var renderedWrapper = ReactTestUtils.renderIntoDocument(
    el(MockWrapper, { mockManager: manager },
      el(Menu, null, el('div', null, 'foo'))
    )
  );
  var renderedMenu = ReactTestUtils.findRenderedComponentWithType(renderedWrapper, Menu);
  var renderedMenuNode = ReactDOM.findDOMNode(renderedMenu);

  t.equal(manager.menu, renderedMenu);

  t.equal(renderedMenuNode.tagName.toLowerCase(), 'div');
  t.notOk(renderedMenuNode.getAttribute('id'));
  t.notOk(renderedMenuNode.getAttribute('class'));
  t.notOk(renderedMenuNode.getAttribute('style'));
  t.equal(renderedMenuNode.getAttribute('role'), 'menu');
  t.equal(renderedMenuNode.children.length, 1);
  t.equal(renderedMenuNode.children[0].tagName.toLowerCase(), 'div');
  t.equal(renderedMenuNode.children[0].innerHTML, 'foo');

  t.end();
});

test('Closed menu DOM with all possible props and function child', function(t) {
  var manager = mockManager();
  var childFunction = sinon.spy(function(menuState) {
    return 'isOpen = ' + menuState.isOpen;
  });
  var renderedWrapper = ReactTestUtils.renderIntoDocument(
    el(MockWrapper, { mockManager: manager },
      el(Menu, {
        id: 'foo',
        className: 'bar',
        style: { bottom: 1 },
        tag: 'ul',
      }, childFunction)
    )
  );
  var renderedMenu = ReactTestUtils.findRenderedComponentWithType(renderedWrapper, Menu);
  var renderedMenuNode = ReactDOM.findDOMNode(renderedMenu);

  t.equal(manager.menu, renderedMenu);

  t.equal(renderedMenuNode.tagName.toLowerCase(), 'ul');
  t.equal(renderedMenuNode.getAttribute('id'), 'foo');
  t.equal(renderedMenuNode.getAttribute('class'), 'bar');
  t.equal(renderedMenuNode.getAttribute('style').replace(/[ ;]/g, ''), 'bottom:1px');
  t.equal(renderedMenuNode.getAttribute('role'), 'menu');
  t.equal(renderedMenuNode.innerHTML, 'isOpen = false');
  t.equal(renderedMenuNode.children.length, 0);
  t.deepEqual(childFunction.getCall(0).args, [{ isOpen: false }]);

  t.end();
});

test('Open menu DOM with all possible props and function child', function(t) {
  var manager = mockManager();
  manager.isOpen = true;
  var childFunction = sinon.spy(function(menuState) {
    return 'isOpen = ' + menuState.isOpen;
  });
  var renderedWrapper = ReactTestUtils.renderIntoDocument(
    el(MockWrapper, { mockManager: manager },
      el(Menu, {
        id: 'bar',
        className: 'foo',
        style: { left: 1 },
        tag: 'section',
      }, childFunction)
    )
  );
  var renderedMenu = ReactTestUtils.findRenderedComponentWithType(renderedWrapper, Menu);
  var renderedMenuNode = ReactDOM.findDOMNode(renderedMenu);

  t.equal(manager.menu, renderedMenu);

  t.equal(renderedMenuNode.tagName.toLowerCase(), 'section');
  t.equal(renderedMenuNode.getAttribute('id'), 'bar');
  t.equal(renderedMenuNode.getAttribute('class'), 'foo');
  t.equal(renderedMenuNode.getAttribute('style').replace(/[ ;]/g, ''), 'left:1px');
  t.equal(renderedMenuNode.getAttribute('role'), 'menu');
  t.equal(renderedMenuNode.innerHTML, 'isOpen = true');
  t.equal(renderedMenuNode.children.length, 0);
  t.deepEqual(childFunction.getCall(0).args, [{ isOpen: true }]);

  t.end();
});

test('Menu updating', function(t) {
  var manager = mockManager();
  var childFunction = sinon.spy();

  var LittleApp = React.createClass({
    getInitialState: function() {
      return { open: false };
    },
    toggleMenu: function() {
      this.setState({ open: !this.state.open });
    },
    render: function() {
      return el(MockWrapper, { mockManager: manager},
        el(Menu, null, childFunction)
      );
    },
  });

  var renderedLittleApp = ReactTestUtils.renderIntoDocument(el(LittleApp));

  manager.menuItems = [1, 2];
  renderedLittleApp.toggleMenu();
  t.ok(manager.clearItems.calledOnce, 'closing clears focus group');

  t.end();
});

test('Menu rendered via renderToString', function(t) {
  var manager = mockManager();
  t.doesNotThrow(function() {
    ReactDOMServer.renderToString(
      el(MockWrapper, { mockManager: manager },
        el(Menu, null, el('div', null, 'foo'))
      )
    )
  });

  t.end();
});
