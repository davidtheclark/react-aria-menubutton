import React from 'react/addons';
import classNames from 'classnames';
import test from 'tape';
import sinon from 'sinon';
import * as u from './util';
import createAriaMenuButton from '..';

const AriaMenuButton = createAriaMenuButton(React, classNames);
const { Simulate } = React.addons.TestUtils;

const testItems = [{
  id: 'foo',
  content: 'Foo',
  value: 0
}, {
  id: 'bar',
  content: 'Bar',
  value: 1
}, {
  id: 'baz',
  content: 'Baz',
  value: 2
}];

test('when trigger is clicked', t => {
  const Component = React.createElement(AriaMenuButton, {
    id: 'foo',
    triggerLabel: 'FooBar',
    handleSelection: noop,
    items: testItems
  });

  u.render(Component, function() {
    const trigger = u.getTriggerNode(this);
    clickNode(trigger);
    t.ok(u.menuIsOpen(this), 'first open');
    clickNode(trigger);
    t.notOk(u.menuIsOpen(this), 'then closes');
    clickNode(trigger);
    t.ok(u.menuIsOpen(this), 'then opens again');
    t.end();
  });
});

test('when menuItem is clicked', t => {
  const spy = sinon.spy();
  const OpenSpyComponent = React.createElement(AriaMenuButton, {
    id: 'foo',
    triggerLabel: 'FooBar',
    handleSelection: spy,
    items: testItems,
    isOpen: true
  });

  u.render(OpenSpyComponent, function() {
    u.eachMenuItemNode(this, (n, i) => {
      clickNode(n);
      t.ok(spy.calledWith(testItems[i].value),
        'menuItem ' + i + ' selected');
      t.ok(u.menuIsOpen(this), 'menu is still open');
      spy.reset();
    });
    t.end();
  });
});

test('when menuItem is clicked if closeOnSelection is true', t => {
  const OpenComponentThatCloses = React.createElement(AriaMenuButton, {
    id: 'foo',
    triggerLabel: 'FooBar',
    handleSelection: noop,
    items: testItems,
    isOpen: true,
    closeOnSelection: true
  });

  u.render(OpenComponentThatCloses, function() {
    clickNode(u.getMenuItemNodes(this)[0]);
    t.notOk(u.menuIsOpen(this), 'menu closed');
    t.end();
  });
});

function clickNode(n) {
  Simulate.click(n);
}

function noop() {}
