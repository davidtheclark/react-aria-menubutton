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

	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

	var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.__esModule = true;
	exports['default'] = createAriaMenuButton;

	var _React = __webpack_require__(1);

	var _React2 = _interopRequireWildcard(_React);

	var _import = __webpack_require__(2);

	var keys = _interopRequireWildcard(_import);

	var _Menu = __webpack_require__(3);

	var _Menu2 = _interopRequireWildcard(_Menu);

	var _focusManager = __webpack_require__(4);

	var _focusManager2 = _interopRequireWildcard(_focusManager);

	var _cssClassnamer = __webpack_require__(5);

	var _cssClassnamer2 = _interopRequireWildcard(_cssClassnamer);

	function createAriaMenuButton() {
	  var opts = arguments[0] === undefined ? {} : arguments[0];

	  var CSSTransitionGroup = opts.reactAddons ? opts.reactAddons.CSSTransitionGroup : false;
	  _cssClassnamer2['default'].init(opts.componentName, opts.namespace);

	  var AriaMenuButton = (function (_React$Component) {
	    function AriaMenuButton(props) {
	      _classCallCheck(this, AriaMenuButton);

	      _React$Component.call(this, props);
	      this.state = { isOpen: !!props.startOpen };
	      this.focusManager = _focusManager2['default']();
	    }

	    _inherits(AriaMenuButton, _React$Component);

	    AriaMenuButton.prototype.shouldComponentUpdate = function shouldComponentUpdate(newProps, newState) {
	      return this.state.isOpen !== newState.isOpen || this.props.selectedValue !== newProps.selectedValue;
	    };

	    AriaMenuButton.prototype.componentWillMount = function componentWillMount() {
	      if (this.props.transition && !CSSTransitionGroup) {
	        throw new Error('If you want to use transitions with ariaMenuButton, you need to pass it ' + 'React with addons');
	      }
	    };

	    AriaMenuButton.prototype.componentDidMount = function componentDidMount() {
	      this.focusManager.trigger = _React2['default'].findDOMNode(this.refs.trigger);
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
	      var _this2 = this;

	      this.blurTimeout = setTimeout(function () {
	        var activeEl = document.activeElement;
	        if (activeEl === _this2.focusManager.trigger) return;
	        if (_this2.focusManager.focusables.some(function (f) {
	          return f.node === activeEl;
	        })) return;
	        if (_this2.state.isOpen) _this2.closeMenu(false);
	      }, 0);
	    };

	    AriaMenuButton.prototype.handleSelection = function handleSelection(v) {
	      if (this.props.closeOnSelection) this.closeMenu();
	      this.props.handleSelection(v);
	    };

	    AriaMenuButton.prototype.handleOverlayClick = function handleOverlayClick() {
	      console.log('overlay click triggered');
	      this.closeMenu(false);
	    };

	    AriaMenuButton.prototype.render = function render() {
	      var props = this.props;
	      var isOpen = this.state.isOpen;

	      var triggerId = props.id ? '' + props.id + '-trigger' : undefined;
	      var outsideId = props.id ? '' + props.id + '-outside' : undefined;
	      var triggerClasses = [_cssClassnamer2['default'].componentPart('trigger')];
	      if (isOpen) triggerClasses.push(_cssClassnamer2['default'].applyNamespace('is-open'));

	      var menu = isOpen ? _React2['default'].createElement(_Menu2['default'], _extends({}, props, {
	        handleSelection: this.handleSelection.bind(this),
	        receiveFocus: this.state.innerFocus,
	        focusManager: this.focusManager })) : false;

	      var menuWrapper = props.transition ? _React2['default'].createElement(
	        CSSTransitionGroup,
	        { transitionName: _cssClassnamer2['default'].applyNamespace('is'),
	          component: 'div',
	          className: [_cssClassnamer2['default'].componentPart('menuWrapper'), _cssClassnamer2['default'].componentPart('menuWrapper--trans')].join(' '),
	          onKeyDown: this.handleMenuKey.bind(this) },
	        menu
	      ) : _React2['default'].createElement(
	        'div',
	        { className: _cssClassnamer2['default'].componentPart('menuWrapper'),
	          onKeyDown: this.handleMenuKey.bind(this) },
	        menu
	      );

	      // The outsideOverlay and its accompanying innerStyle are here
	      // to make the menu close when there is a click outside it
	      // (mobile browsers will not fire the onBlur handler).
	      // They are styled inline here because they should be the same
	      // in every situation.

	      var innerStyle = !isOpen ? {} : {
	        display: 'inline-block',
	        position: 'relative',
	        zIndex: '100'
	      };

	      var outsideOverlay = !isOpen ? false : _React2['default'].createElement('div', { id: outsideId,
	        onClick: this.handleOverlayClick.bind(this),
	        ref: 'overlay',
	        style: {
	          cursor: 'pointer',
	          position: 'fixed',
	          top: 0, bottom: 0, left: 0, right: 0,
	          zIndex: '99',
	          WebkitTapHighlightColor: 'rgba(0,0,0,0)'
	        } });

	      return _React2['default'].createElement(
	        'div',
	        { id: props.id,
	          className: _cssClassnamer2['default'].componentPart(),
	          onKeyDown: this.handleAnywhereKey.bind(this),
	          onBlur: this.handleBlur.bind(this) },
	        outsideOverlay,
	        _React2['default'].createElement(
	          'div',
	          { style: innerStyle },
	          _React2['default'].createElement(
	            'div',
	            { id: triggerId,
	              className: triggerClasses.join(' '),
	              onClick: this.toggleMenu.bind(this),
	              onKeyDown: this.handleTriggerKey.bind(this),
	              ref: 'trigger',
	              'aria-haspopup': true,
	              'aria-expanded': isOpen,
	              role: 'button',
	              tabIndex: '0' },
	            props.triggerContent
	          ),
	          menuWrapper
	        )
	      );
	    };

	    return AriaMenuButton;
	  })(_React2['default'].Component);

	  var pt = _React2['default'].PropTypes;

	  AriaMenuButton.propTypes = {
	    handleSelection: pt.func.isRequired,
	    items: pt.arrayOf(pt.object).isRequired,
	    triggerContent: pt.oneOfType([pt.string, pt.element]).isRequired,
	    closeOnSelection: pt.bool,
	    flushRight: pt.bool,
	    id: pt.string,
	    startOpen: pt.bool,
	    selectedValue: pt.oneOfType([pt.string, pt.number, pt.bool]),
	    transition: pt.bool
	  };

	  return AriaMenuButton;
	}

	function isLetterKeyEvent(e) {
	  return e.keyCode >= keys.LOWEST_LETTER_CODE && e.keyCode <= keys.HIGHEST_LETTER_CODE;
	}
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	// Lookey here
	// https://github.com/facebook/react/blob/0.13-stable/src/browser/ui/dom/getEventKey.js

	var ENTER = 'Enter';
	exports.ENTER = ENTER;
	var SPACE = ' ';
	exports.SPACE = SPACE;
	var ESCAPE = 'Escape';
	exports.ESCAPE = ESCAPE;
	var UP = 'ArrowUp';
	exports.UP = UP;
	var DOWN = 'ArrowDown';
	exports.DOWN = DOWN;
	var LOWEST_LETTER_CODE = 65;
	exports.LOWEST_LETTER_CODE = LOWEST_LETTER_CODE;
	var HIGHEST_LETTER_CODE = 91;
	exports.HIGHEST_LETTER_CODE = HIGHEST_LETTER_CODE;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

	var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.__esModule = true;

	var _React = __webpack_require__(1);

	var _React2 = _interopRequireWildcard(_React);

	var _MenuItem = __webpack_require__(6);

	var _MenuItem2 = _interopRequireWildcard(_MenuItem);

	var _cssClassnamer = __webpack_require__(5);

	var _cssClassnamer2 = _interopRequireWildcard(_cssClassnamer);

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
	      return _React2['default'].createElement(
	        'li',
	        { key: i,
	          className: _cssClassnamer2['default'].componentPart('li'),
	          role: 'presentation' },
	        _React2['default'].createElement(_MenuItem2['default'], _extends({}, item, {
	          focusManager: props.focusManager,
	          handleSelection: props.handleSelection,
	          isSelected: item.value === selectedValue }))
	      );
	    });

	    var menuClasses = [_cssClassnamer2['default'].componentPart('menu')];
	    if (props.flushRight) menuClasses.push(_cssClassnamer2['default'].componentPart('menu--flushRight'));

	    return _React2['default'].createElement(
	      'ol',
	      { className: menuClasses.join(' '),
	        role: 'menu' },
	      items
	    );
	  };

	  return Menu;
	})(_React2['default'].Component);

	exports['default'] = Menu;

	var pt = _React2['default'].PropTypes;

	Menu.propTypes = {
	  focusManager: pt.object.isRequired,
	  items: pt.arrayOf(pt.object).isRequired,
	  flushRight: pt.bool,
	  handleSelection: pt.func,
	  receiveFocus: pt.bool,
	  selectedValue: pt.any
	};
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = focusManager;
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
	        throw new Error('AriaMenuButton items must have textual `content` or a `text` prop');
	      }
	      if (item.text) {
	        if (item.text.charAt(0).toLowerCase() !== letter.toLowerCase()) continue;
	      } else if (item.content.charAt(0).toLowerCase() !== letter.toLowerCase()) continue;
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

	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = {

	  init: function init(_x, namespace) {
	    var componentName = arguments[0] === undefined ? 'AriaMenuButton' : arguments[0];

	    this.namespace = namespace;
	    this.componentName = this.applyNamespace(componentName);
	  },

	  componentPart: function componentPart(remainder) {
	    if (!remainder) {
	      return this.componentName;
	    }return '' + this.componentName + '-' + remainder;
	  },

	  applyNamespace: function applyNamespace(str) {
	    if (!this.namespace) {
	      return str;
	    }return '' + this.namespace + '-' + str;
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

	var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

	exports.__esModule = true;

	var _React = __webpack_require__(1);

	var _React2 = _interopRequireWildcard(_React);

	var _ENTER$SPACE = __webpack_require__(2);

	var _cssClassnamer = __webpack_require__(5);

	var _cssClassnamer2 = _interopRequireWildcard(_cssClassnamer);

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
	      node: _React2['default'].findDOMNode(this)
	    });
	  };

	  MenuItem.prototype.handleClick = function handleClick(e) {
	    var props = this.props;
	    if (props.isSelected) {
	      return;
	    } // If there's no value, we'll send the label
	    var v = typeof props.value !== 'undefined' ? props.value : props.content;
	    props.handleSelection(v, e);
	  };

	  MenuItem.prototype.handleKey = function handleKey(e) {
	    if (e.key !== _ENTER$SPACE.ENTER && e.key !== _ENTER$SPACE.SPACE) {
	      return;
	    }e.preventDefault();
	    this.handleClick(e);
	  };

	  MenuItem.prototype.render = function render() {
	    var props = this.props;
	    var itemClasses = [_cssClassnamer2['default'].componentPart('menuItem')];
	    if (props.isSelected) itemClasses.push(_cssClassnamer2['default'].applyNamespace('is-selected'));

	    // tabindex -1 because: "With focus on the button pressing
	    // the Tab key will take the user to the next tab focusable item on the page.
	    // With focus on the drop-down menu, pressing the Tab key will take the user
	    // to the next tab focusable item on the page."
	    // "A menuitem within a menu or menubar may appear in the tab order
	    // only if it is not within a popup menu."
	    // ... so not in tab order, but programatically focusable
	    return _React2['default'].createElement(
	      'div',
	      { id: props.id,
	        className: itemClasses.join(' '),
	        onClick: this.handleClick.bind(this),
	        onKeyDown: this.handleKey.bind(this),
	        role: 'menuitem',
	        tabIndex: '-1',
	        'data-value': props.value },
	      props.content
	    );
	  };

	  return MenuItem;
	})(_React2['default'].Component);

	exports['default'] = MenuItem;

	var pt = _React2['default'].PropTypes;

	MenuItem.propTypes = {
	  focusManager: pt.object.isRequired,
	  handleSelection: pt.func.isRequired,
	  content: pt.oneOfType([pt.string, pt.element]).isRequired,
	  id: pt.string,
	  isSelected: pt.bool,
	  text: pt.string,
	  value: pt.oneOfType([pt.string, pt.number, pt.bool])
	};
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;