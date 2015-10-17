import test from 'tape';
import sinon from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import ReactTestUtils from 'react-addons-test-utils';
import MockWrapper from './MockWrapper';
import Button from '../src/Button';

function mockManager() {
  return {
    isOpen: false,
    toggleMenu: sinon.spy(),
    moveFocusDown: sinon.spy(),
    openMenu: sinon.spy(),
    handleMenuKey: sinon.spy(),
    handleKeyDown: sinon.spy(),
    handleClick: sinon.spy(),
  };
}

function mockKeyEvent(key, keyCode) {
  return { key, keyCode, preventDefault: sinon.spy() };
}

test('Button DOM with only required props and text child', t => {
  const renderedWrapper = ReactTestUtils.renderIntoDocument(
    <MockWrapper mockManager={mockManager()}>
      <Button>
        foo
      </Button>
    </MockWrapper>
  );
  const renderedButton = ReactTestUtils.findRenderedComponentWithType(renderedWrapper, Button);
  const renderedButtonNode = ReactDOM.findDOMNode(renderedButton);

  t.equal(renderedWrapper.manager.button, renderedButton);

  // DOM
  t.equal(renderedButtonNode.tagName.toLowerCase(), 'span');
  t.notOk(renderedButtonNode.getAttribute('id'));
  t.notOk(renderedButtonNode.getAttribute('class'));
  t.notOk(renderedButtonNode.getAttribute('style'));
  t.equal(renderedButtonNode.getAttribute('role'), 'button');
  t.equal(renderedButtonNode.getAttribute('tabindex'), '0');
  t.equal(renderedButtonNode.getAttribute('aria-haspopup'), 'true');
  t.equal(renderedButtonNode.getAttribute('aria-expanded'), 'false');
  t.equal(renderedButtonNode.children.length, 0);
  t.equal(renderedButtonNode.textContent, 'foo');

  t.end();
});

test('Button DOM with all possible props and element child', t => {
  const renderedWrapper = ReactTestUtils.renderIntoDocument(
    <MockWrapper mockManager={mockManager()}>
      <Button
        id='foo'
        className='bar'
        style={{ top: 2 }}
        tag='button'
      >
        <span>
          hooha
        </span>
      </Button>
    </MockWrapper>
  );
  const renderedButton = ReactTestUtils.findRenderedComponentWithType(renderedWrapper, Button);
  const renderedButtonNode = ReactDOM.findDOMNode(renderedButton);

  t.equal(renderedWrapper.manager.button, renderedButton);

  // DOM
  t.equal(renderedButtonNode.tagName.toLowerCase(), 'button');
  t.equal(renderedButtonNode.getAttribute('id'), 'foo');
  t.equal(renderedButtonNode.getAttribute('class'), 'bar');
  t.equal(renderedButtonNode.getAttribute('style').replace(/[ ;]/g, ''), 'top:2px');
  t.equal(renderedButtonNode.getAttribute('role'), 'button');
  t.equal(renderedButtonNode.getAttribute('tabindex'), '0');
  t.equal(renderedButtonNode.getAttribute('aria-haspopup'), 'true');
  t.equal(renderedButtonNode.getAttribute('aria-expanded'), 'false');
  t.equal(renderedButtonNode.children.length, 1);
  t.equal(renderedButtonNode.children[0].tagName.toLowerCase(), 'span');
  t.equal(renderedButtonNode.textContent, 'hooha');

  t.end();
});

test('Button click', t => {
  const renderedWrapper = ReactTestUtils.renderIntoDocument(
    <MockWrapper mockManager={mockManager()}>
      <Button>
        foo
      </Button>
    </MockWrapper>
  );
  const renderedButton = ReactTestUtils.findRenderedComponentWithType(renderedWrapper, Button);
  const renderedButtonNode = ReactDOM.findDOMNode(renderedButton);

  ReactTestUtils.Simulate.click(renderedButtonNode);
  t.ok(renderedWrapper.manager.toggleMenu.calledOnce);

  t.end();
});

test('Button keyDown', t => {
  const renderedWrapper = ReactTestUtils.renderIntoDocument(
    <MockWrapper mockManager={mockManager()}>
      <Button>
        foo
      </Button>
    </MockWrapper>
  );
  const renderedButton = ReactTestUtils.findRenderedComponentWithType(renderedWrapper, Button);
  const renderedButtonNode = ReactDOM.findDOMNode(renderedButton);
  const { manager } = renderedWrapper;
  const downEvent = mockKeyEvent('ArrowDown');
  const enterEvent = mockKeyEvent('Enter');
  const spaceEvent = mockKeyEvent(' ');
  const escapeEvent = mockKeyEvent('Escape');
  const fEvent = mockKeyEvent(null, 70);

  ReactTestUtils.Simulate.keyDown(renderedButtonNode, downEvent);
  t.ok(downEvent.preventDefault.calledOnce);
  t.ok(manager.openMenu.calledOnce);
  t.deepEqual(manager.openMenu.getCall(0).args, [{ focusMenu: true }]);

  manager.isOpen = true;
  ReactTestUtils.Simulate.keyDown(renderedButtonNode, downEvent);
  t.ok(downEvent.preventDefault.calledTwice);
  t.ok(manager.openMenu.calledOnce);
  t.ok(manager.moveFocusDown.calledOnce);

  ReactTestUtils.Simulate.keyDown(renderedButtonNode, enterEvent);
  t.ok(enterEvent.preventDefault.calledOnce);
  t.ok(manager.toggleMenu.calledOnce);

  ReactTestUtils.Simulate.keyDown(renderedButtonNode, spaceEvent);
  t.ok(spaceEvent.preventDefault.calledOnce);
  t.ok(manager.toggleMenu.calledTwice);

  ReactTestUtils.Simulate.keyDown(renderedButtonNode, escapeEvent);
  t.notOk(escapeEvent.preventDefault.called);
  t.ok(manager.handleMenuKey.calledOnce);
  t.equal(manager.handleMenuKey.getCall(0).args[0].key, 'Escape');

  ReactTestUtils.Simulate.keyDown(renderedButtonNode, fEvent);
  t.notOk(fEvent.preventDefault.called);
  t.ok(manager.handleMenuKey.calledTwice);
  t.equal(manager.handleMenuKey.getCall(1).args[0].keyCode, 70);

  t.end();
});

test('Button rendered via renderToString', t => {
  t.doesNotThrow(() => {
    ReactDOMServer.renderToString(
      <MockWrapper mockManager={mockManager()}>
        <Button>
          foo
        </Button>
      </MockWrapper>
    );
  });

  t.end();
});
