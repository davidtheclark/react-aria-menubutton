# Changelog

## 7.0.3
- Fixes `onSelection` doesn't update on prop change issue [#142](https://github.com/davidtheclark/react-aria-menubutton/issues/142)

## 7.0.2
- Fix blur handler breaking due to unavailability of button

## 7.0.1
- Added React v17+ in peer dependency

## 7.0.0
- **Breaking:** Removed usage of `ReactDOM.findDOMNode` and `create-react-context`. This will no longer support older versions of React, it now requires `^16.3.0`

## 6.3.0
- Removed usage of legacy React context API, the package now use `create-react-context` which uses new context API if available else fallsback to the legacy API.

## 6.2.0

- Bind `Home` key to jump to first item in the current menu.
- Bind `End` key to jump to the last item in the current menu.
- Removed use of deprecated React lifecycle methods.

## 6.1.0

- Add `closeOnBlur` prop.

## 6.0.1

- Chore: Use loose mode for Babel compilation.

## 6.0.0

- **Breaking:** Pass `disabled` attribute to `Button` component's inner element if it is a regular HTML element that supports `disabled`.
  Considered a potentially breaking (though positive) change because it may affect behavior and styling of your UI.

## 5.1.1

- Fix keydown behavior of link menu items, so Enter and Space open the link the same way a click does.
- Make prop `onSelection` optional, because it's not necessary if your menu items are link.

## 5.1.0

- React 16 support.

## 5.0.2

- Satisfy React deprecation warnings.

## 5.0.1

- Clicks inside the menu that are not on a `MenuItem` move focus to the first `MenuItem`.
- When the menu opens, focus only moves to the first menu item *if you opened with keyboard interactions*.
  With a mouse click on the trigger, for example, focus remains on the trigger.

## 5.0.0

- When the menu opens, move focus to the first item (by default).
  This represents a change to [the WAI-ARIA Menu Button Design Pattern](http://www.w3.org/TR/wai-aria-practices/#menubutton).

## 4.3.1

- Introduce `dist/`, where `src/` now compiles to, since React 15.5+ demands `class`es, so Babel-compilation.
  Which is actually a huge overhaul, though in semver it's just a patch.

## 4.3.0

- Add `onMenuToggle` prop to `Wrapper`.

## 4.2.0

- Use `ownerDocument` instead of `document.documentElement` in case this is used in an iframe.
- Rewrite test suite using Jest.

## 4.1.3

- Fix UMD build.

## 4.1.2

- Allow React 15 as a `peerDependency`.

## 4.1.1

- Update UMD build.

## 4.1.0

- Add `openMenu()` and `closeMenu()` to API.
- Improve (fix) UMD build.
- Allow arbitrary props to pass through to Button, Menu, MenuItem, and Wrapper elements.

## 4.0.2

- Move `react` and `react-dom` to peer dependencies.

## 4.0.1

- Update `focus-group` due to important fix there.

## 4.0.0

- Use `focus-group` for focus management, which includes improving letter navigation.
- Switch from `tap.js` to `teeny-tap`.
- Move UMD build to `umd/` directory that is only distributed with the npm package (available on unpkg).

## 3.1.0

- Add `disabled` prop to `Button`.

## 3.0.0

- Upgrade to React 0.14.
- Use React's `context` to simplify API.
- Add `<Wrapper>` component (replacing the need for the factory function `ariaMenuButton()`).
- Add `style` prop to all components.

## 2.0.4 and 2.0.5

- Better cleanup of Tap.js listeners.
- Key code 91 is not a letter so I should stop treating it like one.

## 2.0.2 and 2.0.3

- Avoid presuming that `document` exists, to avoid breaking `React.renderToString()`.

## 2.0.1

- Allow for the case that selecting a menu item unmounts the menu (mostly by manager timers more intelligently).

## 2.0.0

- Ignore letter key presses if the letter is paired with `alt`, `ctrl`, or `meta` keys.
- Use [tap.js](https://github.com/alexgibson/tap.js) to improve click-outside-closes behavior: no overlay required anymore, meaning that a click outside can *both* close the menu *and* do something else — with both mouse and touch events.

## 1.1.0

- Allow objects as MenuItem `value`s.

## 1.0.0

- Nothing really: it was just time to start the real versioning.

## 0.8.0
- Overlay to enable close-when-clicking-outside for mobile.

## 0.7.0
- New, more flexible API: provided components are just wrappers around whatever elements they're given.

## 0.6.0
- Pass `event` to `handleSelection`.

## 0.5.2
- Add keywords to `package.json`.

## 0.5.1
- Update build.

## 0.5.0
- Make class names a little more explicit (change `menuWrapper--trans` to `menuWrapper--transition` and `li` to `menuItemWrapper`).
- Add `transition` option to factory and remove `transition` prop from component.

## 0.4.0
- Options to customize css classes' component name and namespace.
- Remove the need to pass in React by distinguishing `dist-modules/` with (transpiled) CommonJS modules and `dist/` with a UMD library that expects React to be global.
- Switch from browserify to webpack for JS module compilation.

## 0.3.0
- Remove `classnames` dependency.

## 0.2.0
- Add `dist-modules` for modular consumption.
- Upgrade dependencies.

## 0.1.0
- Initial release.
