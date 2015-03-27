import React from 'react/addons';
import classNames from 'classnames';
import test from 'tape';
import * as u from './util';
import createAriaMenuButton from '..';

const AriaMenuButton = createAriaMenuButton(React, classNames);

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

test('closed rendering', t => {
  const Component = React.createElement(AriaMenuButton, {
    id: 'foo',
    triggerLabel: 'FooBar',
    handleSelection: noop,
    items: testItems
  });

  u.render(Component, function() {
    const c = this;

    t.test('container', st => {
      const containerNode = u.getContainerNode(c);
      st.equal(containerNode.id, 'foo', 'id');
      st.end();
    });

    t.test('trigger', st => {
      const triggerNode = u.getTriggerNode(c);
      st.equal(triggerNode.id, 'foo-trigger', 'id');
      st.notOk(u.classListContains(triggerNode, 'is-open'), 'correct classes');
      st.equal(triggerNode.textContent, 'FooBar', 'content');
      // "The menu button has an aria-haspopup property, set to true."
      st.ok(triggerNode.getAttribute('aria-haspopup'), 'aria-haspopup');
      // "The menu button itself has a role of button."
      st.equal(triggerNode.getAttribute('role'), 'button', 'role');
      st.end();
    });

    t.test('menuWrapper', st => {
      const menuWrapperNode = u.getMenuWrapperNode(c);
      st.notOk(u.classListContains(menuWrapperNode, 'AriaMenuButton-menuWrapper--trans'), 'correct classes');
      st.end();
    });

    t.test('menu', st=> {
      st.throws(() => u.getMenu(c), 'does not render');
      st.end();
    });

    t.end();
  });
});

test('closed render with transition', t => {
  const Component = React.createElement(AriaMenuButton, {
    id: 'foo',
    triggerLabel: 'FooBar',
    handleSelection: noop,
    items: testItems,
    transition: true
  });

  u.render(Component, function() {
    const c = this;
    t.test('menuWrapper', st => {
      const menuWrapperNode = u.getMenuWrapperNode(c);
      st.ok(u.classListContains(menuWrapperNode, 'AriaMenuButton-menuWrapper--trans'), 'correct classes');
      st.end();
    });
    t.end();
  });
});

test('basic open rendering', t => {
  const Component = React.createElement(AriaMenuButton, {
    id: 'foo',
    triggerLabel: 'FooBar',
    handleSelection: noop,
    items: testItems,
    isOpen: true
  });

  u.render(Component, function() {
    const c = this;

    t.test('trigger', st => {
      const triggerNode = u.getTriggerNode(c);
      st.ok(u.classListContains(triggerNode, 'is-open'), 'correct classes');
      st.end();
    });

    t.test('menu', st => {
      const menuNode = u.getMenuNode(c);
      // "The container may have a role of menu or menubar depending on your implementation."
      st.equal(menuNode.getAttribute('role'), 'menu', 'role');
      st.notOk(u.classListContains(menuNode, 'AriaMenuButton-menu--flushRight'), 'correct classes');
      st.end();
    });

    t.test('menuItems', st => {
      let count = 0;
      u.eachMenuItemNode(c, (n, i) => {
        count++;
        st.equal(n.id, testItems[i].id, 'id');
        st.equal(n.textContent, testItems[i].content, 'content');
        st.equal(String(n.getAttribute('data-value')), String(testItems[i].value), 'data-value');
        // "The menu contains elements with roles: menuitem, menuitemcheckbox, or menuitemradio
        // depending on your implementation."
        st.equal(n.getAttribute('role'), 'menuitem', 'role');
      });
      st.equal(count, 3, 'number of items');
      st.end();
    });

    t.end();
  });
});

test('open rendering flushRight', t => {
  const Component = React.createElement(AriaMenuButton, {
    id: 'foo',
    triggerLabel: 'FooBar',
    handleSelection: noop,
    items: testItems,
    isOpen: true,
    flushRight: true
  });

  u.render(Component, function() {
    const c = this;
    t.test('menu', st => {
      const menuNode = u.getMenuNode(c);
      st.ok(u.classListContains(menuNode, 'AriaMenuButton-menu--flushRight'), 'correct classes');
      st.end();
    });
    t.end();
  });
});

test('open rendering with selectedValue', t => {
  const Component = React.createElement(AriaMenuButton, {
    id: 'foo',
    triggerLabel: 'FooBar',
    handleSelection: noop,
    items: testItems,
    isOpen: true,
    selectedValue: 0
  });

  u.render(Component, function() {
    const c = this;
    t.test('menuItems', st => {
      let count = 0;
      u.getMenuItems(c).forEach(item => {
        const n = React.findDOMNode(item);
        if (item.props['data-value'] !== 0) {
          st.notOk(u.classListContains(n, 'is-selected', 'correct classes'));
          return;
        }
        count++;
        st.ok(u.classListContains(n, 'is-selected', 'correct classes'));
      });
      st.end();
    });
    t.end();
  });
});

function noop() {}
