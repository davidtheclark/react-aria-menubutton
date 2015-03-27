// Real-life blurring will occur based on clicking or tab-pressing;
// but these events cannot be simulated. So instead we're just
// making sure the blur handler works as expected, hoping the blur
// event fires based on real interactions as we'd expect.

import React from 'react/addons';
import classNames from 'classnames';
import test from 'tape';
import * as u from './util';
import createAriaMenuButton from '..';

const AriaMenuButton = createAriaMenuButton(React, classNames);
const { Simulate } = React.addons.TestUtils;

var testItems = [{
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

const BaseComponent = React.createElement(AriaMenuButton, {
  id: 'foo',
  triggerLabel: 'FooBar',
  handleSelection: noop,
  items: testItems
});

test('simulated blur event', t => {
  u.render(BaseComponent, function() {
    // Open with Enter (tested elsewhere)
    const triggerNode = u.getTriggerNode(this);
    Simulate.keyDown(triggerNode, { key: 'Enter' });
    Simulate.blur(triggerNode);
    setTimeout(() => {
      t.notOk(u.menuIsOpen(this), 'menu closed when trigger blurred');
      t.end();
    }, 0);
  });
});

function noop() {}
