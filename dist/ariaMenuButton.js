(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["AriaMenuButton"] = factory(require("react"));
	else
		root["AriaMenuButton"] = factory(root["react"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _Manager = __webpack_require__(2);

	var _Manager2 = _interopRequireDefault(_Manager);

	var _Button = __webpack_require__(5);

	var _Button2 = _interopRequireDefault(_Button);

	var _Menu = __webpack_require__(6);

	var _Menu2 = _interopRequireDefault(_Menu);

	var _MenuItem = __webpack_require__(7);

	var _MenuItem2 = _interopRequireDefault(_MenuItem);

	// Create a new Manager and use it in wrappers for
	// a Button, Menu, and MenuItem components that will
	// be tied together

	exports['default'] = function (options) {
	  var manager = new _Manager2['default'](options);
	  return {
	    Button: (function (_React$Component) {
	      _inherits(ButtonWrapper, _React$Component);

	      function ButtonWrapper() {
	        _classCallCheck(this, ButtonWrapper);

	        _React$Component.apply(this, arguments);
	      }

	      ButtonWrapper.prototype.render = function render() {
	        return _react2['default'].createElement(_Button2['default'], _extends({ manager: manager }, this.props));
	      };

	      return ButtonWrapper;
	    })(_react2['default'].Component),
	    Menu: (function (_React$Component2) {
	      _inherits(MenuWrapper, _React$Component2);

	      function MenuWrapper() {
	        _classCallCheck(this, MenuWrapper);

	        _React$Component2.apply(this, arguments);
	      }

	      MenuWrapper.prototype.render = function render() {
	        return _react2['default'].createElement(_Menu2['default'], _extends({ manager: manager }, this.props));
	      };

	      return MenuWrapper;
	    })(_react2['default'].Component),
	    MenuItem: (function (_React$Component3) {
	      _inherits(MenuItemWrapper, _React$Component3);

	      function MenuItemWrapper() {
	        _classCallCheck(this, MenuItemWrapper);

	        _React$Component3.apply(this, arguments);
	      }

	      MenuItemWrapper.prototype.render = function render() {
	        return _react2['default'].createElement(_MenuItem2['default'], _extends({ manager: manager }, this.props));
	      };

	      return MenuItemWrapper;
	    })(_react2['default'].Component)
	  };
	};

	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _keys = __webpack_require__(3);

	var _keys2 = _interopRequireDefault(_keys);

	var _isLetterKeyCode = __webpack_require__(4);

	var _isLetterKeyCode2 = _interopRequireDefault(_isLetterKeyCode);

	var Manager = (function () {
	  function Manager() {
	    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    _classCallCheck(this, Manager);

	    this.options = options;
	    this.options.closeOnSelection = this.options.closeOnSelection || true;

	    this.handleBlur = handleBlur.bind(this);
	    this.handleSelection = handleSelection.bind(this);
	    this.handleMenuKey = handleMenuKey.bind(this);

	    // These component references are added when the relevant components mount
	    this.button = null;
	    this.menu = null;
	    this.menuItems = [];

	    // State trackers
	    this.isOpen = false;
	    this.currentFocus = -1;
	  }

	  Manager.prototype.update = function update() {
	    this.menu.setState({ isOpen: this.isOpen });
	    this.button.setState({ menuOpen: this.isOpen });
	  };

	  Manager.prototype.openMenu = function openMenu() {
	    var _this = this;

	    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    var _ref$focusMenu = _ref.focusMenu;
	    var focusMenu = _ref$focusMenu === undefined ? false : _ref$focusMenu;

	    this.isOpen = true;
	    this.update();
	    if (focusMenu) {
	      setTimeout(function () {
	        return _this.moveFocus(0);
	      }, 0);
	    } else {
	      this.currentFocus = -1;
	    }
	  };

	  Manager.prototype.closeMenu = function closeMenu() {
	    var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	    var _ref2$focusButton = _ref2.focusButton;
	    var focusButton = _ref2$focusButton === undefined ? true : _ref2$focusButton;

	    this.isOpen = false;
	    this.update();
	    if (focusButton) {
	      _react2['default'].findDOMNode(this.button).focus();
	    }
	  };

	  Manager.prototype.toggleMenu = function toggleMenu() {
	    if (this.isOpen) this.closeMenu();else this.openMenu();
	  };

	  Manager.prototype.moveFocus = function moveFocus(itemIndex) {
	    this.menuItems[itemIndex].node.focus();
	    this.currentFocus = itemIndex;
	  };

	  Manager.prototype.moveFocusUp = function moveFocusUp() {
	    var menuItems = this.menuItems;
	    var currentFocus = this.currentFocus;

	    var next = currentFocus === -1 || currentFocus === 0 ? menuItems.length - 1 : currentFocus - 1;
	    this.moveFocus(next);
	  };

	  Manager.prototype.moveFocusDown = function moveFocusDown() {
	    var menuItems = this.menuItems;
	    var currentFocus = this.currentFocus;

	    var next = currentFocus === -1 || currentFocus === menuItems.length - 1 ? 0 : currentFocus + 1;
	    this.moveFocus(next);
	  };

	  Manager.prototype.moveToLetter = function moveToLetter(letter) {
	    var menuItems = this.menuItems;
	    var currentFocus = this.currentFocus;

	    // An array of the menuItems starting with this one
	    // and looping through the end back around
	    var ouroborosItems = menuItems.slice(currentFocus + 1).concat(menuItems.slice(0, currentFocus + 1));

	    for (var i = 0, l = ouroborosItems.length; i < l; i++) {
	      var item = ouroborosItems[i];
	      if (!item.text && !item.content.charAt) {
	        throw new Error('ariaMenuButton MenuItems must have a textual child or a `text` prop');
	      }
	      if (item.text) {
	        if (item.text.charAt(0).toLowerCase() !== letter.toLowerCase()) {
	          continue;
	        }
	      } else if (item.content.charAt(0).toLowerCase() !== letter.toLowerCase()) {
	        continue;
	      }
	      this.moveFocus(menuItems.indexOf(item));
	      return;
	    }
	  };

	  return Manager;
	})();

	exports['default'] = Manager;

	function handleBlur() {
	  var _this2 = this;

	  setTimeout(function () {
	    var activeEl = document.activeElement;
	    if (activeEl === _react2['default'].findDOMNode(_this2.button)) return;
	    if (_this2.menuItems.some(function (menuItem) {
	      return menuItem.node === activeEl;
	    })) return;
	    if (_this2.isOpen) _this2.closeMenu({ focusButton: false });
	  }, 0);
	}

	function handleSelection(value) {
	  if (this.options.closeOnSelection) this.closeMenu();
	  this.options.onSelection(value);
	}

	function handleMenuKey(event) {
	  if (!this.isOpen) return;
	  switch (event.key) {
	    // "With focus on the drop-down menu, pressing Escape closes
	    // the menu and returns focus to the button.
	    case _keys2['default'].ESCAPE:
	      event.preventDefault();
	      this.closeMenu();
	      break;
	    // "With focus on the drop-down menu, the Up and Down Arrow
	    // keys move focus within the menu items, "wrapping" at the top and bottom."
	    case _keys2['default'].UP:
	      event.preventDefault();
	      this.moveFocusUp();
	      break;
	    case _keys2['default'].DOWN:
	      event.preventDefault();
	      this.moveFocusDown();
	      break;
	    default:
	      if (!_isLetterKeyCode2['default'](event.keyCode)) return;
	      // "Typing a letter (printable character) key moves focus to the next
	      // instance of a visible node whose title begins with that printable letter."
	      this.moveToLetter(String.fromCharCode(event.keyCode));
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	// Look here
	// https://github.com/facebook/react/blob/0.13-stable/src/browser/ui/dom/getEventKey.js

	'use strict';

	exports.__esModule = true;
	exports['default'] = {
	  ENTER: 'Enter',
	  SPACE: ' ',
	  ESCAPE: 'Escape',
	  UP: 'ArrowUp',
	  DOWN: 'ArrowDown'
	};
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports["default"] = function (keyCode) {
	  return keyCode >= 65 && keyCode <= 91;
	};

	module.exports = exports["default"];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _keys = __webpack_require__(3);

	var _keys2 = _interopRequireDefault(_keys);

	var Button = (function (_React$Component) {
	  _inherits(Button, _React$Component);

	  function Button(props) {
	    _classCallCheck(this, Button);

	    _React$Component.call(this, props);
	    props.manager.button = this;
	  }

	  Button.prototype.handleKeyDown = function handleKeyDown(event) {
	    var manager = this.props.manager;
	    var key = event.key;

	    if (key === _keys2['default'].DOWN) {
	      event.preventDefault();

	      // "With focus on the button and no drop-down menu displayed,
	      // pressing Down Arrow will open the drop-down menu and move focus
	      // into the menu and onto the first menu item."
	      if (!manager.isOpen) manager.openMenu({ focusMenu: true });

	      // "With focus on the button and the drop-down menu open,
	      // pressing Down Arrow will move focus into the menu onto
	      // the first menu item. [...]"
	      else manager.moveFocusDown();
	      return;
	    }

	    // "With focus on the button pressing Space or Enter will toggle
	    // the display of the drop-down menu. Focus remains on the button."
	    if (key === _keys2['default'].ENTER || key === _keys2['default'].SPACE) {
	      event.preventDefault();
	      manager.toggleMenu();
	      return;
	    }

	    manager.handleMenuKey(event);
	  };

	  Button.prototype.handleClick = function handleClick() {
	    this.props.manager.toggleMenu();
	  };

	  Button.prototype.render = function render() {
	    var _props = this.props;
	    var manager = _props.manager;
	    var children = _props.children;
	    var tag = _props.tag;
	    var className = _props.className;

	    return _react2['default'].createElement(tag, {
	      className: className,
	      // "The menu button itself has a role of button."
	      role: 'button',
	      tabIndex: '0',
	      // "The menu button has an aria-haspopup property, set to true."
	      'aria-haspopup': true,
	      'aria-expanded': manager.isOpen,
	      onKeyDown: this.handleKeyDown.bind(this),
	      onClick: this.handleClick.bind(this),
	      onBlur: manager.handleBlur
	    }, children);
	  };

	  return Button;
	})(_react2['default'].Component);

	exports['default'] = Button;

	Button.propTypes = {
	  children: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.element]).isRequired,
	  manager: _react.PropTypes.object.isRequired,
	  className: _react.PropTypes.string,
	  tag: _react.PropTypes.string
	};

	Button.defaultProps = {
	  tag: 'span'
	};
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var Menu = (function (_React$Component) {
	  _inherits(Menu, _React$Component);

	  function Menu(props) {
	    _classCallCheck(this, Menu);

	    _React$Component.call(this, props);
	    props.manager.menu = this;
	  }

	  Menu.prototype.componentWillUpdate = function componentWillUpdate() {
	    var manager = this.props.manager;

	    if (!manager.isOpen) {
	      // Clear the manager's items, so they
	      // can be reloaded next time this menu opens
	      manager.menuItems = [];
	    }
	  };

	  Menu.prototype.render = function render() {
	    var _props = this.props;
	    var manager = _props.manager;
	    var children = _props.children;
	    var tag = _props.tag;
	    var className = _props.className;

	    var childrenToRender = (function () {
	      if (typeof children === 'function') return children(manager.isOpen);
	      if (manager.isOpen) return children;
	      return [];
	    })();

	    return _react2['default'].createElement(tag, {
	      className: className,
	      onKeyDown: manager.handleMenuKey,
	      // "A menu is a container of options. The container may have a role of
	      // menu or menubar depending on your implementation."
	      role: 'menu',
	      onBlur: manager.handleBlur
	    }, childrenToRender);
	  };

	  return Menu;
	})(_react2['default'].Component);

	exports['default'] = Menu;

	Menu.propTypes = {
	  children: _react.PropTypes.oneOfType([_react.PropTypes.func, _react.PropTypes.element]).isRequired,
	  manager: _react.PropTypes.object.isRequired,
	  className: _react.PropTypes.string,
	  tag: _react.PropTypes.string
	};

	Menu.defaultProps = {
	  tag: 'div'
	};
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _keys = __webpack_require__(3);

	var _keys2 = _interopRequireDefault(_keys);

	var MenuItem = (function (_React$Component) {
	  _inherits(MenuItem, _React$Component);

	  function MenuItem() {
	    _classCallCheck(this, MenuItem);

	    _React$Component.apply(this, arguments);
	  }

	  MenuItem.prototype.componentDidMount = function componentDidMount() {
	    var props = this.props;
	    this.managedIndex = props.manager.menuItems.push({
	      node: _react2['default'].findDOMNode(this),
	      content: props.children,
	      text: props.text
	    }) - 1;
	  };

	  MenuItem.prototype.handleKeyDown = function handleKeyDown(event) {
	    if (event.key !== _keys2['default'].ENTER && event.key !== _keys2['default'].SPACE) return;
	    event.preventDefault();
	    this.selectItem(event);
	  };

	  MenuItem.prototype.selectItem = function selectItem(event) {
	    var props = this.props;
	    // If there's no value, we'll send the child
	    var value = typeof props.value !== 'undefined' ? props.value : props.children;
	    props.manager.handleSelection(value, event);
	    props.manager.currentFocus = this.managedIndex;
	  };

	  MenuItem.prototype.render = function render() {
	    var _props = this.props;
	    var tag = _props.tag;
	    var children = _props.children;
	    var className = _props.className;

	    return _react2['default'].createElement(tag, {
	      className: className,
	      onClick: this.selectItem.bind(this),
	      onKeyDown: this.handleKeyDown.bind(this),
	      // "The menu contains elements with roles: menuitem,
	      // menuitemcheckbox, or menuitemradio depending on your implementation."
	      role: 'menuitem',
	      // "With focus on the button pressing the Tab key will
	      // take the user to the next tab focusable item
	      // on the page."
	      //
	      // "With focus on the drop-down menu, pressing the Tab
	      // key will take the user to the next tab focusable
	      // item on the page."
	      //
	      // "Menu focus is managed by the menu using tabindex
	      // or aria-activedescendant."
	      tabIndex: '-1'
	    }, children);
	  };

	  return MenuItem;
	})(_react2['default'].Component);

	exports['default'] = MenuItem;

	MenuItem.propTypes = {
	  children: _react.PropTypes.oneOfType([_react.PropTypes.element, _react.PropTypes.string]).isRequired,
	  manager: _react.PropTypes.object.isRequired,
	  className: _react.PropTypes.string,
	  tag: _react.PropTypes.string,
	  text: _react.PropTypes.string,
	  value: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.number, _react.PropTypes.string])
	};

	MenuItem.defaultProps = {
	  tag: 'div'
	};
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;