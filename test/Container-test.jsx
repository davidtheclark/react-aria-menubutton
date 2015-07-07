import test from 'tape';
import sinon from 'sinon';
import React from 'react/addons';
import Container from '../src/Container';
import Menu from '../src/Menu';
import Trigger from '../src/Trigger';

const ReactTestUtils = React.addons.TestUtils;

test('Container closed markup', t => {
  const shallowRenderer = ReactTestUtils.createRenderer();

  const mockMenu = (
    <ul>
      <li>foo</li>
      <li>bar</li>
    </ul>
  );
  const mockManager = {};

  shallowRenderer.render(
    <Container
      manager={mockManager}
      handleSelection={() => {}}
      menu={mockMenu}
    >
      <div id='foo'>
        bar
      </div>
    </Container>
  );
  const container = shallowRenderer.getRenderOutput();
  t.equal(container.type, 'div');
  t.equal(container.props.children.length, 2);

  // Trigger
  const trigger = container.props.children[0];
  const triggerProps = trigger.props;
  t.equal(trigger.type, Trigger);
  t.equal(triggerProps.manager, mockManager);
  t.equal(trigger.menuIsOpen, container.props.openMenu);
  t.equal(trigger.toggleMenu, container.props.toggleMenu);

  const triggerChild = triggerProps.children;
  t.equal(triggerChild.type, 'div');
  t.equal(triggerChild.props.id, 'foo');
  t.equal(triggerChild.props.children, 'bar');

  // Menu
  const menu = container.props.children[1];
  t.equal(menu, false);

  t.end();
});

test('Container open markup', t => {
  const shallowRenderer = ReactTestUtils.createRenderer();

  const mockMenu = (
    <ul>
      <li>foo</li>
      <li>bar</li>
    </ul>
  );
  const mockManager = {};

  shallowRenderer.render(
    <Container
      manager={mockManager}
      handleSelection={() => {}}
      menu={mockMenu}
      startOpen={true}
      tag={'section'}
    >
      bar
    </Container>
  );
  const container = shallowRenderer.getRenderOutput();

  t.equal(container.type, 'section');
  t.equal(container.props.children.length, 2);

  // Trigger
  const trigger = container.props.children[0];
  t.equal(trigger.type, Trigger);

  // Menu
  const menu = container.props.children[1];
  const menuProps = menu.props;
  t.equal(menu.type, Menu);
  t.equal(menuProps.manager, mockManager);
  t.equal(menuProps.closeMenu, container.closeMenu);
  t.equal(menuProps.receiveFocus, false);

  t.end();
});

test('Container methods', t => {
  const mockManager = {
    focusTrigger: sinon.spy(),
    currentFocus: 0,
    items: [1, 2],
  };
  const mockMenu = (
    <ul>
      <li>foo</li>
      <li>bar</li>
    </ul>
  );

  const handleSelectionFunc = sinon.spy();

  const container = ReactTestUtils.renderIntoDocument(
    <Container
      manager={mockManager}
      handleSelection={handleSelectionFunc}
      menu={mockMenu}
      closeOnSelection={true}
    >
      bar
    </Container>
  );
  container.setState = sinon.spy();

  t.ok(mockManager.selectionHandler);

  container.openMenu();
  t.ok(container.setState.calledOnce);
  t.ok(container.setState.calledWith({
    showingMenu: true,
    openingMenuReceivesFocus: false,
  }));
  container.setState.reset();

  container.openMenu(true);
  t.ok(container.setState.calledOnce);
  t.ok(container.setState.calledWith({
    showingMenu: true,
    openingMenuReceivesFocus: true,
  }));
  container.setState.reset();

  container.closeMenu();
  t.ok(container.setState.calledOnce);
  t.ok(container.setState.calledWith({
    showingMenu: false,
    openingMenuReceivesFocus: false,
  }));
  // Doesn't work because needs setState to finish ...
  // t.ok(mockManager.focusTrigger.calledOnce);
  // t.ok(mockManager.currentFocus, -1);
  container.setState.reset();

  container.handleSelection('foo');
  // Close menu was called
  t.ok(container.setState.calledOnce);
  t.ok(container.setState.calledWith({
    showingMenu: false,
    openingMenuReceivesFocus: false,
  }));
  // Selection handler was called
  t.ok(handleSelectionFunc.calledOnce);
  t.ok(handleSelectionFunc.calledWith('foo'));

  t.end();
});
