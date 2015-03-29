# react-aria-menubutton [![Build Status](https://travis-ci.org/davidtheclark/react-aria-menubutton.svg?branch=master)](https://travis-ci.org/davidtheclark/react-aria-menubutton)

A dropdown-menu-button widget that

  - is a React component;
  - follows [the WAI-ARIA Menu Button Design Pattern](http://www.w3.org/TR/wai-aria-practices/#menubutton) for maximal accessibility (including ARIA attributes and keyboard interaction);
  - uses [SUIT CSS conventions](https://github.com/suitcss/suit/blob/master/doc/README.md) for maximal themeability;
  - is very thoroughly tested (have a look in `test/`).

## [Demo](http://davidtheclark.github.io/react-aria-menubutton/)

## Dependencies

- React 0.13.x
- classNames ^1.0.0

## Example Usage

Using CommonJS:

```js
var React = require('react');
var classNames = require('classnames');
var createAriaMenuButton = require('react-aria-menubutton');

var AriaMenuButton = createAriaMenuButton(React, classNames);

React.render(
  <AriaMenuButton id='myMenuButton'
   handleSelection={mySelectionHandler}
   items={myItems}
   triggerContent='Click me'
   closeOnSelection={true}
   transition={true} />,
  document.getElementById('container')
);
```

Using globals:

```html
<script src="createAriaMenuButton.js"></script>
<script>
  // Assuming React and classNames are globally available
  var AriaMenuButton = createAriaMenuButton();
  // ...
</script>

```

## API

If you `require()` this module with CommonJS, you will receive the the function `createAriaMenuButton()`.

If you are not using CommonJS, the same function will be globally exposed.

### createAriaMenuButton(React, classNames)

Pass in the dependencies, `React` and `classNames`.

Returns a React component, an `AriaMenuButton`, as described below.

*If `React` and `classNames` are available on the global (`window`) object, you do not have to pass them in as arguments.*

### AriaMenuButton

A React component that takes the following props.

#### handleSelection: Function, required

A callback to run when the user makes a selection (clicks or presses Enter or Space on a menu item). It will be passed the value of the selected menu item (as defined in the `items` prop).

While the menu's open/closed-state is handled internally, the selection-state is up to you: do with it what you will.

#### items: Array of Objects, required

Each item has the following properties:
- **content: String|ReactElement, required** — The content to be rendered inside the menu item. A simple string or a however-fancy-you-want React element.
- **id: String, optional** — An id for the element (useful for testing).
- **text: String, optional** — If `content` is an element, include a `text` property to be used when letter keys are pressed (see description of keyboard interaction).
- **value: String|Number|Boolean, optional** — The value to be passed to the `handleSelection()` function when this item is selected.

#### triggerContent: String|ReactElement, required

The content to be displayed in the menu button — the trigger.
This is inserted directly into the button via JSX, so it can be a string or a React element with fancy innards, whatever you need.

#### closeOnSelection: Boolean, optional

If `true`, the menu will close when a selection is made.

#### flushRight: Boolean, optional

If `true`, the menu will receive the modifier class
`'AriaMenuButton-menu--flushRight'`.

All of the provided styles by default position the menu so that it is flush with the left side of the button; but if the button is at the right edge of the screen, you'd want the menu flushed with its right side, so that it does not extend offscreen. That's what this option is for.

#### id: String, optional

A base id for the instance.
This will be used to generate ids for all clickable elements besides menu items (se above)— which can be useful for testing.

#### startOpen: Boolean, optional

If `true`, the menu will be open when `AriaMenuButton` mounts. This is useful for testing, but probably not useful for real applications.

#### selectedValue: String|Number|Boolean, optional

The currently selected value. The item that has this value will receive the state class `'is-selected'`, which CSS can use to make it stand out in some way.

#### transition: Boolean, optional

If `true`, the menu will be wrapped in a [`ReactCSSTransitionGroup`](https://facebook.github.io/react/docs/animation.html).
The wrapping TransitionGroup will have the classes `'AriaMenuButton-menuWrapper AriaMenuButton-menuWrapper--trans'`. Your CSS, then, can respond to the state classes `is-enter`, `is-enter-active`, `is-leave`, and `is-leave-active` to apply a CSS transition of one kind or another.

## Styling

In order for this thing to look like a menu button, it will need to be styled like a menu button.
The elements of `AriaMenuButton` are marked with classes following [SUIT CSS conventions](https://github.com/suitcss/suit/blob/master/doc/README.md), so they are easily themeable. The following classes are used:

```css
.AriaMenuButton {}
.AriaMenuButton-trigger {}
.AriaMenuButton-trigger.is-open {}
.AriaMenuButton-menuWrapper {}
.AriaMenuButton-menuWrapper--trans {}
.AriaMenuButton-menu {}
.AriaMenuButton-menu--flushRight {}
.AriaMenuButton-li {}
.AriaMenuButton-menuItem {}
.AriaMenuButton-menuItem.is-selected {}
```

Within `css/`, there is a `base.css` stylesheets that provides minimal rule sets you can start with.

There are also ready-made themes matching the styles of popular frameworks. All of them are on display in the [demo](http://davidtheclark.github.io/react-aria-menubutton/).
