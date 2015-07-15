# Changelog

## 0.6.0
- Pass event object as second argument to `handleSelection` callback.

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
