import test from 'tape';
import sinon from 'sinon';
import React from 'react/addons';
import MenuItem from '../src/MenuItem';

const ReactTestUtils = React.addons.TestUtils;

const shallowRenderer = ReactTestUtils.createRenderer();

test('MenuItem basic markup', t => {
  shallowRenderer.render(
    <MenuItem manager={{}}>
      foo
    </MenuItem>
  );
  const rendered = shallowRenderer.getRenderOutput();
  t.deepEqual(rendered, (
    <div
      onClick={rendered.props.onClick}
      onKeyDown={rendered.props.onKeyDown}
      role='menuitem'
      tabIndex='-1'
    >
      foo
    </div>
  ));
  t.end();
});

test('MenuItem element child with tag prop, text, and value', t => {
  shallowRenderer.render(
    <MenuItem
      manager={{}}
      tag='section'
      text='heehah'
      value='googoo'
    >
      <div id='foo'>
        <span>bar</span>
      </div>
    </MenuItem>
  );
  const rendered = shallowRenderer.getRenderOutput();
  t.deepEqual(rendered, (
    <section
      onClick={rendered.props.onClick}
      onKeyDown={rendered.props.onKeyDown}
      role='menuitem'
      tabIndex='-1'
    >
    <div id='foo'>
      <span>bar</span>
    </div>
    </section>
  ));
  t.end();
});

test('MenuItem mockManager and click', t => {
  const mockManager = {
    selectionHandler: sinon.spy(),
    currentFocus: 0,
    items: [1, 2],
  };
  const rendered = ReactTestUtils.renderIntoDocument(
    <MenuItem
      manager={mockManager}
      value='bar'
    >
      foo
    </MenuItem>
  );
  t.deepEqual(mockManager.items, [
    1, 2, rendered.itemForManager,
  ]);
  ReactTestUtils.Simulate.click(React.findDOMNode(rendered));
  t.ok(mockManager.selectionHandler.calledOnce);
  t.ok(mockManager.selectionHandler.calledWith('bar'));
  t.end();
});

test('MenuItem ENTER and SPACE', t => {
  const mockManager = {
    selectionHandler: sinon.spy(),
    currentFocus: 0,
    items: [1, 2],
  };
  const rendered = ReactTestUtils.renderIntoDocument(
    <MenuItem
      manager={mockManager}
      value='bar'
    >
      foo
    </MenuItem>
  );
  ReactTestUtils.Simulate.keyDown(React.findDOMNode(rendered), { key: 'Enter'});
  ReactTestUtils.Simulate.keyDown(React.findDOMNode(rendered), { key: ' '});
  t.ok(mockManager.selectionHandler.calledTwice);
  t.ok(mockManager.selectionHandler.alwaysCalledWith('bar'));
  t.end();
});
