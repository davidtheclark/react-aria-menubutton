# react-aria-menubutton [![Build Status](https://travis-ci.org/davidtheclark/react-aria-menubutton.svg?branch=master)](https://travis-ci.org/davidtheclark/react-aria-menubutton)

A menu button that

  - is a React component;
  - follows [the WAI-ARIA Menu Button Design Pattern](http://www.w3.org/TR/wai-aria-practices/#menubutton) for maximal accessibility (including *ARIA attributes* and *keyboard interaction*);
  - uses [SUIT CSS conventions](https://github.com/suitcss/suit/blob/master/doc/README.md) for maximal themeability;
  - is very thoroughly tested (have a look in `test/`);
  - is flexible & customizable enough that it's worth passing around.

**Please check out [the demo](http://davidtheclark.github.io/react-aria-menubutton/).**

## Accessibility

The primary goal of this project is to build a React component that follows every detail of [the WAI-ARIA Menu Button Design Pattern](http://www.w3.org/TR/wai-aria-practices/#menubutton).
This is kind of hard (because of keyboard interaction and focus management), so I wanted to share what I'd learned and (hopefully) learn more from others.
Follow the link and read about the keyboard interactions and ARIA attributes. Quotations from this spec are scattered in comments throughout the source code, so it's clear which code addresses which requirements.

The [demo](http://davidtheclark.github.io/react-aria-menubutton/) also lists all of the interactions that are built in.

*If you think that this component does not satisfy the spec or if you know of other ways to make it even more accessible, please file an issue.*

## Installation

```
npm install react-aria-menubutton
```

There is only one dependency: React 0.13.x.

## Usage

There are two ways to use this module:
- with CommonJS
- as a global UMD library

Either way, what is exposed is the function `createAriaMenuButton([options])`, which returns the component you want, tailored with your options.

Using CommonJS, for example, you can simply `require()` the module to get the factory:

```js
var createAriaMenuButton = require('react-aria-menubutton');

var AriaMenuButton = createAriaMenuButton();

React.render(
  <AriaMenuButton id='myMenuButton'
   handleSelection={mySelectionHandler}
   items={myItems}
   triggerContent='Click me'
   closeOnSelection={true} />,
  document.getElementById('container')
);
```

Using globals/UMD, you must do the following:
- Expose React globally
- Use one of the builds in the `dist/` directory

For example:

```html
<script src="react.min.js"></script>
<script src="node_modules/react-aria-menu-button/dist/createAriaMenuButton.min.js"></script>
<script>
  var AriaMenuButton = createAriaMenuButton();
  // ...
</script>
```

## Styling

It is not a goal of this module to share some new neat dropdown style.
This module's focus is on functionality — especially accessibility.
However, in order for this thing to look like a menu button, it will need to be styled like a menu button.
Therefore, I'm trying to *give you, the user, the means to write your own styles*, rather than forcing you into anything.

Towards that end, the elements of `AriaMenuButton` are marked with classes that follow [SUIT CSS conventions](https://github.com/suitcss/suit/blob/master/doc/README.md); so the whole thing is very easily themeable.

Within `css/`, there is a `base.css` stylesheet that provides some minimal rule sets that can get you started.
There are also a few ready-made themes that match the styles of popular frameworks.
All of them are on display in the [demo](http://davidtheclark.github.io/react-aria-menubutton/), so have a look.

The following classes are used:

```css
.AriaMenuButton {}
.AriaMenuButton-trigger {}
.AriaMenuButton-trigger.is-open {}
.AriaMenuButton-menuWrapper {}
.AriaMenuButton-menuWrapper--transition {}
.AriaMenuButton-menu {}
.AriaMenuButton-menu--flushRight {}
.AriaMenuButton-menuItemWrapper {}
.AriaMenuButton-menuItem {}
.AriaMenuButton-menuItem.is-selected {}
```

### Customizing class names

You can customize these class names in SUIT-compliant ways by passing `componentName` and `namespace` options to `createAriaMenuButton([options]).

#### Specify your own component name

This will replace `AriaMenuButton` in the class name with the component name of your choice. For example, if you pass `{ componentName: 'Dropdown' }`, your classes will be

```css
.Dropdown {}
.Dropdown-trigger {}
.Dropdown-trigger.is-open {}
.Dropdown-menuWrapper {}
/* ... and so on */
```

#### Specify your own namespace

This will add you namespace to the front of every class name, including the state classes. For example, if you pass `{ namespace: 'up' }`, you classes will be

```css
.up-AriaMenuButton {}
.up-AriaMenuButton-trigger {}
.up-AriaMenuButton-trigger.up-is-open {}
.up-AriaMenuButton-menuWrapper {}
```

#### Specify both component name and namespace

And you can, of course, specify both a component name and a namespace. Passing `{ componentName: 'Down', namespace: 'lo' }`, you'll get

```css
.lo-Down {}
.lo-Down-trigger {}
.lo-Down-trigger.lo-is-open {}
.lo-Down-menuWrapper {}
```

## API

If you `require()` this module with CommonJS, you will receive the the function `createAriaMenuButton()`.

If you are not using CommonJS, the same function will be globally exposed.

### createAriaMenuButton([options])

Returns a React component, an `AriaMenuButton`, as described below.

```js
/* little example */
var React = require('react/addons');
var createAriaMenuButton = require('react-aria-menubutton');
var MySpecialButton = createAriaMenuButton({
  componentName: 'MySpecialButton',
  namespace: 'me',
  transition: React.addons.CSSTransitionGroup
});
```

#### options

- **componentName**: Specify a component name for css classes. [See above](#specify-your-own-component-name).
- **namespace**: Specify a namespace for css classes. [See above](#specify-your-own-namespace).
- **transition**: If you want to animate the opening & closing of the menu, pass in [React's CSSTransitionGroup](https://facebook.github.io/react/docs/animation.html) here. For example,

  ```js
  var React = require('react/addons');
  var createAriaMenuButton = require('react-aria-menubutton');
  var AriaMenuButton = createAriaMenuButton({ transition: React.addons.CSSTransitionGroup });
  ```

  Make sure you read React's docs on the component and setup your CSS to properly work with it.

### AriaMenuButton

A React component that takes the following props:

#### handleSelection: Function, required

A callback to run when the user makes a selection (i.e. clicks or presses Enter or Space on a menu item).
It will be passed the value of the selected menu item (as defined in the `items` prop).

While the menu's open/closed-state is handled internally, the selection-state is up to you: do with it what you will.

#### items: Array of Objects, required

Each item has the following properties:
- **content: String|ReactElement, required** — The content to be rendered inside the menu item. A simple string or a super fancy React element: it's up to you.
- **id: String, optional** — An id for the element (maybe useful for testing).
- **text: String, optional** — If `content` is an element, include a `text` property to be used when letter keys are pressed. For example, if your item essentially says "horse" but the `content` prop is a complicated element with icons and sub-elements and whatnot, provide `test: 'horse'` and the component will know that when the user types "h" this item should be focused.
- **value: String|Number|Boolean, optional** — The value to be passed to the `handleSelection()` function when this item is selected. If no `value` is provided, the item's `content` will be passed to the selection handler.

#### triggerContent: String|ReactElement, required

The content to be displayed in the menu button — the "trigger".
This is inserted directly into the button via JSX, so it can be a string or a React element with mind-blowing innards, whatever you need.

#### closeOnSelection: Boolean, optional

If `true`, the menu will close when a selection is made.

#### flushRight: Boolean, optional

If `true`, the menu will receive the modifier class
`AriaMenuButton-menu--flushRight`.

All of the provided styles (in `css/`) by default position the menu flush with the left side of the button.
But if the button were at the *right* edge of the screen, you'd want the menu flushed with its right side, instead, so that the menu didn't extend offscreen to the right.
That's why we have this option.

#### id: String, optional

A base id for the component.
This will be used to generate ids for all clickable elements besides menu items (which each get their own id).
The ids might be useful for testing.

#### startOpen: Boolean, optional

If `true`, the menu will be start open when `AriaMenuButton` mounts.
This is useful for testing, but probably not useful for you (unless you are contributing).

#### selectedValue: String|Number|Boolean, optional

The currently selected value.
The item that has this value will receive the state class `is-selected`, which CSS can use for special standout styling.
