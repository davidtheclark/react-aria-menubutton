import test from 'tape';
import React from 'react/addons';
import ariaMenuButton from '../src/ariaMenuButton';
import Button from '../src/Button';
import Menu from '../src/Menu';
import MenuItem from '../src/MenuItem';
import Manager from '../src/Manager';
import ReactTestUtils from "react-test-utils";

test('Wrapped Button component', t => {
  const shallowRenderer = ReactTestUtils.createRenderer();
  const amb = ariaMenuButton();
  const ambButtonElement = React.createElement(amb.Button, {
    foo: 1,
    bar: 2,
    children: 'baz',
  });
  shallowRenderer.render(ambButtonElement);
  const rendered = shallowRenderer.getRenderOutput();

  t.equal(rendered.type, Button);
  t.equal(rendered.props.foo, 1);
  t.equal(rendered.props.bar, 2);
  t.equal(rendered.props.children, 'baz');
  t.ok(rendered.props.manager instanceof Manager);

  t.doesNotThrow(() => {
    React.renderToString(React.createElement(amb.Button, {}, 'foo'));
  });

  t.end();
});

test('Wrapped Menu component', t => {
  const shallowRenderer = ReactTestUtils.createRenderer();
  const amb = ariaMenuButton();
  const child = React.createElement('div', {}, 'foo');
  const ambMenuElement = React.createElement(amb.Menu, {
    foo: 1,
    bar: 2,
    children: child,
  });
  shallowRenderer.render(ambMenuElement);
  const rendered = shallowRenderer.getRenderOutput();

  t.equal(rendered.type, Menu);
  t.equal(rendered.props.foo, 1);
  t.equal(rendered.props.bar, 2);
  t.equal(rendered.props.children, child);
  t.ok(rendered.props.manager instanceof Manager);

  t.doesNotThrow(() => {
    React.renderToString(React.createElement(amb.Menu, {}, React.DOM.div('foo')));
  });

  t.end();
});

test('Wrapped MenuItem component', t => {
  const shallowRenderer = ReactTestUtils.createRenderer();
  const amb = ariaMenuButton();
  const child = React.createElement('div', {}, 'foo');
  const ambMenuItemElement = React.createElement(amb.MenuItem, {
    foo: 1,
    bar: 2,
    children: child,
  });
  shallowRenderer.render(ambMenuItemElement);
  const rendered = shallowRenderer.getRenderOutput();

  t.equal(rendered.type, MenuItem);
  t.equal(rendered.props.foo, 1);
  t.equal(rendered.props.bar, 2);
  t.equal(rendered.props.children, child);
  t.ok(rendered.props.manager instanceof Manager);

  t.doesNotThrow(() => {
    React.renderToString(React.createElement(amb.MenuItem, {}, 'foo'));
  });

  t.end();
});
