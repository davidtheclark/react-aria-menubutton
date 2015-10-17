import test from 'tape';
import sinon from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import ReactTestUtils from 'react-addons-test-utils';
import MockWrapper from './MockWrapper';
import MenuItem from '../src/MenuItem';

function mockManager() {
  return {
    handleSelection: sinon.spy(),
    currentFocus: -1,
    menuItems: [1, 2],
  };
}

test('MenuItem DOM with only required props', t => {
  const renderedWrapper = ReactTestUtils.renderIntoDocument(
    <MockWrapper mockManager={mockManager()}>
      <MenuItem>
        foo
      </MenuItem>
    </MockWrapper>
  );
  const renderedMenuItem = ReactTestUtils.findRenderedComponentWithType(renderedWrapper, MenuItem);
  const renderedMenuItemNode = ReactDOM.findDOMNode(renderedMenuItem);

  t.equal(renderedMenuItem.managedIndex, 2);
  t.deepEqual(renderedWrapper.manager.menuItems, [1, 2, {
    node: renderedMenuItemNode,
    content: 'foo',
    text: undefined,
  }]);

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

test('MenuItem DOM with only all possible props and element child, at item index 3', t => {
  const manager = mockManager();
  manager.menuItems.push(3);
  const renderedWrapper = ReactTestUtils.renderIntoDocument(
    <MockWrapper mockManager={manager}>
      <MenuItem
        className='foobar'
        id='hogwash'
        tag='li'
        style={{ right: '1em' }}
        text='horse'
        value='lamb'
      >
        <a href='#'>
          foo
        </a>
      </MenuItem>
    </MockWrapper>
  );
  const renderedMenuItem = ReactTestUtils.findRenderedComponentWithType(renderedWrapper, MenuItem);
  const renderedMenuItemNode = ReactDOM.findDOMNode(renderedMenuItem);

  t.equal(renderedMenuItem.managedIndex, 3);

  t.equal(renderedMenuItemNode.tagName.toLowerCase(), 'li');
  t.equal(renderedMenuItemNode.getAttribute('id'), 'hogwash');
  t.equal(renderedMenuItemNode.getAttribute('class'), 'foobar');
  t.equal(renderedMenuItemNode.getAttribute('style').replace(/[ ;]/g, ''), 'right:1em');
  t.equal(renderedMenuItemNode.getAttribute('role'), 'menuitem');
  t.equal(renderedMenuItemNode.getAttribute('tabindex'), '-1');
  t.equal(renderedMenuItemNode.children.length, 1);
  t.equal(renderedMenuItemNode.children[0].tagName.toLowerCase(), 'a');
  t.equal(renderedMenuItemNode.children[0].innerHTML, 'foo');

  t.end();
});

test('MenuItem click without specified value prop', t => {
  const manager = mockManager();
  const renderedWrapper = ReactTestUtils.renderIntoDocument(
    <MockWrapper mockManager={manager}>
      <MenuItem>
        foo
      </MenuItem>
    </MockWrapper>
  );
  const renderedMenuItem = ReactTestUtils.findRenderedComponentWithType(renderedWrapper, MenuItem);
  const renderedMenuItemNode = ReactDOM.findDOMNode(renderedMenuItem);
  const mockEvent = { bee: 'baa' };

  ReactTestUtils.Simulate.click(renderedMenuItemNode, mockEvent);
  t.ok(manager.handleSelection.calledOnce);
  t.ok(manager.handleSelection.calledWithMatch('foo', mockEvent));
  t.equal(manager.currentFocus, 2);

  t.end();
});

test('MenuItem click with specified value prop, at item index 5', t => {
  const manager = mockManager();
  manager.menuItems.push(3, 4, 5);
  const renderedWrapper = ReactTestUtils.renderIntoDocument(
    <MockWrapper mockManager={manager}>
      <MenuItem value='bar'>
        foo
      </MenuItem>
    </MockWrapper>
  );
  const renderedMenuItem = ReactTestUtils.findRenderedComponentWithType(renderedWrapper, MenuItem);
  const renderedMenuItemNode = ReactDOM.findDOMNode(renderedMenuItem);
  const mockEvent = { bee: 'baa' };

  ReactTestUtils.Simulate.click(renderedMenuItemNode, mockEvent);
  t.ok(manager.handleSelection.calledOnce);
  t.ok(manager.handleSelection.calledWithMatch('bar', mockEvent));
  t.equal(manager.currentFocus, 5);

  t.end();
});

test('MenuItem keyDown', t => {
  const manager = mockManager();
  const renderedWrapper = ReactTestUtils.renderIntoDocument(
    <MockWrapper mockManager={manager}>
      <MenuItem>
        foo
      </MenuItem>
    </MockWrapper>
  );
  const renderedMenuItem = ReactTestUtils.findRenderedComponentWithType(renderedWrapper, MenuItem);
  const renderedMenuItemNode = ReactDOM.findDOMNode(renderedMenuItem);
  const mockEnterEvent = { key: 'Enter' };
  const mockSpaceEvent = { key: ' ' };
  const mockEscapeEvent = { key: 'Escape' };

  ReactTestUtils.Simulate.keyDown(renderedMenuItemNode, mockEnterEvent);
  ReactTestUtils.Simulate.keyDown(renderedMenuItemNode, mockSpaceEvent);
  ReactTestUtils.Simulate.keyDown(renderedMenuItemNode, mockEscapeEvent); // should be ignored
  t.ok(manager.handleSelection.calledTwice);
  t.ok(manager.handleSelection.alwaysCalledWith('foo'));

  t.end();
});

test('MenuItem rendered via renderToString', t => {
  const manager = mockManager();
  t.doesNotThrow(() => {
    ReactDOMServer.renderToString(
      <MockWrapper mockManager={manager}>
        <MenuItem>
          foo
        </MenuItem>
      </MockWrapper>
    );
  });

  t.end();
});
