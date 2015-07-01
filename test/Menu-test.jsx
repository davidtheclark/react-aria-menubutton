import test from 'tape';
import sinon from 'sinon';
import React from 'react/addons';
import Menu from '../src/Menu';

const ReactTestUtils = React.addons.TestUtils;

const shallowRenderer = ReactTestUtils.createRenderer();

test('Menu basic markup', t => {
  shallowRenderer.render(
    <Menu
      manager={{}}
      close={() => {}}
    >
      <ul>
        <li>foo</li>
        <li>bar</li>
      </ul>
    </Menu>
  );
  const rendered = shallowRenderer.getRenderOutput();
  t.deepEqual(rendered, (
    <div
      onKeyDown={rendered.props.onKeyDown}
      role='menu'
    >
      <ul>
        <li>foo</li>
        <li>bar</li>
      </ul>
    </div>
  ));
  t.end();
});

test('Menu mockManager and keydown', t => {
  const mockManager = {
    moveFocusUp: sinon.spy(),
    moveFocusDown: sinon.spy(),
    moveToLetter: sinon.spy(),
    currentFocus: 0,
    items: [1, 2],
  };

  const closeFunc = sinon.spy();

  const rendered = ReactTestUtils.renderIntoDocument(
    <Menu
      manager={mockManager}
      value='bar'
      close={closeFunc}
    >
      <div>foo</div>
    </Menu>
  );

  ReactTestUtils.Simulate.keyDown(React.findDOMNode(rendered), { key: 'ArrowDown'});
  t.ok(mockManager.moveFocusDown.calledOnce);

  ReactTestUtils.Simulate.keyDown(React.findDOMNode(rendered), { key: 'ArrowUp'});
  t.ok(mockManager.moveFocusUp.calledOnce);

  ReactTestUtils.Simulate.keyDown(React.findDOMNode(rendered), { keyCode: 65 });
  t.ok(mockManager.moveToLetter.calledOnce);
  t.ok(mockManager.moveToLetter.calledWith('A'));

  ReactTestUtils.Simulate.keyDown(React.findDOMNode(rendered), { keyCode: 64 });
  t.ok(mockManager.moveToLetter.calledOnce);

  ReactTestUtils.Simulate.keyDown(React.findDOMNode(rendered), { key: 'Escape'});
  t.ok(closeFunc.calledOnce);

  t.end();
});
