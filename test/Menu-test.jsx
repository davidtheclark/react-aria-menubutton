import test from 'tape';
import sinon from 'sinon';
import React from 'react/addons';
import Menu from '../src/Menu';

const ReactTestUtils = React.addons.TestUtils;

function mockManager() {
  return {
    menuItems: [1, 2],
    isOpen: false,
    closeMenu: sinon.spy(),
  };
}

test('Menu creation with only required props and element child', t => {
  // Closed
  const managerOne = mockManager();
  const renderedOne = ReactTestUtils.renderIntoDocument(
    <Menu manager={managerOne}>
      <div>foo</div>
    </Menu>
  );
  const nodeOne = React.findDOMNode(renderedOne);

  t.equal(managerOne.menu, renderedOne);

  t.equal(nodeOne, null);

  // Open
  const managerTwo = mockManager();
  managerTwo.isOpen = true;
  const renderedTwo = ReactTestUtils.renderIntoDocument(
    <Menu manager={managerTwo}>
      <div>foo</div>
    </Menu>
  );
  const nodeTwo = React.findDOMNode(renderedTwo);
  t.equal(nodeTwo.children.length, 1);
  t.equal(nodeTwo.children[0].tagName, 'DIV');
  t.equal(nodeTwo.children[0].textContent, 'foo');

  t.end();
});

test('Menu creation with all possible props and function child', t => {
  const manager = mockManager();
  const childFunction = sinon.spy(menuState => {
    return 'isOpen = ' + menuState.isOpen;
  });
  const rendered = ReactTestUtils.renderIntoDocument(
    <Menu
      manager={manager}
      id='foo'
      className='bar'
      tag='ul'
      noOverlay={true}
    >
      {childFunction}
    </Menu>
  );
  const node = React.findDOMNode(rendered);

  t.equal(manager.menu, rendered);

  t.equal(node.tagName, 'UL');
  t.equal(node.children.length, 0);
  t.equal(node.getAttribute('id'), 'foo');
  t.equal(node.getAttribute('class'), 'bar');
  t.equal(node.getAttribute('role'), 'menu');
  t.equal(node.textContent, 'isOpen = false');

  t.deepEqual(childFunction.getCall(0).args, [{ isOpen: false }]);

  // Open (still no overlay)
  const manager2 = mockManager();
  const childFunction2 = sinon.spy(menuState => {
    return 'isOpen = ' + menuState.isOpen;
  });
  const rendered2 = ReactTestUtils.renderIntoDocument(
    <Menu
      manager={manager2}
      id='foo'
      className='bar'
      tag='ul'
      noOverlay={true}
    >
      {childFunction2}
    </Menu>
  );
  const node2 = React.findDOMNode(rendered2);
  t.equal(node2.tagName, 'UL');
  t.equal(node2.children.length, 0);

  t.end();
});

test('Menu updating', t => {
  const manager = mockManager();
  const childFunction = sinon.spy();

  class Wrapper extends React.Component {
    constructor(props) {
      super(props);
      this.state = { open: false };
    }
    toggleMenu() {
      this.setState({ open: !this.state.open });
    }
    render() {
      return (
        <Menu manager={manager}>
          {childFunction}
        </Menu>
      );
    }
  }

  const renderedWrapper = ReactTestUtils.renderIntoDocument(<Wrapper />);

  manager.menuItems = [1, 2];
  renderedWrapper.toggleMenu();
  t.deepEqual(manager.menuItems, [], 'updating closed clears menuItems');

  t.end();
});
