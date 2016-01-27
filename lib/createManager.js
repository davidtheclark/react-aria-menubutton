var ReactDOM = require('react-dom');

var protoManager = {

  init: function(options) {
    this.options = options || {};

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
  },

  destroy: function() {
    this.button = null;
    this.menu = null;
    this.menuItems = [];
    clearTimeout(this.blurTimer)
    clearTimeout(this.moveFocusTimer)
  },

  update: function() {
    this.menu.setState({ isOpen: this.isOpen });
    this.button.setState({ menuOpen: this.isOpen });
  },

  openMenu: function(openOptions) {
    openOptions = openOptions || {};
    this.isOpen = true;
    this.update();
    if (openOptions.focusMenu) {
      var self = this;
      this.moveFocusTimer = setTimeout(function() {
        self.moveFocus(0)
      }, 0);
    } else {
      this.currentFocus = -1;
    }
  },

  closeMenu: function(closeOptions) {
    closeOptions = closeOptions || {};
    this.isOpen = false;
    this.update();
    if (closeOptions.focusButton) {
      ReactDOM.findDOMNode(this.button).focus();
    }
  },

  toggleMenu: function() {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  },

  moveFocus: function(itemIndex) {
    this.menuItems[itemIndex].node.focus();
    this.currentFocus = itemIndex;
  },

  moveFocusUp: function() {
    var next = (this.currentFocus === -1 || this.currentFocus === 0)
      ? this.menuItems.length - 1
      : this.currentFocus - 1;
    this.moveFocus(next);
  },

  moveFocusDown: function() {
    var next = (this.currentFocus === -1 || this.currentFocus === this.menuItems.length - 1)
      ? 0
      : this.currentFocus + 1;
    this.moveFocus(next);
  },

  moveToLetter: function(letter) {
    // An array of the menuItems starting with this one
    // and looping through the end back around
    var ouroborosItems = this.menuItems
      .slice(this.currentFocus + 1)
      .concat(this.menuItems.slice(0, this.currentFocus + 1));

    var item, i, l;
    for (i = 0, l = ouroborosItems.length; i < l; i++) {
      item = ouroborosItems[i];
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
      this.moveFocus(this.menuItems.indexOf(item));
      return;
    }
  },
}

function handleBlur() {
  var self = this;
  self.blurTimer = setTimeout(function() {
    var activeEl = document.activeElement;
    if (activeEl === ReactDOM.findDOMNode(self.button)) return;
    if (self.menuItems.some(function(menuItem) {
      return  menuItem.node === activeEl;
    })) return;
    if (self.isOpen) self.closeMenu({ focusButton: false });
  }, 0);
}

function handleSelection(value, event) {
  if (this.options.closeOnSelection) this.closeMenu({ focusButton: true });
  this.options.onSelection(value, event);
}

function handleMenuKey(event) {
  if (!this.isOpen) return;
  switch (event.key) {
    // "With focus on the drop-down menu, pressing Escape closes
    // the menu and returns focus to the button.
    case 'Escape':
      event.preventDefault();
      this.closeMenu({ focusButton: true });
      break;
    // "With focus on the drop-down menu, the Up and Down Arrow
    // keys move focus within the menu items, "wrapping" at the top and bottom."
    case 'ArrowUp':
      event.preventDefault();
      this.moveFocusUp();
      break;
    case 'ArrowDown':
      event.preventDefault();
      this.moveFocusDown();
      break;
    default:
      if (!isLetterKeyCode(event.keyCode)) return;
      // If the letter key is part of a key combo, let it do whatever it was
      // going to do
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      event.preventDefault();
      // "Typing a letter (printable character) key moves focus to the next
      // instance of a visible node whose title begins with that printable letter."
      this.moveToLetter(String.fromCharCode(event.keyCode));
  }
}

function isLetterKeyCode(keyCode) {
  return keyCode >= 65 && keyCode <= 90;
}

module.exports = function(options) {
  var newManager = Object.create(protoManager);
  newManager.init(options);
  return newManager;
};
