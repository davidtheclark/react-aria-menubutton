# react-aria-menubutton [![Build Status](https://travis-ci.org/davidtheclark/react-aria-menubutton.svg?branch=master)](https://travis-ci.org/davidtheclark/react-aria-menubutton)

A React component (set of components, really) that will help you build accessible menu buttons by providing keyboard interactions and ARIA attributes aligned with [the WAI-ARIA Menu Button Design Pattern](http://www.w3.org/TR/wai-aria-practices/#menubutton).

Please check out [the demo](http://davidtheclark.github.io/react-aria-menubutton/demo/).

## Upgrading from 2.x.x to 3.x.x

There are two big differences between these releases:
- 3.x.x depends on React 0.14 (and its new counterpart ReactDOM)
- In 3.x.x, you do not need to use the `ariaMenuButton()` factory function to create a set of components. Instead, you make sure to wrap the `Button`, `Menu`, and `MenuItem` components in a `Wrapper` component: that `Wrapper` will group them and organize the interactions (via [React's `context` API](https://facebook.github.io/react/docs/context.html)). The documentation below explains this new way of doing things.

Please file an issue if anything is unclear or doesn't work as expected.

## Project Goals

- Full accessibility
- Maximum Flexibility
- Absolutely minimal styling
- Thorough testing

**If you like this kind of module (accessible, flexible, unstyled) you should also check out these projects:**
- [react-aria-modal](https://github.com/davidtheclark/react-aria-modal)
- [react-aria-tabpanel](https://github.com/davidtheclark/react-aria-tabpanel)

### Accessibility

The project started as an effort to build a React component that follows every detail of [the WAI-ARIA Menu Button Design Pattern](http://www.w3.org/TR/wai-aria-practices/#menubutton) for **maximum accessibility**.

Just hiding and showing a menu is easy; but the required **keyboard interactions** are kind of tricky, the required **ARIA attributes** are easy to forget, and some other aspects of opening and closing the menu based on behaviors, and managing focus, proved less than pleasant.
So I decided to try to abstract the component enough that it would be **worth sharing with others**.

You can read about [the keyboard interactions and ARIA attributes](http://www.w3.org/TR/wai-aria-practices/#menubutton) of the Design Pattern. [The demo](http://davidtheclark.github.io/react-aria-menubutton/demo/) also lists all of the interactions that are built into this module.

*If you think that this component does not satisfy the spec or if you know of other ways to make it even more accessible, please file an issue.*

### Flexibility and minimal styling

Instead of providing a pre-fabricated, fully styled widget, this module's goal is to provide a set of components that others can build their own stuff on top of.

It does not provide any classes or a stylesheet that you'll have to figure out how to include; and it does not include inline styles that would be hard to override. It **only provides "smart" components to wrap your (dumb, styled) components**. The *library's* components take care of keyboard interaction and ARIA attributes, while *your* components just do whatever you want your components to do.

## Installation

```
npm install react-aria-menubutton
```

There are dependencies: react 0.14.x, react-dom 0.14.x, and [teeny-tap](https://github.com/davidtheclark/teeny-tap).

teeny-tap is very small and included in the builds (React is not).
It is included only to accurately detect "taps" (mouse click and touch taps) outside an open
menu that should close it — which is important enough that it's worth doing right.

Versions <3.0 are compatible with React 0.13.x.

## Tested Browser Support

Basically IE9+. See `.zuul.yml` for more details.

Automated testing is done with [zuul](https://github.com/defunctzombie/zuul) and [Open Suace](https://saucelabs.com/opensauce/).

## Usage

There are two ways to consume this module:
- with CommonJS
- as a global UMD library

Using CommonJS, for example, you can simply `require()` the module to get the AriaMenuButton object, which contains all the components you'll need:

```js
var AriaMenuButton = require('react-aria-menubutton');

// Now use AriaMenuButton.Wrapper, AriaMenuButton.Button,
// AriaMenuButton.Menu, and AriaMenuButton.MenuItem ...
```

Using globals/UMD, you must do the following:
- Expose React and ReactDOM globally
- Use one of the builds in the `dist/` directory

```html
<script src="react.min.js"></script>
<script src="react-dom.min.js"></script>
<script src="node_modules/react-aria-menu-button/dist/AriaMenuButton.min.js"></script>
<script>
  // Now use AriaMenuButton.Wrapper, AriaMenuButton.Button,
  // AriaMenuButton.Menu, and AriaMenuButton.MenuItem ...
</script>
```

**You *get to* (have to) write your own CSS, your own way, based on your own components.**

## Examples

For details about why the examples work, read the API documentation below.

You can also see more examples by looking in `demo/`.

```js
// Very simple ES6 example

import React from 'react';
import { Wrapper, Button, Menu, MenuItem } from 'react-aria-menubutton';

const menuItemWords = ['foo', 'bar', 'baz'];

class MyMenuButton extends React.Component {
  render() {
    const menuItems = menuItemWords.map((word, i) => {
      return (
        <li key={i}>
          <AriaMenuButton.MenuItem className='MyMenuButton-menuItem'>
            {word}
          </AriaMenuButton.MenuItem>
        </li>
      );
    });

    return (
      <AriaMenuButton.Wrapper
        className='MyMenuButton'
        onSelection={handleSelection}
      >
        <AriaMenuButton.Button className='MyMenuButton-button'>
          click me
        </AriaMenuButton.Button>
        <AriaMenuButton.Menu className='MyMenuButton-menu'>
          <ul>{menuItems}</ul>
        </AriaMenuButton.Menu>
      </AriaMenuButton.Wrapper>
    );
  }
}

function handleSelection(value, event) { .. }
```

```js
// Slightly more complex, ES5 example:
// - MenuItems have hidden values that are passed
//   to the selection handler
// - User can navigate the MenuItems by typing the
//   first letter of a person's name, even though
//   each MenuItem's child is not simple text
// - Menu has a function for a child
// - React's CSSTransitionGroup is used for open-close animation

var React = require('react');
var CSSTransitionGroup = require('react-addons-css-transition-group');
var AriaMenuButton = require('react-aria-menubutton');
var AmbWrapper = AriaMenuButton.Wrapper;
var AmbButton = AriaMenuButton.Button;
var AmbMenu = AriaMenuButton.Menu;
var AmbMenuItem = AriaMenuButton.MenuItem;

var people = [{
  name: 'Charles Choo-Choo',
  id: 1242
}, {
  name: 'Mina Meowmers',
  id: 8372
}, {
  name: 'Susan Sailor',
  id: 2435
}];

var MyMenuButton = React.createClass({
  render: function() {
    var peopleMenuItems = people.map(function(person, i) {
      return (
        <AmbMenuItem
          key={i}
          tag='li'
          value={person.id}
          text={person.name}
          className='PeopleMenu-person'
        >
          <div className='PeopleMenu-personPhoto'>
            <img src={'/people/pictures/' + person.id + '.jpg'}/ >
          </div>
          <div className='PeopleMenu-personName'>
            {person.name}
          </div>
        </AmbMenuItem>
      );
    });

    var peopleMenuInnards = function(menuState) {
      var menu = (!menuState.isOpen) ? false : (
        <div
          className='PeopleMenu-menu'
          key='menu'
        >
          {peopleMenuItems}
        </div>
      );
      return (
        <CSSTransitionGroup transitionName='people'>
          {menu}
        </CSSTransitionGroup>
      );
    };

    return (
      <AmbWrapper
        className='PeopleMenu'
        onSelection={handleSelection}
        style={{ marginTop: 20 }}
      >
        <AmbButton className='PeopleMenu-trigger'>
          <span className='PeopleMenu-triggerText'>
            Select a person
          </span>
          <span className='PeopleMenu-triggerIcon' />
        </AmbButton>
        <AmbMenu>
          {peopleMenuInnards}
        </AmbMenu>
      </AmbWrapper>
    );
  }
});

function handleSelection(value, event) { .. }
```

## AriaMenuButton API

The AriaMenuButton object exposes four components: `Wrapper`, `Button`, `Menu`, and `MenuItem`. Each of these is documented below.

**`Button`, `Menu`, and `MenuItem` must always be wrapped in a `Wrapper`.**

### Wrapper

A simple component to group a `Button`/`Menu`/`MenuItem` set, coordinating their interactions.
*It should wrap your entire menu button widget.*

All `Button`, `Menu`, and `MenuItem` components *must* be nested within a `Wrapper` component.

Each wrapper can contain *only one* `Button`, *only one* `Menu`, and *multiple* `MenuItem`s.

#### props

All props except `onSelection`, are optional.

**onSelection** { Function }: *Required.* A callback to run when the user makes a selection (i.e. clicks or presses Enter or Space on a `MenuItem`). It will be passed the `value` of the selected `MenuItem` and the React SyntheticEvent.

```js
<Wrapper onSelection={handleSelection} />

// ...

function handleSelection(value, event) {
  event.stopPropagation;
  console.log(value);
}
```

**closeOnSelection** { Boolean }: By default, it *does* automatically close. If `false`, the menu will *not* automatically close when a selection is made. Default: `true`.

**tag** { String }: The HTML tag for this element. Default: `'div'`.

**id** { String }: An id value.

**className** { String }: A class value.

**style** { Object }: An object for inline styles.

### `Button`

A React component to wrap the content of your menu-button-pattern's button.

The `Button` component itself acts as a UI button (with tab-index, role, etc.), so you probably do not want to pass an HTML `<button>` element as its child.

Each `Button` must be wrapped in a `Wrapper`, and each `Wrapper` can wrap only one `Button`.

#### props

All props are optional.

**disabled** { Boolean }: If `true`, the element is disabled (`aria-disabled='true'`, not in tab order, clicking has no effect).

**tag** { String }: The HTML tag for this element. Default: `'span'`.

**id** { String }: An id value.

**className** { String }: A class value.

**style** { Object }: An object for inline styles.

### `Menu`

A React component to wrap the content of your menu-button-pattern's menu.

A `Menu`'s child may be one of the following:

- a React element, which will mount when the menu is open and unmount when the menu closes
- a function accepting the following menu-state object

  ```js
  {
    isOpen: Boolean // whether or not the menu is open
  }
  ```

Each `Menu` must be wrapped in a `Wrapper`, and each `Wrapper` can wrap only one `Menu`.

#### props

All props are optional.

**tag** { String }: The HTML tag for this element. Default: `'span'`.

**id** { String }: An id value.

**className** { String }: A class value.

**style** { Object }: An object for inline styles.

### `MenuItem`

A React component to wrap the content of one of your menu-button-pattern's menu items.

Each `MenuItem` must be wrapped in a `Wrapper`, and each `Wrapper` can wrap multiple `MenuItem`s.

When a `MenuItem` is *selected* (by clicking or focusing and hitting Enter or Space), it calls the `onSelection` handler you passed `ariaMenuButton` when creating this set of components.

It passes that handler a *value* and the *event*. The value it passes is determined as follows:

- If the `MenuItem` has a `value` prop, that is passed.
- If the `MenuItem` has no `value` prop, the component's child is passed (so it better be simple text!).

When the menu is open and the user hits a letter key, focus moves to the next `MenuItem` whose "text" starts with that letter. The `MenuItem`'s relevant "text" is determined as follows:

- If the `MenuItem` has a `text` prop, that is used.
- If the `MenuItem` has no `text` prop, the component's child is used (so it better be simple text!).

#### props

All props are optional.

**text** { String } *Required if child is an element*: If `text` has a value, its first letter will be the letter a user can type to navigate to that item.

**value** { String | Boolean | Number }: *Required if child is an element.* If `value` has a value, it will be passed to the `onSelection` handler when the `MenuItem` is selected.

**tag** { String }: The HTML tag for this element. Default: `'span'`.

**id** { String }: An id value.

**className** { String }: A class value.

**style** { Object }: An object for inline styles.

## Contributing & Development

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

Lint with `npm run lint`.

Test with `npm run test-dev`. A browser should open; look at the console log for TAP output.
