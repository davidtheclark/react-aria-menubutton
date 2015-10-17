import test from 'tape';
import sinon from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import ReactTestUtils from 'react-addons-test-utils';
import MockWrapper from './MockWrapper';
import Menu from '../src/Menu';

function mockManager() {
  return {
    menuItems: [1, 2],
    isOpen: false,
    closeMenu: sinon.spy(),
  };
}

test('Closed Menu DOM with only required props and element child', t => {
  const renderedWrapper = ReactTestUtils.renderIntoDocument(
    <MockWrapper mockManager={mockManager()}>
      <Menu>
        <div>
          foo
        </div>
      </Menu>
    </MockWrapper>
  );
  const renderedMenu = ReactTestUtils.findRenderedComponentWithType(renderedWrapper, Menu);
  const renderedMenuNode = ReactDOM.findDOMNode(renderedMenu);

  t.equal(renderedWrapper.manager.menu, renderedMenu);
  t.equal(renderedMenuNode, null);

  t.end();
});

test('Open Menu DOM with only required props and element child', t => {
  const manager = mockManager();
  manager.isOpen = true;
  const renderedWrapper = ReactTestUtils.renderIntoDocument(
    <MockWrapper mockManager={manager}>
      <Menu>
        <div>
          foo
        </div>
      </Menu>
    </MockWrapper>
  );
  const renderedMenu = ReactTestUtils.findRenderedComponentWithType(renderedWrapper, Menu);
  const renderedMenuNode = ReactDOM.findDOMNode(renderedMenu);

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

test('Closed menu DOM with all possible props and function child', t => {
  const manager = mockManager();
  const childFunction = sinon.spy(menuState => {
    return 'isOpen = ' + menuState.isOpen;
  });
  const renderedWrapper = ReactTestUtils.renderIntoDocument(
    <MockWrapper mockManager={manager}>
      <Menu
        id='foo'
        className='bar'
        style={{ bottom: 1 }}
        tag='ul'
      >
        {childFunction}
      </Menu>
    </MockWrapper>
  );
  const renderedMenu = ReactTestUtils.findRenderedComponentWithType(renderedWrapper, Menu);
  const renderedMenuNode = ReactDOM.findDOMNode(renderedMenu);

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

test('Open menu DOM with all possible props and function child', t => {
  const manager = mockManager();
  manager.isOpen = true;
  const childFunction = sinon.spy(menuState => {
    return 'isOpen = ' + menuState.isOpen;
  });
  const renderedWrapper = ReactTestUtils.renderIntoDocument(
    <MockWrapper mockManager={manager}>
      <Menu
        id='bar'
        className='foo'
        style={{ left: 1 }}
        tag='section'
      >
        {childFunction}
      </Menu>
    </MockWrapper>
  );
  const renderedMenu = ReactTestUtils.findRenderedComponentWithType(renderedWrapper, Menu);
  const renderedMenuNode = ReactDOM.findDOMNode(renderedMenu);

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

test('Menu updating', t => {
  const manager = mockManager();
  const childFunction = sinon.spy();

  class LittleApp extends React.Component {
    constructor(props) {
      super(props);
      this.state = { open: false };
    }
    toggleMenu() {
      this.setState({ open: !this.state.open });
    }
    render() {
      return (
        <MockWrapper mockManager={manager}>
          <Menu>
            {childFunction}
          </Menu>
        </MockWrapper>
      );
    }
  }

  const renderedLittleApp = ReactTestUtils.renderIntoDocument(<LittleApp />);

  manager.menuItems = [1, 2];
  renderedLittleApp.toggleMenu();
  t.deepEqual(manager.menuItems, [], 'updating closed clears menuItems');

  t.end();
});

test('Menu rendered via renderToString', t => {
  const manager = mockManager();
  t.doesNotThrow(() => {
    ReactDOMServer.renderToString(
      <MockWrapper mockManager={manager}>
        <Menu>
          <div>
            foo
          </div>
        </Menu>
      </MockWrapper>
    );
  });

  t.end();
});
