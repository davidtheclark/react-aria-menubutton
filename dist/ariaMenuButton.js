(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.AriaMenuButton = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function createTapListener(el, callback) {
  var startX = 0;
  var startY = 0;
  var touchStarted = false;
  var touchMoved = false;
  // Assume that if a touchstart event initiates, the user is
  // using touch and click events should be ignored.
  // If this isn't done, touch-clicks will fire the callback
  // twice: once on touchend, once on the subsequent "click".
  var usingTouch = false;

  el.addEventListener('click', handleClick, false);
  el.addEventListener('touchstart', handleTouchstart, false);

  function handleClick(e) {
    if (usingTouch) return;
    callback(e);
  }

  function handleTouchstart(e) {
    usingTouch = true;

    if (touchStarted) return;
    touchStarted = true;

    el.addEventListener('touchmove', handleTouchmove, false);
    el.addEventListener('touchend', handleTouchend, false);
    el.addEventListener('touchcancel', handleTouchcancel, false);

    touchMoved = false;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }

  function handleTouchmove(e) {
    if (touchMoved) return;

    if (
      Math.abs(e.touches[0].clientX - startX) <= 10
      && Math.abs(e.touches[0].clientY - startY) <= 10
    ) return;

    touchMoved = true;
  }

  function handleTouchend(e) {
    touchStarted = false;
    removeSecondaryTouchListeners();
    if (!touchMoved) {
      callback(e);
    }
  }

  function handleTouchcancel() {
    touchStarted = false;
    touchMoved = false;
    startX = 0;
    startY = 0;
  }

  function removeSecondaryTouchListeners() {
    el.removeEventListener('touchmove', handleTouchmove, false);
    el.removeEventListener('touchend', handleTouchend, false);
    el.removeEventListener('touchcancel', handleTouchcancel, false);
  }

  function removeTapListener() {
    el.removeEventListener('click', handleClick, false);
    el.removeEventListener('touchstart', handleTouchstart, false);
    removeSecondaryTouchListeners();
  }

  return {
    remove: removeTapListener,
  };
};

},{}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _keys = require(8);

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Button = function (_React$Component) {
  _inherits(Button, _React$Component);

  function Button() {
    _classCallCheck(this, Button);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Button).apply(this, arguments));
  }

  _createClass(Button, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.context.ambManager.button = this;
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.context.ambManager.destroy();
    }
  }, {
    key: 'handleKeyDown',
    value: function handleKeyDown(event) {
      if (this.props.disabled) return;
      var ambManager = this.context.ambManager;
      var key = event.key;

      if (key === _keys2.default.DOWN) {
        event.preventDefault();
        if (!ambManager.isOpen) {
          ambManager.openMenu({ focusMenu: true });
        } else {
          ambManager.moveFocusDown();
        }
        return;
      }

      if (key === _keys2.default.ENTER || key === _keys2.default.SPACE) {
        event.preventDefault();
        ambManager.toggleMenu();
        return;
      }

      ambManager.handleMenuKey(event);
    }
  }, {
    key: 'handleClick',
    value: function handleClick() {
      if (this.props.disabled) return;
      this.context.ambManager.toggleMenu();
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var children = _props.children;
      var tag = _props.tag;
      var className = _props.className;
      var id = _props.id;
      var style = _props.style;
      var ambManager = this.context.ambManager;

      return _react2.default.createElement(tag, {
        className: className,
        id: id,
        style: style,
        // "The menu button itself has a role of button."
        role: 'button',
        tabIndex: this.props.disabled ? '' : '0',
        // "The menu button has an aria-haspopup property, set to true."
        'aria-haspopup': true,
        'aria-expanded': ambManager.isOpen,
        'aria-disabled': this.props.disabled,
        onKeyDown: this.handleKeyDown.bind(this),
        onClick: this.handleClick.bind(this),
        onBlur: ambManager.handleBlur
      }, children);
    }
  }]);

  return Button;
}(_react2.default.Component);

exports.default = Button;

Button.propTypes = {
  children: _react.PropTypes.node.isRequired,
  className: _react.PropTypes.string,
  disabled: _react.PropTypes.bool,
  id: _react.PropTypes.string,
  style: _react.PropTypes.object,
  tag: _react.PropTypes.string
};

Button.defaultProps = {
  tag: 'span'
};

Button.contextTypes = {
  ambManager: _react.PropTypes.object.isRequired
};

},{"8":8,"react":"react"}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _keys = require(8);

var _keys2 = _interopRequireDefault(_keys);

var _isLetterKeyCode = require(7);

var _isLetterKeyCode2 = _interopRequireDefault(_isLetterKeyCode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Manager = function () {
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

  _createClass(Manager, [{
    key: 'destroy',
    value: function destroy() {
      this.button = null;
      this.menu = null;
      this.menuItems = [];
      clearTimeout(this.blurTimer);
      clearTimeout(this.moveFocusTimer);
    }
  }, {
    key: 'update',
    value: function update() {
      this.menu.setState({ isOpen: this.isOpen });
      this.button.setState({ menuOpen: this.isOpen });
    }
  }, {
    key: 'openMenu',
    value: function openMenu() {
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
    }
  }, {
    key: 'closeMenu',
    value: function closeMenu() {
      var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var _ref2$focusButton = _ref2.focusButton;
      var focusButton = _ref2$focusButton === undefined ? true : _ref2$focusButton;

      this.isOpen = false;
      this.update();
      if (focusButton) {
        _reactDom2.default.findDOMNode(this.button).focus();
      }
    }
  }, {
    key: 'toggleMenu',
    value: function toggleMenu() {
      if (this.isOpen) {
        this.closeMenu();
      } else {
        this.openMenu();
      }
    }
  }, {
    key: 'moveFocus',
    value: function moveFocus(itemIndex) {
      this.menuItems[itemIndex].node.focus();
      this.currentFocus = itemIndex;
    }
  }, {
    key: 'moveFocusUp',
    value: function moveFocusUp() {
      var menuItems = this.menuItems;
      var currentFocus = this.currentFocus;

      var next = currentFocus === -1 || currentFocus === 0 ? menuItems.length - 1 : currentFocus - 1;
      this.moveFocus(next);
    }
  }, {
    key: 'moveFocusDown',
    value: function moveFocusDown() {
      var menuItems = this.menuItems;
      var currentFocus = this.currentFocus;

      var next = currentFocus === -1 || currentFocus === menuItems.length - 1 ? 0 : currentFocus + 1;
      this.moveFocus(next);
    }
  }, {
    key: 'moveToLetter',
    value: function moveToLetter(letter) {
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
    }
  }]);

  return Manager;
}();

exports.default = Manager;

function handleBlur() {
  var _this2 = this;

  this.blurTimer = setTimeout(function () {
    var activeEl = document.activeElement;
    if (activeEl === _reactDom2.default.findDOMNode(_this2.button)) return;
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
    case _keys2.default.ESCAPE:
      event.preventDefault();
      this.closeMenu();
      break;
    // "With focus on the drop-down menu, the Up and Down Arrow
    // keys move focus within the menu items, "wrapping" at the top and bottom."
    case _keys2.default.UP:
      event.preventDefault();
      this.moveFocusUp();
      break;
    case _keys2.default.DOWN:
      event.preventDefault();
      this.moveFocusDown();
      break;
    default:
      if (!(0, _isLetterKeyCode2.default)(event.keyCode)) return;
      // If the letter key is part of a key combo, let it do whatever it was
      // going to do
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      event.preventDefault();
      // "Typing a letter (printable character) key moves focus to the next
      // instance of a visible node whose title begins with that printable letter."
      this.moveToLetter(String.fromCharCode(event.keyCode));
  }
}

},{"7":7,"8":8,"react-dom":"react-dom"}],4:[function(require,module,exports){
(function (global){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _teenyTap = require(1);

var _teenyTap2 = _interopRequireDefault(_teenyTap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Menu = function (_React$Component) {
  _inherits(Menu, _React$Component);

  function Menu() {
    _classCallCheck(this, Menu);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Menu).apply(this, arguments));
  }

  _createClass(Menu, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      this.context.ambManager.menu = this;

      this.tapHandler = function (e) {
        if (_reactDom2.default.findDOMNode(_this2).contains(e.target)) return;
        if (_reactDom2.default.findDOMNode(_this2.context.ambManager.button).contains(e.target)) return;
        _this2.context.ambManager.closeMenu();
      };
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate() {
      var ambManager = this.context.ambManager;

      if (ambManager.isOpen && !this.tapListener) {
        this.addTapListener();
      } else if (!ambManager.isOpen && this.tapListener) {
        this.tapListener.remove();
        delete this.tapListener;
      }

      if (!ambManager.isOpen) {
        // Clear the ambManager's items, so they
        // can be reloaded next time this menu opens
        ambManager.menuItems = [];
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.tapListener) this.tapListener.remove();
      this.context.ambManager.destroy();
    }
  }, {
    key: 'addTapListener',
    value: function addTapListener() {
      if (!global.document) return;
      this.tapListener = (0, _teenyTap2.default)(document.documentElement, this.tapHandler);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var children = _props.children;
      var tag = _props.tag;
      var className = _props.className;
      var id = _props.id;
      var style = _props.style;
      var ambManager = this.context.ambManager;

      var childrenToRender = function () {
        if (typeof children === 'function') {
          return children({ isOpen: ambManager.isOpen });
        }
        if (ambManager.isOpen) return children;
        return false;
      }();

      if (!childrenToRender) return false;

      return _react2.default.createElement(tag, {
        className: className,
        id: id,
        style: style,
        onKeyDown: ambManager.handleMenuKey,
        role: 'menu',
        onBlur: ambManager.handleBlur
      }, childrenToRender);
    }
  }]);

  return Menu;
}(_react2.default.Component);

exports.default = Menu;

Menu.propTypes = {
  children: _react.PropTypes.oneOfType([_react.PropTypes.func, _react.PropTypes.node]).isRequired,
  id: _react.PropTypes.string,
  className: _react.PropTypes.string,
  style: _react.PropTypes.object,
  tag: _react.PropTypes.string
};

Menu.defaultProps = {
  tag: 'div'
};

Menu.contextTypes = {
  ambManager: _react.PropTypes.object.isRequired
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"1":1,"react":"react","react-dom":"react-dom"}],5:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _keys = require(8);

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MenuItem = function (_React$Component) {
  _inherits(MenuItem, _React$Component);

  function MenuItem() {
    _classCallCheck(this, MenuItem);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(MenuItem).apply(this, arguments));
  }

  _createClass(MenuItem, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.managedIndex = this.context.ambManager.menuItems.push({
        node: _reactDom2.default.findDOMNode(this),
        content: this.props.children,
        text: this.props.text
      }) - 1;
    }
  }, {
    key: 'handleKeyDown',
    value: function handleKeyDown(event) {
      if (event.key !== _keys2.default.ENTER && event.key !== _keys2.default.SPACE) return;
      event.preventDefault();
      this.selectItem(event);
    }
  }, {
    key: 'selectItem',
    value: function selectItem(event) {
      // If there's no value, we'll send the child
      var value = typeof this.props.value !== 'undefined' ? this.props.value : this.props.children;
      this.context.ambManager.handleSelection(value, event);
      this.context.ambManager.currentFocus = this.managedIndex;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var tag = _props.tag;
      var children = _props.children;
      var className = _props.className;
      var id = _props.id;
      var style = _props.style;

      return _react2.default.createElement(tag, {
        className: className,
        id: id,
        style: style,
        onClick: this.selectItem.bind(this),
        onKeyDown: this.handleKeyDown.bind(this),
        role: 'menuitem',
        tabIndex: '-1'
      }, children);
    }
  }]);

  return MenuItem;
}(_react2.default.Component);

exports.default = MenuItem;

MenuItem.propTypes = {
  children: _react.PropTypes.node.isRequired,
  className: _react.PropTypes.string,
  id: _react.PropTypes.string,
  style: _react.PropTypes.object,
  tag: _react.PropTypes.string,
  text: _react.PropTypes.string,
  value: _react.PropTypes.any
};

MenuItem.defaultProps = {
  tag: 'div'
};

MenuItem.contextTypes = {
  ambManager: _react.PropTypes.object.isRequired
};

},{"8":8,"react":"react","react-dom":"react-dom"}],6:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _Manager = require(3);

var _Manager2 = _interopRequireDefault(_Manager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Wrapper = function (_React$Component) {
  _inherits(Wrapper, _React$Component);

  function Wrapper() {
    _classCallCheck(this, Wrapper);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Wrapper).apply(this, arguments));
  }

  _createClass(Wrapper, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.manager = new _Manager2.default({
        onSelection: this.props.onSelection,
        closeOnSelection: this.props.closeOnSelection
      });
    }
  }, {
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        ambManager: this.manager
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var tag = _props.tag;
      var id = _props.id;
      var className = _props.className;
      var style = _props.style;

      return _react2.default.createElement(tag, {
        id: id,
        className: className,
        style: style
      }, this.props.children);
    }
  }]);

  return Wrapper;
}(_react2.default.Component);

exports.default = Wrapper;

Wrapper.childContextTypes = {
  ambManager: _react.PropTypes.object.isRequired
};

Wrapper.propTypes = {
  children: _react.PropTypes.node.isRequired,
  onSelection: _react.PropTypes.func.isRequired,
  closeOnSelection: _react.PropTypes.bool,
  id: _react.PropTypes.string,
  className: _react.PropTypes.string,
  style: _react.PropTypes.object,
  tag: _react.PropTypes.string
};

Wrapper.defaultProps = {
  tag: 'div'
};

},{"3":3,"react":"react"}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (keyCode) {
  return keyCode >= 65 && keyCode <= 90;
};

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Look here
// https://github.com/facebook/react/blob/0.13-stable/src/browser/ui/dom/getEventKey.js

exports.default = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  UP: 'ArrowUp',
  DOWN: 'ArrowDown'
};

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Wrapper = require(6);

var _Wrapper2 = _interopRequireDefault(_Wrapper);

var _Button = require(2);

var _Button2 = _interopRequireDefault(_Button);

var _Menu = require(4);

var _Menu2 = _interopRequireDefault(_Menu);

var _MenuItem = require(5);

var _MenuItem2 = _interopRequireDefault(_MenuItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  Wrapper: _Wrapper2.default,
  Button: _Button2.default,
  Menu: _Menu2.default,
  MenuItem: _MenuItem2.default
};

},{"2":2,"4":4,"5":5,"6":6}]},{},[9])(9)
});