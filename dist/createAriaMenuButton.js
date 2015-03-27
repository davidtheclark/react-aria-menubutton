(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.createAriaMenuButton = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

module.exports = createAriaMenuButton;

var keys = _interopRequireWildcard(require("./keys"));

var createMenu = _interopRequire(require("./createMenu"));

var focusManager = _interopRequire(require("./focusManager"));

function createAriaMenuButton(React, classNames) {

  var Menu = createMenu(React, classNames);
  var CSSTransitionGroup = React.addons ? React.addons.CSSTransitionGroup : false;

  var AriaMenuButton = (function (_React$Component) {
    function AriaMenuButton(props) {
      _classCallCheck(this, AriaMenuButton);

      _React$Component.call(this, props);
      this.state = { isOpen: !!props.isOpen };
      this.focusManager = focusManager();
    }

    _inherits(AriaMenuButton, _React$Component);

    AriaMenuButton.prototype.shouldComponentUpdate = function shouldComponentUpdate(newProps, newState) {
      return this.state.isOpen !== newState.isOpen || this.props.selectedValue !== newProps.selectedValue;
    };

    AriaMenuButton.prototype.componentWillMount = function componentWillMount() {
      if (this.props.transition && !CSSTransitionGroup) {
        throw new Error("If you want to use transitions with ariaMenuButton, you need to pass it " + "React with addons");
      }
    };

    AriaMenuButton.prototype.componentDidMount = function componentDidMount() {
      this.focusManager.trigger = React.findDOMNode(this.refs.trigger);
    };

    AriaMenuButton.prototype.openMenu = function openMenu() {
      var innerFocus = arguments[0] === undefined ? false : arguments[0];

      this.setState({ isOpen: true, innerFocus: innerFocus });
    };

    AriaMenuButton.prototype.closeMenu = function closeMenu() {
      var _this = this;

      var focusTrigger = arguments[0] === undefined ? true : arguments[0];

      this.setState({ isOpen: false, innerFocus: false }, function () {
        if (focusTrigger) _this.focusManager.focusTrigger();
        _this.focusManager.currentFocus = -1;
      });
    };

    AriaMenuButton.prototype.toggleMenu = function toggleMenu() {
      if (this.state.isOpen) this.closeMenu();else this.openMenu();
    };

    AriaMenuButton.prototype.handleAnywhereKey = function handleAnywhereKey(e) {
      var key = e.key;
      var isLetterKey = isLetterKeyEvent(e);

      if (key !== keys.DOWN && !isLetterKey) {
        return;
      }e.preventDefault();

      if (key === keys.DOWN) {
        // "With focus on the button and the drop-down menu open,
        // pressing Down Arrow will move focus into the menu onto
        // the first menu item. [...]"
        // "With focus on the drop-down menu, the Up and Down Arrow
        // keys move focus within the menu items, "wrapping" at the top and bottom."
        if (this.state.isOpen) this.focusManager.moveDown();

        // "With focus on the button and no drop-down menu displayed,
        // pressing Down Arrow will open the drop-down menu and move focus
        // into the menu and onto the first menu item."
        else this.openMenu(true);
      } else if (isLetterKey && this.state.isOpen) this.checkLetterKeys(e.keyCode);
    };

    // "With focus on the button pressing Space or Enter will toggle
    // the display of the drop-down menu. Focus remains on the button."

    AriaMenuButton.prototype.handleTriggerKey = function handleTriggerKey(e) {
      var key = e.key;
      if (key !== keys.ENTER && key !== keys.SPACE) {
        return;
      }e.preventDefault();
      this.toggleMenu();
    };

    AriaMenuButton.prototype.handleMenuKey = function handleMenuKey(e) {
      // "With focus on the drop-down menu, pressing Escape closes
      // the menu and returns focus to the button.
      if (e.key === keys.ESCAPE) this.closeMenu();

      // "With focus on the drop-down menu, the Up and Down Arrow
      // keys move focus within the menu items, "wrapping" at the top and bottom."
      else if (e.key === keys.UP && this.state.isOpen) {
        e.preventDefault();
        this.focusManager.moveUp();
      }
    };

    AriaMenuButton.prototype.checkLetterKeys = function checkLetterKeys(kc) {
      // "Typing a letter (printable character) key moves focus to the next
      // instance of a visible node whose title begins with that printable letter."
      this.focusManager.moveToLetter(String.fromCharCode(kc));
    };

    AriaMenuButton.prototype.handleBlur = function handleBlur() {
      var _this = this;

      setTimeout(function () {
        var activeEl = document.activeElement;
        if (activeEl === _this.focusManager.trigger) return;
        if (_this.focusManager.focusables.some(function (f) {
          return f.node === activeEl;
        })) return;
        _this.closeMenu(false);
      }, 0);
    };

    AriaMenuButton.prototype.handleSelection = function handleSelection(v) {
      if (this.props.closeOnSelection) this.closeMenu();
      this.props.handleSelection(v);
    };

    AriaMenuButton.prototype.render = function render() {
      var props = this.props;
      var isOpen = this.state.isOpen;

      var menu = isOpen ? React.createElement(Menu, _extends({}, props, {
        handleSelection: this.handleSelection.bind(this),
        receiveFocus: this.state.innerFocus,
        focusManager: this.focusManager })) : false;

      var menuWrapper = props.transition ? React.createElement(
        CSSTransitionGroup,
        { transitionName: "is",
          component: "div",
          className: "AriaMenuButton-menuWrapper AriaMenuButton-menuWrapper--trans",
          onKeyDown: this.handleMenuKey.bind(this) },
        menu
      ) : React.createElement(
        "div",
        { className: "AriaMenuButton-menuWrapper",
          onKeyDown: this.handleMenuKey.bind(this) },
        menu
      );

      var triggerClasses = classNames({
        "AriaMenuButton-trigger": true,
        "is-open": isOpen
      });

      return React.createElement(
        "div",
        { id: props.id,
          className: "AriaMenuButton",
          onKeyDown: this.handleAnywhereKey.bind(this),
          onBlur: this.handleBlur.bind(this) },
        React.createElement(
          "div",
          { id: "" + props.id + "-trigger",
            className: triggerClasses,
            onClick: this.toggleMenu.bind(this),
            onKeyDown: this.handleTriggerKey.bind(this),
            ref: "trigger",
            "aria-haspopup": true,
            "aria-expanded": isOpen,
            role: "button",
            tabIndex: "0" },
          props.triggerLabel
        ),
        menuWrapper
      );
    };

    return AriaMenuButton;
  })(React.Component);

  var pt = React.PropTypes;
  AriaMenuButton.propTypes = {
    id: pt.string.isRequired,
    items: pt.arrayOf(pt.object).isRequired,
    triggerLabel: pt.string.isRequired,
    closeOnSelection: pt.bool,
    flushRight: pt.bool,
    handleSelection: pt.func,
    isOpen: pt.bool,
    selectedValue: pt.oneOfType([pt.string, pt.number, pt.bool]),
    transition: pt.bool
  };

  return AriaMenuButton;
}

function isLetterKeyEvent(e) {
  return e.keyCode >= keys.LOWEST_LETTER_CODE && e.keyCode <= keys.HIGHEST_LETTER_CODE;
}

},{"./createMenu":2,"./focusManager":4,"./keys":5}],2:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

module.exports = ariaMenuButtonMenu;

var createMenuItem = _interopRequire(require("./createMenuItem"));

function ariaMenuButtonMenu(React, classNames) {

  var MenuItem = createMenuItem(React, classNames);

  var Menu = (function (_React$Component) {
    function Menu() {
      _classCallCheck(this, Menu);

      if (_React$Component != null) {
        _React$Component.apply(this, arguments);
      }
    }

    _inherits(Menu, _React$Component);

    Menu.prototype.shouldComponentUpdate = function shouldComponentUpdate(newProps) {
      return this.props.selectedValue !== newProps.selectedValue;
    };

    Menu.prototype.componentWillMount = function componentWillMount() {
      this.props.focusManager.focusables = [];
    };

    Menu.prototype.componentDidMount = function componentDidMount() {
      if (this.props.receiveFocus) this.props.focusManager.move(0);
    };

    Menu.prototype.render = function render() {
      var props = this.props;
      var selectedValue = props.selectedValue;

      var items = props.items.map(function (item, i) {
        return React.createElement(
          "li",
          { key: i,
            className: "AriaMenuButton-li",
            role: "presentation" },
          React.createElement(MenuItem, _extends({}, item, {
            focusManager: props.focusManager,
            handleSelection: props.handleSelection,
            isSelected: item.value === selectedValue }))
        );
      });

      var menuClasses = classNames({
        "AriaMenuButton-menu": true,
        "AriaMenuButton-menu--flushRight": props.flushRight
      });

      return React.createElement(
        "ol",
        { className: menuClasses,
          role: "menu" },
        items
      );
    };

    return Menu;
  })(React.Component);

  var pt = React.PropTypes;
  Menu.propTypes = {
    focusManager: pt.object.isRequired,
    id: pt.string.isRequired,
    items: pt.arrayOf(pt.object).isRequired,
    flushRight: pt.bool,
    handleSelection: pt.func,
    receiveFocus: pt.bool,
    selectedValue: pt.any
  };

  return Menu;
}

},{"./createMenuItem":3}],3:[function(require,module,exports){
"use strict";

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

module.exports = createMenuItem;

var _keys = require("./keys");

var ENTER = _keys.ENTER;
var SPACE = _keys.SPACE;

function createMenuItem(React, classNames) {
  var MenuItem = (function (_React$Component) {
    function MenuItem() {
      _classCallCheck(this, MenuItem);

      if (_React$Component != null) {
        _React$Component.apply(this, arguments);
      }
    }

    _inherits(MenuItem, _React$Component);

    MenuItem.prototype.shouldComponentUpdate = function shouldComponentUpdate(newProps) {
      return this.props.isSelected !== newProps.isSelected;
    };

    MenuItem.prototype.componentDidMount = function componentDidMount() {
      this.props.focusManager.focusables.push({
        content: this.props.content,
        text: this.props.text,
        node: React.findDOMNode(this)
      });
    };

    MenuItem.prototype.handleClick = function handleClick(e) {
      var props = this.props;
      if (props.isSelected) {
        return;
      } // If there's no value, we'll send the label
      var v = typeof props.value !== "undefined" ? props.value : props.content;
      props.handleSelection(v, e);
    };

    MenuItem.prototype.handleKey = function handleKey(e) {
      if (e.key !== ENTER && e.key !== SPACE) {
        return;
      }e.preventDefault();
      this.handleClick(e);
    };

    MenuItem.prototype.render = function render() {
      var props = this.props;
      var itemClasses = classNames({
        "AriaMenuButton-menuItem": true,
        "is-selected": props.isSelected
      });

      // tabindex -1 because: "With focus on the button pressing
      // the Tab key will take the user to the next tab focusable item on the page.
      // With focus on the drop-down menu, pressing the Tab key will take the user
      // to the next tab focusable item on the page."
      // "A menuitem within a menu or menubar may appear in the tab order
      // only if it is not within a popup menu."
      // ... so not in tab order, but programatically focusable
      return React.createElement(
        "div",
        { id: props.id,
          className: itemClasses,
          onClick: this.handleClick.bind(this),
          onKeyDown: this.handleKey.bind(this),
          role: "menuitem",
          tabIndex: "-1",
          "data-value": props.value },
        props.content
      );
    };

    return MenuItem;
  })(React.Component);

  var pt = React.PropTypes;
  MenuItem.propTypes = {
    focusManager: pt.object.isRequired,
    handleSelection: pt.func.isRequired,
    content: pt.oneOfType([pt.string, pt.element]).isRequired,
    id: pt.string,
    isSelected: pt.bool,
    text: pt.string,
    value: pt.oneOfType([pt.string, pt.number, pt.bool])
  };

  return MenuItem;
}

},{"./keys":5}],4:[function(require,module,exports){
"use strict";

module.exports = focusManager;
var focusManagerProto = {

  focusables: [],

  trigger: null,

  currentFocus: -1,

  move: function move(i) {
    this.focusables[i].node.focus();
    this.currentFocus = i;
  },

  moveUp: function moveUp() {
    var next = this.currentFocus === -1 || this.currentFocus === 0 ? this.focusables.length - 1 : this.currentFocus - 1;
    this.move(next);
  },

  moveDown: function moveDown() {
    var next = this.currentFocus === -1 || this.currentFocus === this.focusables.length - 1 ? 0 : this.currentFocus + 1;
    this.move(next);
  },

  moveToLetter: function moveToLetter(letter) {
    var cyclo = this.focusables.slice(this.currentFocus + 1).concat(this.focusables.slice(0, this.currentFocus + 1));
    for (var i = 0, l = cyclo.length; i < l; i++) {
      var item = cyclo[i];
      if (!item.text && !item.content.charAt) {
        throw new Error("AriaMenuButton items must have textual `content` or a `text` prop");
      }
      if (item.text) {
        if (item.text.charAt(0) !== letter) continue;
      } else if (item.content.charAt(0) !== letter) continue;
      item.node.focus();
      this.currentFocus = this.focusables.indexOf(item);
      return;
    }
  },

  focusTrigger: function focusTrigger() {
    this.trigger.focus();
  }

};

function focusManager() {
  return Object.create(focusManagerProto);
}

},{}],5:[function(require,module,exports){
"use strict";

exports.__esModule = true;
// Lookey here
// https://github.com/facebook/react/blob/0.13-stable/src/browser/ui/dom/getEventKey.js

var ENTER = "Enter";
exports.ENTER = ENTER;
var SPACE = " ";
exports.SPACE = SPACE;
var ESCAPE = "Escape";
exports.ESCAPE = ESCAPE;
var UP = "ArrowUp";
exports.UP = UP;
var DOWN = "ArrowDown";
exports.DOWN = DOWN;
var LOWEST_LETTER_CODE = 65;
exports.LOWEST_LETTER_CODE = LOWEST_LETTER_CODE;
var HIGHEST_LETTER_CODE = 91;
exports.HIGHEST_LETTER_CODE = HIGHEST_LETTER_CODE;

},{}]},{},[1])(1)
});