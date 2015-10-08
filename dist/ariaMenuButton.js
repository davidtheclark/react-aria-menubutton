(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ariaMenuButton = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * tap.js
 * Copyright (c) 2013 Alex Gibson, http://alxgbsn.co.uk/
 * Released under MIT license
 */
/* global define, module */
(function (global, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return (global.Tap = factory(global, global.document));
        });
    } else if (typeof exports === 'object') {
        module.exports = factory(global, global.document);
    } else {
        global.Tap = factory(global, global.document);
    }
}(typeof window !== 'undefined' ? window : this, function (window, document) {
    'use strict';

    function Tap(el) {
        this.el = typeof el === 'object' ? el : document.getElementById(el);
        this.moved = false; //flags if the finger has moved
        this.startX = 0; //starting x coordinate
        this.startY = 0; //starting y coordinate
        this.hasTouchEventOccured = false; //flag touch event
        this.el.addEventListener('touchstart', this, false);
        this.el.addEventListener('mousedown', this, false);
    }

    Tap.prototype.start = function(e) {

        if (e.type === 'touchstart') {

            this.hasTouchEventOccured = true;
            this.el.addEventListener('touchmove', this, false);
            this.el.addEventListener('touchend', this, false);
            this.el.addEventListener('touchcancel', this, false);

        } else if (e.type === 'mousedown') {

            this.el.addEventListener('mouseup', this, false);
        }

        this.moved = false;
        this.startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        this.startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    };

    Tap.prototype.move = function(e) {
        //if finger moves more than 10px flag to cancel
        if (Math.abs(e.touches[0].clientX - this.startX) > 10 || Math.abs(e.touches[0].clientY - this.startY) > 10) {
            this.moved = true;
        }
    };

    Tap.prototype.end = function(e) {
        var evt;

        this.el.removeEventListener('touchmove', this, false);
        this.el.removeEventListener('touchend', this, false);
        this.el.removeEventListener('touchcancel', this, false);
        this.el.removeEventListener('mouseup', this, false);

        if (!this.moved) {
            //create custom event
            try {
                evt = new window.CustomEvent('tap', {
                    bubbles: true,
                    cancelable: true
                });
            } catch (e) {
                evt = document.createEvent('Event');
                evt.initEvent('tap', true, true);
            }

            //prevent touchend from propagating to any parent
            //nodes that may have a tap.js listener attached
            e.stopPropagation();

            // dispatchEvent returns false if any handler calls preventDefault,
            if (!e.target.dispatchEvent(evt)) {
                // in which case we want to prevent clicks from firing.
                e.preventDefault();
            }
        }
    };

    Tap.prototype.cancel = function() {
        this.hasTouchEventOccured = false;
        this.moved = false;
        this.startX = 0;
        this.startY = 0;
    };

    Tap.prototype.destroy = function() {
        this.el.removeEventListener('touchstart', this, false);
        this.el.removeEventListener('touchmove', this, false);
        this.el.removeEventListener('touchend', this, false);
        this.el.removeEventListener('touchcancel', this, false);
        this.el.removeEventListener('mousedown', this, false);
        this.el.removeEventListener('mouseup', this, false);
    };

    Tap.prototype.handleEvent = function(e) {
        switch (e.type) {
            case 'touchstart': this.start(e); break;
            case 'touchmove': this.move(e); break;
            case 'touchend': this.end(e); break;
            case 'touchcancel': this.cancel(e); break;
            case 'mousedown': this.start(e); break;
            case 'mouseup': this.end(e); break;
        }
    };

    return Tap;
}));

},{}],2:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _keys = require(8);

var _keys2 = _interopRequireDefault(_keys);

var Button = (function (_React$Component) {
  _inherits(Button, _React$Component);

  function Button() {
    _classCallCheck(this, Button);

    _React$Component.apply(this, arguments);
  }

  Button.prototype.componentWillMount = function componentWillMount() {
    this.props.manager.button = this;
  };

  Button.prototype.componentWillUnmount = function componentWillUnmount() {
    this.props.manager.powerDown();
  };

  Button.prototype.handleKeyDown = function handleKeyDown(event) {
    var manager = this.props.manager;
    var key = event.key;

    if (key === _keys2['default'].DOWN) {
      event.preventDefault();
      if (!manager.isOpen) manager.openMenu({ focusMenu: true });else manager.moveFocusDown();
      return;
    }

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
    var id = _props.id;

    return _react2['default'].createElement(tag, {
      className: className,
      id: id,
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
  id: _react.PropTypes.string,
  tag: _react.PropTypes.string
};

Button.defaultProps = {
  tag: 'span'
};
module.exports = exports['default'];

},{"8":8,"react":"react"}],3:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _keys = require(8);

var _keys2 = _interopRequireDefault(_keys);

var _isLetterKeyCode = require(7);

var _isLetterKeyCode2 = _interopRequireDefault(_isLetterKeyCode);

var Manager = (function () {
  function Manager() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Manager);

    this.options = options;
    if (typeof this.options.closeOnSelection === 'undefined') {
      this.options.closeOnSelection = true;
    }

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

  Manager.prototype.powerDown = function powerDown() {
    this.button = null;
    this.menu = null;
    this.menuItems = [];
    clearTimeout(this.blurTimer);
    clearTimeout(this.moveFocusTimer);
  };

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
      this.moveFocusTimer = setTimeout(function () {
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

  this.blurTimer = setTimeout(function () {
    var activeEl = document.activeElement;
    if (activeEl === _react2['default'].findDOMNode(_this2.button)) return;
    if (_this2.menuItems.some(function (menuItem) {
      return menuItem.node === activeEl;
    })) return;
    if (_this2.isOpen) _this2.closeMenu({ focusButton: false });
  }, 0);
}

function handleSelection(value, event) {
  if (this.options.closeOnSelection) this.closeMenu();
  this.options.onSelection(value, event);
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
      // If the letter key is part of a key combo, let it do whatever it was
      // going to do
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      event.preventDefault();
      // "Typing a letter (printable character) key moves focus to the next
      // instance of a visible node whose title begins with that printable letter."
      this.moveToLetter(String.fromCharCode(event.keyCode));
  }
}
module.exports = exports['default'];

},{"7":7,"8":8,"react":"react"}],4:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _tapJs = require(1);

var _tapJs2 = _interopRequireDefault(_tapJs);

var Menu = (function (_React$Component) {
  _inherits(Menu, _React$Component);

  function Menu() {
    _classCallCheck(this, Menu);

    _React$Component.apply(this, arguments);
  }

  Menu.prototype.componentWillMount = function componentWillMount() {
    var _this = this;

    this.props.manager.menu = this;

    this.isListeningForTap = false;
    this.tapHandler = function (e) {
      if (_react2['default'].findDOMNode(_this).contains(e.target)) return;
      if (_react2['default'].findDOMNode(_this.props.manager.button).contains(e.target)) return;
      _this.props.manager.closeMenu();
    };
  };

  Menu.prototype.componentWillUpdate = function componentWillUpdate() {
    var manager = this.props.manager;

    if (manager.isOpen && !this.isListeningForTap) {
      this.addTapListeners();
    } else if (!manager.isOpen && this.isListeningForTap) {
      this.removeTapListeners();
    }

    if (!manager.isOpen) {
      // Clear the manager's items, so they
      // can be reloaded next time this menu opens
      manager.menuItems = [];
    }
  };

  Menu.prototype.componentWillUnmount = function componentWillUnmount() {
    this.removeTapListeners();
    this.props.manager.powerDown();
  };

  Menu.prototype.addTapListeners = function addTapListeners() {
    if (!global.document) return;
    this.bodyTap = new _tapJs2['default'](document.body);
    document.body.addEventListener('tap', this.tapHandler, true);
    this.isListeningForTap = true;
  };

  Menu.prototype.removeTapListeners = function removeTapListeners() {
    if (!global.document) return;
    if (!this.isListeningForTap) return;
    document.body.removeEventListener('tap', this.tapHandler, true);
    this.bodyTap.destroy();
    this.isListeningForTap = false;
  };

  Menu.prototype.render = function render() {
    var _props = this.props;
    var manager = _props.manager;
    var children = _props.children;
    var tag = _props.tag;
    var className = _props.className;
    var id = _props.id;

    var childrenToRender = (function () {
      if (typeof children === 'function') {
        return children({ isOpen: manager.isOpen });
      }
      if (manager.isOpen) return children;
      return false;
    })();

    if (!childrenToRender) return false;

    return _react2['default'].createElement(tag, {
      className: className,
      id: id,
      onKeyDown: manager.handleMenuKey,
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
  id: _react.PropTypes.string,
  className: _react.PropTypes.string,
  tag: _react.PropTypes.string
};

Menu.defaultProps = {
  tag: 'div'
};
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"1":1,"react":"react"}],5:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _keys = require(8);

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
    var id = _props.id;

    return _react2['default'].createElement(tag, {
      className: className,
      id: id,
      onClick: this.selectItem.bind(this),
      onKeyDown: this.handleKeyDown.bind(this),
      role: 'menuitem',
      tabIndex: '-1'
    }, children);
  };

  return MenuItem;
})(_react2['default'].Component);

exports['default'] = MenuItem;

MenuItem.propTypes = {
  children: _react.PropTypes.oneOfType([_react.PropTypes.element, _react.PropTypes.string, _react.PropTypes.arrayOf(_react.PropTypes.element)]).isRequired,
  manager: _react.PropTypes.object.isRequired,
  className: _react.PropTypes.string,
  id: _react.PropTypes.string,
  tag: _react.PropTypes.string,
  text: _react.PropTypes.string,
  value: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.number, _react.PropTypes.string, _react.PropTypes.object])
};

MenuItem.defaultProps = {
  tag: 'div'
};
module.exports = exports['default'];

},{"8":8,"react":"react"}],6:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _Manager = require(3);

var _Manager2 = _interopRequireDefault(_Manager);

var _Button = require(2);

var _Button2 = _interopRequireDefault(_Button);

var _Menu = require(4);

var _Menu2 = _interopRequireDefault(_Menu);

var _MenuItem = require(5);

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

},{"2":2,"3":3,"4":4,"5":5,"react":"react"}],7:[function(require,module,exports){
"use strict";

exports.__esModule = true;

exports["default"] = function (keyCode) {
  return keyCode >= 65 && keyCode <= 90;
};

module.exports = exports["default"];

},{}],8:[function(require,module,exports){
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

},{}]},{},[6])(6)
});