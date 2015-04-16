import React from 'react/addons';
import test from 'tape';
import sinon from 'sinon';
import * as u from './util';
import createAriaMenuButton from '..';

const AriaMenuButton = createAriaMenuButton(React);
const { Simulate } = React.addons.TestUtils;

var testItems = [{
  content: 'Foo',
  value: 0
}, {
  content: 'Bar',
  value: 1
}, {
  content: 'Baz',
  value: 2
}];

const BaseComponent = React.createElement(AriaMenuButton, {
  triggerContent: 'FooBar',
  handleSelection: noop,
  items: testItems
});

// codes from http://en.wikipedia.org/wiki/ASCII#ASCII_printable_code_chart
const mockKeyDownEvents = {
  f: {
    key: 'Unidentified',
    keyCode: 70,
    preventDefault: noop
  },
  b: {
    key: 'Unidentified',
    keyCode: 66,
    preventDefault: noop
  },
  a: {
    key: 'Unidentified',
    keyCode: 65,
    preventDefault: noop
  }
};

test('keyDown on trigger', t => {

  // "With focus on the button pressing Space or Enter
  // will toggle the display of the drop-down menu.
  // Focus remains on the button."
  t.test('Enter toggles without moving focus', st => {
    u.render(BaseComponent, function() {
      const triggerNode = u.getTriggerNode(this);
      triggerNode.focus();
      press(triggerNode, 'Enter');
      st.ok(u.menuIsOpen(this), 'initially open');
      st.deepEqual(document.activeElement, triggerNode, 'first Enter');
      press(triggerNode, 'Enter');
      st.notOk(u.menuIsOpen(this), 'then closed');
      st.deepEqual(document.activeElement, triggerNode, 'second Enter');
      press(triggerNode, 'Enter');
      st.ok(u.menuIsOpen(this), 'then open');
      st.deepEqual(document.activeElement, triggerNode, 'third Enter');
      st.end();
    });
  });

  t.test('Space toggles without moving focus', st => {
    u.render(BaseComponent, function() {
      const triggerNode = u.getTriggerNode(this);
      triggerNode.focus();
      press(triggerNode, ' ');
      st.ok(u.menuIsOpen(this), 'initially open');
      st.deepEqual(document.activeElement, triggerNode, 'first Space');
      press(triggerNode, ' ');
      st.notOk(u.menuIsOpen(this), 'then closed');
      st.deepEqual(document.activeElement, triggerNode, 'second Space');
      press(triggerNode, ' ');
      st.ok(u.menuIsOpen(this), 'then open');
      st.deepEqual(document.activeElement, triggerNode, 'third Space');
      st.end();
    });
  });

  // "With focus on the button and no drop-down menu displayed,
  // pressing Down Arrow will open the drop-down menu and
  // move focus into the menu and onto the first menu item."
  t.test('when closed, Down Arrow opens and moves focus to first menuItem', st => {
    u.render(BaseComponent, function() {
      const triggerNode = u.getTriggerNode(this);
      triggerNode.focus();
      press(triggerNode, 'ArrowDown');
      st.ok(u.menuIsOpen(this), 'opened by ArrowDown');
      const firstMenuItemNode = React.findDOMNode(u.getMenuItems(this)[0]);
      st.deepEqual(document.activeElement, firstMenuItemNode, 'focus on first menuItem');
      st.end();
    });
  });

  // "With focus on the button and the drop-down menu open,
  // pressing Down Arrow will move focus into the menu onto
  // the first menu item."
  t.test('when open, Down Arrow moves focus to first menuItem', st => {
    u.render(BaseComponent, function() {
      const triggerNode = u.getTriggerNode(this);
      triggerNode.focus();
      // Open with a Space (tested above)
      press(triggerNode, ' ');
      // Now click ArrowDown
      press(triggerNode, 'ArrowDown');
      st.ok(u.menuIsOpen(this), 'still open');
      const firstMenuItemNode = React.findDOMNode(u.getMenuItems(this)[0]);
      st.deepEqual(document.activeElement, firstMenuItemNode, 'focus on first menuItem');
      st.end();
    });
  });

  // "With focus on the button pressing the Tab key will
  // take the user to the next tab focusable item on the page."
  // *** Cannot automate this test: have to checkout demo! ***

  t.end();
});

test('when key is pressed inside menu', t => {

  // "With focus on the drop-down menu, pressing Escape
  // closes the menu and returns focus to the button."
  t.test('Escape closes', st => {
    u.render(BaseComponent, function() {
      const triggerNode = u.getTriggerNode(this);
      triggerNode.focus();
      // Open with a Down Arrow to move focus to first menuItem (tested above)
      press(triggerNode, 'ArrowDown');
      // Verify that focus is not on trigger
      st.notEqual(document.activeElement, triggerNode);
      // Then press Escape
      press(u.getMenuNode(this), 'Escape');
      st.notOk(u.menuIsOpen(this), 'closed');
      st.deepEqual(document.activeElement, triggerNode, 'focus back on trigger');
      st.end();
    });
  });

  // "With focus on the drop-down menu, the Up and Down Arrow
  // keys move focus within the menu items, "wrapping" at the
  // top and bottom."
  t.test('Down Arrow moves focus down, wrapping', st => {
    u.render(BaseComponent, function() {
      const triggerNode = u.getTriggerNode(this);
      triggerNode.focus();
      // Open with a Down Arrow to move focus to first menuItem (tested above)
      press(triggerNode, 'ArrowDown');
      // Then proceed ...
      const menuItemNodes = u.getMenuItemNodes(this);
      press(menuItemNodes[0], 'ArrowDown');
      st.deepEqual(document.activeElement, menuItemNodes[1],
        'focus down to second menuItem');
      press(menuItemNodes[1], 'ArrowDown');
      st.deepEqual(document.activeElement, menuItemNodes[2],
        'focus down to third menuItem');
      press(menuItemNodes[2], 'ArrowDown');
      st.deepEqual(document.activeElement, menuItemNodes[0],
        'focus back to first menuItem');
      st.end();
    });
  });

  t.test('Up Arrow moves focus up, wrapping', st => {
    u.render(BaseComponent, function() {
      const triggerNode = u.getTriggerNode(this);
      triggerNode.focus();
      // Open with a Down Arrow to move focus to first menuItem (tested above)
      press(triggerNode, 'ArrowDown');
      // Then proceed ...
      const menuItemNodes = u.getMenuItemNodes(this);
      press(menuItemNodes[0], 'ArrowUp');
      st.deepEqual(document.activeElement, menuItemNodes[2],
        'focus up to third menuItem');
      press(menuItemNodes[2], 'ArrowUp');
      st.deepEqual(document.activeElement, menuItemNodes[1],
        'focus up to second menuItem');
      press(menuItemNodes[1], 'ArrowUp');
      st.deepEqual(document.activeElement, menuItemNodes[0],
        'focus up to first menuItem');
      st.end();
    });
  });

  // "Typing a letter (printable character) key moves focus
  // to the next instance of a visible node whose title begins
  // with that printable letter."
  t.test('handles letters', st => {
    u.render(BaseComponent, function() {
      const c = u.getContainer(this);

      const triggerNode = u.getTriggerNode(this);
      triggerNode.focus();
      // Open with a Space, so focus stays on trigger (tested above)
      press(triggerNode, ' ');
      // Then proceed ...
      const menuItemNodes = u.getMenuItemNodes(this);

      // Can't seem to simulate letter keys with TestUtils,
      // so instead will manually trigger the event and provide
      // a mock event object

      // "f" goes Foo
      c.props.onKeyDown(mockKeyDownEvents.f);
      st.deepEqual(document.activeElement, menuItemNodes[0],
        'focus on Foo');
      // "b" goes to Bar
      c.props.onKeyDown(mockKeyDownEvents.b);
      st.deepEqual(document.activeElement, menuItemNodes[1],
        'focus on Bar');
      // another "b" goes to Baz
      c.props.onKeyDown(mockKeyDownEvents.b);
      st.deepEqual(document.activeElement, menuItemNodes[2],
        'focus on Baz');
      // another "f" goes to Foo
      c.props.onKeyDown(mockKeyDownEvents.f);
      st.deepEqual(document.activeElement, menuItemNodes[0],
        'focus on Foo');
      // "a" goes nowhere
      c.props.onKeyDown(mockKeyDownEvents.a);
      st.deepEqual(document.activeElement, menuItemNodes[0],
        'focus on none');
      st.end();
    });
  });

  t.test('handles letters when content is a component', st => {
    class SpecialItem extends React.Component {
      render() {
        return React.DOM.div({ className: 'special'},
          React.DOM.span({ className: 'special-thing'}),
          React.DOM.span(null, this.props.inner)
        );
      }
    }

    const specialItems = [{
      content: React.createElement(SpecialItem, { inner: 'Hoo' }),
      text: 'Foo',
      value: 'Foo'
    }, {
      content: React.createElement(SpecialItem, { inner: 'Poo' }),
      text: 'Bar',
      value: 'Bar'
    }, {
      content: React.createElement(SpecialItem, { inner: 'Too' }),
      text: 'Baz',
      value: 'Baz'
    }];

    const SpecialComponent = React.createElement(AriaMenuButton, {
      triggerContent: 'FooBar',
      handleSelection: noop,
      items: specialItems
    });

    u.render(SpecialComponent, function() {
      const c = u.getContainer(this);

      const triggerNode = u.getTriggerNode(this);
      triggerNode.focus();
      // Open with a Space, so focus stays on trigger (tested above)
      press(triggerNode, ' ');
      // Then proceed ...
      const menuItemNodes = u.getMenuItemNodes(this);

      // Can't seem to simulate letter keys with TestUtils,
      // so instead will manually trigger the event and provide
      // a mock event object

      // "f" goes Foo
      c.props.onKeyDown(mockKeyDownEvents.f);
      st.deepEqual(document.activeElement, menuItemNodes[0],
        'focus on Foo');
      // "b" goes to Bar
      c.props.onKeyDown(mockKeyDownEvents.b);
      st.deepEqual(document.activeElement, menuItemNodes[1],
        'focus on Bar');
      // another "b" goes to Baz
      c.props.onKeyDown(mockKeyDownEvents.b);
      st.deepEqual(document.activeElement, menuItemNodes[2],
        'focus on Baz');
      // another "f" goes to Foo
      c.props.onKeyDown(mockKeyDownEvents.f);
      st.deepEqual(document.activeElement, menuItemNodes[0],
        'focus on Foo');
      // "a" goes nowhere
      c.props.onKeyDown(mockKeyDownEvents.a);
      st.deepEqual(document.activeElement, menuItemNodes[0],
        'focus on none');
      st.end();
    });
  });

  t.test('Enter and Space trigger selection', st => {
    const spy = sinon.spy();
    const SpyComponent = React.createElement(AriaMenuButton, {
      triggerContent: 'FooBar',
      handleSelection: spy,
      items: testItems
    });

    u.render(SpyComponent, function() {
      this.openMenu();
      u.getMenuItemNodes(this).forEach((n, i) => {
        press(n, 'Enter');
        st.ok(spy.calledWith(testItems[i].value), 'Enter worked');
        spy.reset();
        press(n, ' ');
        st.ok(spy.calledWith(testItems[i].value), 'Space worked');
        spy.reset();
        st.ok(u.menuIsOpen(this), 'menu is still open');
      });
      st.end();
    });
  });

  t.test('Enter and Space when closeOnSelection is true', st => {
    st.plan(2);
    const OpenComponentThatCloses = React.createElement(AriaMenuButton, {
      triggerContent: 'FooBar',
      handleSelection: noop,
      items: testItems,
      startOpen: true,
      closeOnSelection: true
    });

    u.render(OpenComponentThatCloses, function() {
      press(u.getMenuItemNodes(this)[0], 'Enter');
      st.notOk(u.menuIsOpen(this), 'menu closed');
    });

    u.render(OpenComponentThatCloses, function() {
      press(u.getMenuItemNodes(this)[0], ' ');
      st.notOk(u.menuIsOpen(this), 'menu closed');
    });
  });

  // "With focus on the drop-down menu, pressing the Tab key
  // will take the user to the next tab focusable item on the page."
  // *** Cannot automate this test: have to checkout demo! ***

  t.end();
});

function press(node, key) {
  Simulate.keyDown(node, { key: key });
}

function noop() {}
