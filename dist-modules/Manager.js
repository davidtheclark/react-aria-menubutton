'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _keys = require('./keys');

var _keys2 = _interopRequireDefault(_keys);

var _isLetterKeyCode = require('./isLetterKeyCode');

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