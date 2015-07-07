import test from 'tape';
import sinon from 'sinon';
import React from 'react/addons';
import Trigger from '../src/Trigger';

const ReactTestUtils = React.addons.TestUtils;


test('Trigger markup', t => {
  const shallowRenderer = ReactTestUtils.createRenderer();
  shallowRenderer.render(
    <Trigger
      manager={{}}
      openMenu={() => {}}
      toggleMenu={() => {}}
    >
      <div id='foo'>
        <span>bar</span>
      </div>
    </Trigger>
  );
  const rendered = shallowRenderer.getRenderOutput();
  t.deepEqual(rendered, (
    <span
      role='button'
      tabIndex='0'
      aria-haspopup={true}
      aria-expanded={undefined}
      onKeyDown={rendered.props.onKeyDown}
      onClick={rendered.props.onClick}
    >
      <div id='foo'>
        <span>bar</span>
      </div>
    </span>
  ));
  t.end();
});

test('Trigger mockManager with click and keydown', t => {
  const mockManager = {
    moveFocusDown: sinon.spy(),
    currentFocus: 0,
    items: [1, 2],
  };

  const openMenuFunc = sinon.spy();
  const toggleMenuFunc = sinon.spy();

  const rendered = ReactTestUtils.renderIntoDocument(
    <Trigger
      manager={mockManager}
      openMenu={openMenuFunc}
      toggleMenu={toggleMenuFunc}
      menuIsOpen={false}
    >
      foo
    </Trigger>
  );

  t.equal(mockManager.trigger, React.findDOMNode(rendered));

  ReactTestUtils.Simulate.keyDown(React.findDOMNode(rendered), { key: 'Enter'});
  t.ok(toggleMenuFunc.calledOnce);
  toggleMenuFunc.reset();

  ReactTestUtils.Simulate.keyDown(React.findDOMNode(rendered), { key: ' '});
  t.ok(toggleMenuFunc.calledOnce);
  toggleMenuFunc.reset();

  ReactTestUtils.Simulate.click(React.findDOMNode(rendered));
  t.ok(toggleMenuFunc.calledOnce);
  toggleMenuFunc.reset();

  ReactTestUtils.Simulate.keyDown(React.findDOMNode(rendered), { key: 'ArrowDown'});
  t.ok(openMenuFunc.calledOnce);

  const renderedOpen = ReactTestUtils.renderIntoDocument(
    <Trigger
      manager={mockManager}
      openMenu={openMenuFunc}
      toggleMenu={toggleMenuFunc}
      menuIsOpen={true}
    >
      foo
    </Trigger>
  );

  ReactTestUtils.Simulate.keyDown(React.findDOMNode(renderedOpen), { key: 'ArrowDown'});
  t.ok(mockManager.moveFocusDown.calledOnce);

  t.end();
});
