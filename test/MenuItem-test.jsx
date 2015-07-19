import test from 'tape';
import sinon from 'sinon';
import React from 'react/addons';
import MenuItem from '../src/MenuItem';

const ReactTestUtils = React.addons.TestUtils;

function mockManager() {
  return {
    handleSelection: sinon.spy(),
    currentFocus: -1,
    menuItems: [1, 2],
  };
}

test('MenuItem creation with only required props', t => {
  const manager = mockManager();
  const rendered = ReactTestUtils.renderIntoDocument(
    <MenuItem manager={manager}>
      foo
    </MenuItem>
  );
  const node = React.findDOMNode(rendered);

  t.equal(rendered.managedIndex, 2);
  t.deepEqual(manager.menuItems, [1, 2, {
    node,
    content: 'foo',
    text: undefined,
  }]);

  // DOM
  t.equal(node.tagName, 'DIV');
  t.notOk(node.getAttribute('id'));
  t.notOk(node.getAttribute('class'));
  t.equal(node.getAttribute('role'), 'menuitem');
  t.equal(node.getAttribute('tabindex'), '-1');
  t.equal(node.children.length, 0);
  t.equal(node.textContent, 'foo');

  t.end();
});

test('MenuItem creation with all possible props and element child', t => {
  const manager = mockManager();
  manager.menuItems.push(3);
  const rendered = ReactTestUtils.renderIntoDocument(
    <MenuItem
      manager={manager}
      className='foobar'
      id='hogwash'
      tag='li'
      text='horse'
      value='lamb'
    >
      <a href='#'>foo</a>
    </MenuItem>
  );
  const node = React.findDOMNode(rendered);

  t.equal(rendered.managedIndex, 3);
  const managedMenuItem = manager.menuItems[rendered.managedIndex];
  t.deepEqual(managedMenuItem.node, node);
  t.equal(managedMenuItem.text, 'horse');
  t.equal(managedMenuItem.content.type, 'a');
  t.deepEqual(managedMenuItem.content.props, {
    href: '#',
    children: 'foo',
  });

  // DOM
  t.equal(node.tagName, 'LI');
  t.equal(node.getAttribute('id'), 'hogwash');
  t.equal(node.getAttribute('class'), 'foobar');
  t.equal(node.getAttribute('role'), 'menuitem');
  t.equal(node.getAttribute('tabindex'), '-1');
  t.equal(node.firstChild.tagName, 'A');
  t.equal(node.firstChild.getAttribute('href'), '#');
  t.equal(node.firstChild.textContent, 'foo');

  t.end();
});

test('MenuItem click', t => {
  const managerOne = mockManager();
  const renderedOne = ReactTestUtils.renderIntoDocument(
    <MenuItem manager={managerOne}>
      foo
    </MenuItem>
  );
  const nodeOne = React.findDOMNode(renderedOne);
  const mockEventOne = { bee: 'baa' };

  ReactTestUtils.Simulate.click(nodeOne, mockEventOne);
  t.ok(managerOne.handleSelection.calledOnce);
  t.ok(managerOne.handleSelection.calledWithMatch('foo', mockEventOne));
  t.equal(managerOne.currentFocus, 2);

  // With specified value prop
  const managerTwo = mockManager();
  managerTwo.menuItems.push(3, 4, 5);
  const renderedTwo = ReactTestUtils.renderIntoDocument(
    <MenuItem
      manager={managerTwo}
      value='bar'
    >
      foo
    </MenuItem>
  );
  const nodeTwo = React.findDOMNode(renderedTwo);
  const mockEventTwo = { bee: 'baa' };

  ReactTestUtils.Simulate.click(nodeTwo, mockEventTwo);
  t.ok(managerTwo.handleSelection.calledOnce);
  t.ok(managerTwo.handleSelection.calledWithMatch('bar', mockEventTwo));
  t.equal(managerTwo.currentFocus, 5);

  t.end();
});

test('MenuItem keyDown', t => {
  const manager = mockManager();
  const rendered = ReactTestUtils.renderIntoDocument(
    <MenuItem manager={manager}>
      foo
    </MenuItem>
  );
  const node = React.findDOMNode(rendered);
  const mockEnterEvent = { key: 'Enter' };
  const mockSpaceEvent = { key: ' ' };
  const mockEscapeEvent = { key: 'Escape' };

  ReactTestUtils.Simulate.keyDown(node, mockEnterEvent);
  ReactTestUtils.Simulate.keyDown(node, mockSpaceEvent);
  ReactTestUtils.Simulate.keyDown(node, mockEscapeEvent); // should be ignored
  t.ok(manager.handleSelection.calledTwice);
  t.ok(manager.handleSelection.alwaysCalledWith('foo'));

  t.end();
});
