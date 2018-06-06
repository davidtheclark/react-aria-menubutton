# react-aria-menubutton [![Build Status](https://travis-ci.org/davidtheclark/react-aria-menubutton.svg?branch=master)](https://travis-ci.org/davidtheclark/react-aria-menubutton)

A React component (set of components, really) that will help you build accessible menu buttons by providing keyboard interactions and ARIA attributes aligned with [the WAI-ARIA Menu Button Design Pattern](http://www.w3.org/TR/wai-aria-practices/#menubutton).

Please check out [the demo](https://davidtheclark.github.io/react-aria-menubutton/demo/).

## Project Goals

- Full accessibility
- Maximum flexibility
- Absolutely minimal styling
- Thorough testing
- Useful modularity

"Useful modularity" means that when it makes sense, chunks of lower-level code that solve specific problems are split off into vanilla JS, framework-agnostic modules that could be shared with other similar projects (e.g. a menu button for Angular or Ember).

For this library I was able to split off:

- [focus-group](//github.com/davidtheclark/focus-group)
- [teeny-tap](//github.com/davidtheclark/teeny-tap)

*If you like this kind of module (accessible, flexible, unstyled, with framework-agnostic low-level modules) you should also check out these projects:*
- [react-aria-modal](https://github.com/davidtheclark/react-aria-modal)
- [react-aria-tabpanel](https://github.com/davidtheclark/react-aria-tabpanel)

### Accessibility

The project started as an effort to build a React component that follows every detail of [the WAI-ARIA Menu Button Design Pattern](http://www.w3.org/TR/wai-aria-practices/#menubutton) for **maximum accessibility**.

Just hiding and showing a menu is easy; but the required **keyboard interactions** are kind of tricky, the required **ARIA attributes** are easy to forget, and some other aspects of opening and closing the menu based on behaviors, and managing focus, proved less than pleasant.
So I decided to try to abstract the component enough that it would be **worth sharing with others**.

**If you think that this component could be even more accessible, please file an issue.**


### Letter Navigation

When focus is on the menu button or within the menu and you type a letter key, a search begins. Focus will move to the first item that starts with the letter you typed; but if you continue to type more letters, the search string extends and the focus becomes more accurate.

So if you type `f` focus might arrive at `farm`; but then if you keep typing until you've typed `foo`, focus will skip ahead (past `farm` and `fit` and `fog`) to `foot`. This significantly improves your ability to type your way to your intended selection.

This keyboard interaction (as well as the arrow keys) is enabled by the module [focus-group](//github.com/davidtheclark/focus-group). You can read more about the way letter navigation works [in that documentation](//github.com/davidtheclark/focus-group#string-searching).

(In 3.x.x, when you typed a letter key focus moved to the next item in the menu (i.e. after the current focused item) that started with that letter, looping around to the front if if reached the end. This was more or less the suggested behavior from the ARIA suggestion and what I saw in jQuery UI. But I think the UX was insufficient, so when I separated out the letter navigation into the module [focus-group](//github.com/davidtheclark/focus-group), I tried to *improve letter navigation by more closely mimicking native `<select>` menus.)

Please file an issue if anything is unclear or doesn't work as expected.

### Flexibility and minimal styling

Instead of providing a pre-fabricated, fully styled widget, this module's goal is to provide a set of components that others can build their own stuff on top of.

It does not provide any classes or a stylesheet that you'll have to figure out how to include; and it does not include inline styles that would be hard to override. It **only provides "smart" components to wrap your (dumb, styled) components**. The *library's* components take care of keyboard interaction and ARIA attributes, while *your* components just do whatever you want your components to do.


## Installation

```
npm install react-aria-menubutton
```

The modular approach of this library means you're much better off building it into your code with a module bundling system like browserify or webpack.

But if you need a UMD version (which will include `focus-group` and `teeny-tap` in the bundle, but of course not `React` or `ReactDOM`), you can get it via npmcdm at `https://unpkg.com/react-aria-menubutton@[version-of-choice]/umd/ReactAriaMenuButton.js`.
If you don't know about unpkg, [read about it here](https://unpkg.com).

## Browser Support

Basically IE9+.

## Usage

```js
const AriaMenuButton = require('react-aria-menubutton');

// Now use AriaMenuButton.Wrapper, AriaMenuButton.Button,
// AriaMenuButton.Menu, and AriaMenuButton.MenuItem ...

// ... or with es2015
import { Button, Wrapper, Menu, MenuItem } from 'react-aria-menubutton';
```

## Examples

For details about why the examples work, read the API documentation below.

You can also see more examples by looking in `demo/`.

```js
// Very simple ES2015 example

import React from 'react';
import { Wrapper, Button, Menu, MenuItem } from 'react-aria-menubutton';

const menuItemWords = ['foo', 'bar', 'baz'];

class MyMenuButton extends React.Component {
  render() {
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
      <Wrapper
        className='MyMenuButton'
        onSelection={handleSelection}
      >
        <Button className='MyMenuButton-button'>
          click me
        </Button>
        <Menu className='MyMenuButton-menu'>
          <ul>{menuItems}</ul>
        </Menu>
      </Wrapper>
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
var CSSTransitionGroup = require('react-transition-group/CSSTransitionGroup');
var AriaMenuButton = require('react-aria-menubutton');

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
        <AriaMenuButton.MenuItem
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
        </AriaMenuButton.MenuItem>
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
      <AriaMenuButton.Wrapper
        className='PeopleMenu'
        onSelection={handleSelection}
        style={{ marginTop: 20 }}
      >
        <AriaMenuButton.Button className='PeopleMenu-trigger'>
          <span className='PeopleMenu-triggerText'>
            Select a person
          </span>
          <span className='PeopleMenu-triggerIcon' />
        </AriaMenuButton.Button>
        <AriaMenuButton.Menu>
          {peopleMenuInnards}
        </AriaMenuButton.Menu>
      </AriaMenuButton.Wrapper>
    );
  }
});

function handleSelection(value, event) { .. }
```

## API

The module exposes four components: `Wrapper`, `Button`, `Menu`, and `MenuItem`. Each of these is documented below.

**`Button`, `Menu`, and `MenuItem` must always be wrapped in a `Wrapper`.**

### `Wrapper`

A simple component to group a `Button`/`Menu`/`MenuItem` set, coordinating their interactions.
*It should wrap your entire menu button widget.*

All `Button`, `Menu`, and `MenuItem` components *must* be nested within a `Wrapper` component.

Each wrapper can contain *only one* `Button`, *only one* `Menu`, and *multiple* `MenuItem`s.

#### props

All props are optional.

**onSelection** { Function }: A callback to run when the user makes a selection (i.e. clicks or presses Enter or Space on a `MenuItem`). It will be passed the `value` of the selected `MenuItem` and the React SyntheticEvent. *You should definitely use this prop, unless your menu items are anchor elements.*

```js
<Wrapper onSelection={handleSelection} />

// ...

function handleSelection(value, event) {
  event.stopPropagation;
  console.log(value);
}
```

**onMenuToggle** { Function }: A callback to run when the menu is opened or closed. It will be passed the the following menu-state object:

```js
{
  isOpen: Boolean // whether or not the menu is open
}
```

For example:

```js
const Example extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  render() {
    const openClass = this.state.isOpen ? 'open' : '';

    return (
      <Wrapper
        className={`${openClass}`}
        onMenuToggle={({ isOpen }) => { this.setState({ isOpen })}}
      />
    );
  }
}
```

**closeOnSelection** { Boolean }: By default, it *does* automatically close. If `false`, the menu will *not* automatically close when a selection is made. Default: `true`.

**closeOnBlur** { Boolean }: By default, it *does* automatically close. If `false`, the menu will *not* automatically close when it blurs. Default: `true`.

**tag** { String }: The HTML tag for this element. Default: `'div'`.

### `Button`

A React component to wrap the content of your menu-button-pattern's button.

The `Button` component itself acts as a UI button (with tab-index, role, etc.), so you probably do not want to pass an HTML `<button>` element as its child.

Each `Button` must be wrapped in a `Wrapper`, and each `Wrapper` can wrap only one `Button`.

#### props

All props are optional.

**disabled** { Boolean }: If `true`, the element is disabled (`aria-disabled='true'`, not in tab order, clicking has no effect).

**tag** { String }: The HTML tag for this element. Default: `'span'` so styling across browsers is consistent, `button` is a good alternative if styling for that element is no issue.

*Any additional props (e.g. `id`, `className`, `data-whatever`) are passed directly to the HTML element.*

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

*Any additional props (e.g. `id`, `className`, `data-whatever`) are passed directly to the HTML element.*

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

*Any additional props (e.g. `id`, `className`, `data-whatever`) are passed directly to the DOM element.*

### openMenu(wrapperId[, openOptions])

Open a modal programmatically.

*For this to work, you must provide an `id` prop to the `Wrapper` of the menu.* That `id` should be your first argument to `openMenu()`.

These are the `openOptions`:

- **focusMenu** { Boolean }: If `true`, the menu's first item will receive focus when the menu opens. Default: `true`.

### closeMenu(wrapperId[, closeOptions])

Close a modal programmatically.

*For this to work, you must provide an `id` prop to the `Wrapper` of the menu.* That `id` should be your first argument to `closeMenu()`.

These are the `closeOptions`:

- **focusButton** { Boolean }: If `true`, the widget's button will receive focus when the menu closes. Default: `false`.

## Contributing & Development

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

Lint with `npm run lint`.

Test with `npm run test-dev`. A browser should open; look at the console log for TAP output.
