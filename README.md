# react-aria-menubutton [![Build Status](https://travis-ci.org/davidtheclark/react-aria-menubutton.svg?branch=master)](https://travis-ci.org/davidtheclark/react-aria-menubutton)

---

**v0.7.0 provides a new, better, more flexible API.** It shouldn't be too hard to upgrade.

---

A React component that helps you build accessible menu buttons, by providing keyboard interactions and ARIA attributes aligned with [the WAI-ARIA Menu Button Design Pattern](http://www.w3.org/TR/wai-aria-practices/#menubutton).

Please check out [the demo](http://davidtheclark.github.io/react-aria-menubutton/demo/).

## Project Goal

### Accessibility

The project started as an effort to build a React component that follows every detail of [the WAI-ARIA Menu Button Design Pattern](http://www.w3.org/TR/wai-aria-practices/#menubutton) for **maximum accessibility**.

Just hiding and showing a menu is easy; but the required **keyboard interactions** are kind of tricky, and the required **ARIA attributes** are easy to forget.
So I decided to try to abstract the component enough that it would be **worth sharing with others**.

Follow [the link](http://www.w3.org/TR/wai-aria-practices/#menubutton) and read about the keyboard interactions and ARIA attributes. [The demo](http://davidtheclark.github.io/react-aria-menubutton/demo/) also lists all of the interactions that are built in.

*If you think that this component does not satisfy the spec or if you know of other ways to make it even more accessible, please file an issue.*

### Flexibility

Instead of providing a pre-fabricated, fully styled component, this module's goal is to provide a component that others can build their own stuff on top of.

The first draft of the API (<0.7.0) tried to achieve this flexibility by following [SUIT CSS conventions](https://github.com/suitcss/suit/blob/master/doc/README.md) and allowing users to customize the class names to their liking. It also had a weird, non-optimal way to allow users to take advantage of [React's CSSTransitionGroup](https://facebook.github.io/react/docs/animation.html).

The current API is more flexible: it **does not provide any classes**, only **provides smart components to wrap *your* components**. These components provide the keyboard interaction and ARIA attributes, while your components do whatever you want your components to do.

## Installation

```
npm install react-aria-menubutton
```

There is only one dependency: React 0.13.x.

## Usage

There are two ways to consume this module:
- with CommonJS
- as a global UMD library

Using CommonJS, for example, you can simply `require()` the module to get the function `ariaMenuButton([options])`, which:

```js
var ariaMenuButton = require('react-aria-menubutton');

var myAmb = ariaMenuButton({
  onSelection: mySelectionHandler
});
```

Using globals/UMD, you must do the following:
- Expose React globally
- Use one of the builds in the `dist/` directory

```html
<script src="react.min.js"></script>
<script src="node_modules/react-aria-menu-button/dist/ariaMenuButton.min.js"></script>
<script>
  var myAmb = ariaMenuButton({
    onSelection: mySelectionHandler
  });
</script>
```

**You *get to* (have to) write your own CSS, your own way!**

### ariaMenuButton([options])

Returns an object with three components: `Button`, `Menu`, and `MenuItem`. Each of these is documented below.

```js
var myAmb = ariaMenuButton({
  onSelection: mySelectionHandler
});
var MyAmbButton = myAmb.Button;
var MyAmbMenu = myAmb.Menu;
var MyAmbMenuItem = myAmb.MenuItem;
```

#### options

##### onSelection

Type: `Function` *Required*

A callback to run when the user makes a selection (i.e. clicks or presses Enter or Space on a `MenuItem`). It will be passed the value of the selected `MenuItem` and the React SyntheticEvent.

```js
var myAmb = ariaMenuButton({
  onSelection: function(value, event) {
    event.stopPropagation;
    console.log(value);
  }
});
```

##### closeOnSelection

Type: `Boolean` Default: `true`

If `false`, the menu will *not* automatically close when a selection is made. (By default, it *does* automatically close.)

## Examples

For details about why the examples work, read the component API documentation below.

You can see more examples by looking in `demo/`.

```js
// Very simple ES6 example

import React from 'react';
import ariaMenuButton from 'react-aria-menubutton';

const menuItemWords = ['foo', 'bar', 'baz'];

class MyMenuButton extends React.Component {
  componentWillMount() {
    this.amb = ariaMenuButton({
      onSelection: handleSelection
    });
  }
  render() {
    const { Button, Menu, MenuItem } = this.amb;

    const menuItems = menuItemWords.map((word, i) => {
      return (
        <li key={i}>
          <MenuItem className='MyMenuButton-menuItem'>
            {word}
          </MenuItem>
        </li>
      );
    });

    return (
      <div className='MyMenuButton'>
        <Button className='MyMenuButton-button'>
          click me
        </Button>
        <Menu className='MyMenuButton-menu'>
          <ul>{menuItems}</ul>
        </Menu>
      </div>
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

var React = require('react/addons');
var ariaMenuButton = require('react-aria-menubutton');
var CSSTransitionGroup = React.addons.CSSTransitionGroup;

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
  componentWillMount: function() {
    this.amb = ariaMenuButton({
      onSelection: handleSelection
    });
  },

  render: function() {
    var MyButton = this.amb.Button;
    var MyMenu = this.amb.Menu;
    var MyMenuItem = this.amb.MenuItem;

    var peopleMenuItems = people.map(function(person, i) {
      return (
        <MyMenuItem
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
        </MyMenuItem>
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
      <div className='PeopleMenu'>
        <MyButton className='PeopleMenu-trigger'>
          <span className='PeopleMenu-triggerText'>
            Select a person
          </span>
          <span className='PeopleMenu-triggerIcon' />
        </MyButton>
        <MyMenu>
          {peopleMenuInnards}
        </MyMenu>
      </div>
    );
  }
});

function handleSelection(value, event) { .. }
```

## Component API

### `Button`

A React component to wrap the content of your menu-button-pattern's button.

A `Button`'s child can be a string or a React element.

#### props

*All props are optional.*

##### tag

Type: `String` Default: `'span'`

The HTML tag for this element.

##### id

Type: `String`

An id value.

##### className

Type: `String`

A class value.

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

#### props

*All props are optional.*

##### tag

Type: `String` Default: `'span'`

The HTML tag for this element.

##### id

Type: `String`

An id value.

##### className

Type: `String`

A class value.

### `MenuItem`

A React component to wrap the content of one of your menu-button-pattern's menu items.

When a `MenuItem` is *selected* (by clicking or focusing and hitting Enter or Space), it calls the `onSelection` handler you passed `ariaMenuButton` when creating this set of components.

It passes that handler a *value* and the *event*. The value it passes is determined as follows:

- If the `MenuItem` has a `value` prop, that is passed.
- If the `MenuItem` has no `value` prop, the component's child is passed (so it better be simple text!).

When the menu is open and the user hits a letter key, focus moves to the next `MenuItem` whose "text" starts with that letter. The `MenuItem`'s relevant "text" is determined as follows:

- If the `MenuItem` has a `text` prop, that is used.
- If the `MenuItem` has no `text` prop, the component's child is used (so it better be simple text!).

#### props

*All props are optional.*

##### text

Type: `String` *Required if child is an element*

If `text` has a value, its first letter will be the letter a user can type to navigate to that item.

##### value

Type: `String|Boolean|Number` *Required if child is an element*

If `value` has a value, it will be passed to the `onSelection` handler when the `MenuItem` is selected.

##### tag

Type: `String` Default: `'span'`

The HTML tag for this element.

##### id

Type: `String`

An id value.

##### className

Type: `String`

A class value.
