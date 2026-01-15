# react-aria-menubutton [![Build Status](https://github.com/davidtheclark/react-aria-menubutton/actions/workflows/build.yml/badge.svg)](https://github.com/davidtheclark/react-aria-menubutton/actions)

A fully accessible, flexible React menu button component with built-in **TypeScript support**. Provides keyboard interactions and ARIA attributes aligned with [the WAI-ARIA Menu Button Design Pattern](http://www.w3.org/TR/wai-aria-practices/#menubutton).

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

This keyboard interaction (as well as the <kbd>home</kbd>, <kbd>end</kbd>, and arrow keys) is enabled by the module [focus-group](//github.com/davidtheclark/focus-group). You can read more about the way letter navigation works [in that documentation](//github.com/davidtheclark/focus-group#string-searching).

(In 3.x.x, when you typed a letter key focus moved to the next item in the menu (i.e. after the current focused item) that started with that letter, looping around to the front if if reached the end. This was more or less the suggested behavior from the ARIA suggestion and what I saw in jQuery UI. But I think the UX was insufficient, so when I separated out the letter navigation into the module [focus-group](//github.com/davidtheclark/focus-group), I tried to *improve letter navigation by more closely mimicking native `<select>` menus.)

Please file an issue if anything is unclear or doesn't work as expected.

### Flexibility and minimal styling

Instead of providing a pre-fabricated, fully styled widget, this module's goal is to provide a set of components that others can build their own stuff on top of.

It does not provide any classes or a stylesheet that you'll have to figure out how to include; and it does not include inline styles that would be hard to override. It **only provides "smart" components to wrap your (dumb, styled) components**. The *library's* components take care of keyboard interaction and ARIA attributes, while *your* components just do whatever you want your components to do.


## Installation

```
npm install react-aria-menubutton
```

**TypeScript users:** This library is written in TypeScript and ships with built-in type declarations. No need to install `@types` packages!

The modular approach of this library means you're much better off building it into your code with a module bundling system like Vite, webpack, or similar.

## Browser Support

Modern browsers (ES2020+). For older browser support, you may need to transpile the library.

## Usage

```tsx
import { Wrapper, Button, Menu, MenuItem } from 'react-aria-menubutton';

// TypeScript: You can also import types
import type { 
  WrapperProps, 
  ButtonProps, 
  MenuProps, 
  MenuItemProps,
  MenuChildrenState 
} from 'react-aria-menubutton';
```

## Examples

For details about why the examples work, read the API documentation below.

You can also see more examples by looking in `demo/`.

### Basic Example (TypeScript)

```tsx
import { useState } from 'react';
import { Wrapper, Button, Menu, MenuItem } from 'react-aria-menubutton';

const menuItemWords = ['foo', 'bar', 'baz'];

function MyMenuButton() {
  const [selected, setSelected] = useState('');

  const handleSelection = (value: unknown) => {
    setSelected(value as string);
  };

  const menuItems = menuItemWords.map((word, i) => (
    <li key={i}>
      <MenuItem className="MyMenuButton-menuItem">{word}</MenuItem>
    </li>
  ));

  return (
    <div>
      <Wrapper className="MyMenuButton" onSelection={handleSelection}>
        <Button className="MyMenuButton-button">click me</Button>
        <Menu className="MyMenuButton-menu">
          <ul>{menuItems}</ul>
        </Menu>
      </Wrapper>
      <p>Selected: {selected}</p>
    </div>
  );
}
```

### Advanced Example with Typed Values

```tsx
import { useState } from 'react';
import { 
  Wrapper, 
  Button, 
  Menu, 
  MenuItem,
  type MenuChildrenState 
} from 'react-aria-menubutton';

interface Person {
  name: string;
  id: number;
}

const people: Person[] = [
  { name: 'Charles Choo-Choo', id: 1242 },
  { name: 'Mina Meowmers', id: 8372 },
  { name: 'Susan Sailor', id: 2435 },
];

function PeopleMenu() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelection = (value: unknown) => {
    setSelectedId(value as number);
  };

  const menuItems = people.map((person) => (
    <MenuItem
      key={person.id}
      tag="li"
      value={person.id}
      text={person.name}
      className="PeopleMenu-person"
    >
      <div className="PeopleMenu-personName">{person.name}</div>
    </MenuItem>
  ));

  // Using function children with typed state
  const menuContent = (menuState: MenuChildrenState) => {
    if (!menuState.isOpen) return null;
    return <ul className="PeopleMenu-menu">{menuItems}</ul>;
  };

  return (
    <Wrapper className="PeopleMenu" onSelection={handleSelection}>
      <Button className="PeopleMenu-trigger">Select a person</Button>
      <Menu>{menuContent}</Menu>
    </Wrapper>
  );
}
```

### Programmatic Control

```tsx
import { openMenu, closeMenu } from 'react-aria-menubutton';

// Open menu with id "my-menu"
openMenu('my-menu');

// Open without focusing the first item
openMenu('my-menu', { focusMenu: false });

// Close menu
closeMenu('my-menu');

// Close and focus the button
closeMenu('my-menu', { focusButton: true });
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

**value** { Any }: *Required if child is an element.* If `value` has a value, it will be passed to the `onSelection` handler when the `MenuItem` is selected.

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

## TypeScript

This library is written in TypeScript and provides built-in type declarations.

### Exported Types

```tsx
import type {
  // Component Props
  WrapperProps,
  ButtonProps,
  MenuProps,
  MenuItemProps,
  
  // Menu children function state
  MenuChildren,
  MenuChildrenState,
  
  // Programmatic control options
  OpenMenuOptions,
  CloseMenuOptions,
} from 'react-aria-menubutton';
```

## Contributing & Development

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

### Scripts

- `npm run typecheck` - Type check with TypeScript
- `npm run lint` - Lint with ESLint
- `npm run format` - Format with Prettier
- `npm run format:check` - Check formatting
- `npm test` - Run tests
- `npm run build` - Build the library
- `npm start` - Start the demo dev server
