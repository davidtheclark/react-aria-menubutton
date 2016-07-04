# Changelog

# 4.1.3

- Fix UMD build.

# 4.1.2

- Allow React 15 as a `peerDependency`.

# 4.1.1

- Update UMD build.

# 4.1.0

- Add `openMenu()` and `closeMenu()` to API.
- Improve (fix) UMD build.
- Allow arbitrary props to pass through to Button, Menu, MenuItem, and Wrapper elements.

# 4.0.2

- Move `react` and `react-dom` to peer dependencies.

# 4.0.1

- Update `focus-group` due to important fix there.

# 4.0.0

- Use `focus-group` for focus management, which includes improving letter navigation.
- Switch from `tap.js` to `teeny-tap`.
- Move UMD build to `umd/` directory that is only distributed with the npm package (available on npmcdn).

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
