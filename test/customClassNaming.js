import React from 'react/addons';
import test from 'tape';
import * as u from './util';
import createAriaMenuButton from '../src/createAriaMenuButton';
import cssClassnamer from '../src/cssClassnamer';

const TestUtils = React.addons.TestUtils;

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


test('custom class namespace', t => {
  const OpenCustomNamedAriaMenuButton = createAriaMenuButton({ namespace: 'foo' });
  const Component = React.createElement(OpenCustomNamedAriaMenuButton, {
    id: 'foo',
    triggerContent: 'FooBar',
    handleSelection: noop,
    items: testItems,
    startOpen: true
  });

  u.render(Component, function() {
    t.throws(() => TestUtils.findRenderedDOMComponentWithClass(this, 'AriaMenuButton'),
      'does not find default componentName');
    t.doesNotThrow(() => TestUtils.findRenderedDOMComponentWithClass(this, 'foo-AriaMenuButton'),
      'finds the namespaced component');
    t.equal(TestUtils.scryRenderedDOMComponentsWithClass(this, 'AriaMenuButton-menuItem').length, 0,
      'does not find default menuItem');
    t.equal(
      TestUtils.scryRenderedDOMComponentsWithClass(this, 'foo-AriaMenuButton-menuItem').length, 3,
      'finds the namespaced menuItem');
    t.throws(() => TestUtils.findRenderedDOMComponentWithClass(this, 'is-open'),
      'does not find default state class');
    t.doesNotThrow(() => TestUtils.findRenderedDOMComponentWithClass(this, 'foo-is-open'),
      'finds the namespaced state class');
    // reset the classnamer
    cssClassnamer.init();
    t.end();
  });
});

test('custom componentName', t => {
  const OpenCustomNamedAriaMenuButton = createAriaMenuButton({ componentName: 'Foo' });
  const Component = React.createElement(OpenCustomNamedAriaMenuButton, {
    id: 'foo',
    triggerContent: 'FooBar',
    handleSelection: noop,
    items: testItems,
    startOpen: true
  });

  u.render(Component, function() {
    t.throws(() => TestUtils.findRenderedDOMComponentWithClass(this, 'AriaMenuButton'),
      'does not find default componentName');
    t.doesNotThrow(() => TestUtils.findRenderedDOMComponentWithClass(this, 'Foo'),
      'finds the custom componentName');
    t.equal(TestUtils.scryRenderedDOMComponentsWithClass(this, 'AriaMenuButton-menuItem').length, 0,
      'does not find default menuItem');
    t.equal(
      TestUtils.scryRenderedDOMComponentsWithClass(this, 'Foo-menuItem').length, 3,
      'finds the custom menuItem');
    t.doesNotThrow(() => TestUtils.findRenderedDOMComponentWithClass(this, 'is-open'),
      'finds the default state class');
    // reset the classnamer
    cssClassnamer.init();
    t.end();
  });
});

test('custom componentName and namespace', t => {
  const OpenCustomNamedAriaMenuButton = createAriaMenuButton({ componentName: 'Foo', namespace: 'bar' });
  const Component = React.createElement(OpenCustomNamedAriaMenuButton, {
    id: 'foo',
    triggerContent: 'FooBar',
    handleSelection: noop,
    items: testItems,
    startOpen: true
  });

  u.render(Component, function() {
    t.throws(() => TestUtils.findRenderedDOMComponentWithClass(this, 'AriaMenuButton'),
      'does not find default componentName');
    t.doesNotThrow(() => TestUtils.findRenderedDOMComponentWithClass(this, 'bar-Foo'),
      'finds the custom & namespaced componentName');
    t.equal(TestUtils.scryRenderedDOMComponentsWithClass(this, 'AriaMenuButton-menuItem').length, 0,
      'does not find default menuItem');
    t.throws(() => TestUtils.findRenderedDOMComponentWithClass(this, 'is-open'),
      'does not find default state class');
    t.doesNotThrow(() => TestUtils.findRenderedDOMComponentWithClass(this, 'bar-is-open'),
      'finds the namespaced state class');
    // reset the classnamer
    cssClassnamer.init();
    t.end();
  });
});

function noop() {}
