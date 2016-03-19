var ReactDOM = require('react-dom');
var createFocusGroup = require('focus-group');
var externalStateControl = require('./externalStateControl');

var focusGroupOptions = {
  wrap: true,
  stringSearch: true,
};

var protoManager = {

  init: function(options) {
    this.options = options || {};

    if (typeof this.options.closeOnSelection === 'undefined') {
      this.options.closeOnSelection = true;
    }

    if (this.options.id) {
      externalStateControl.registerManager(this.options.id, this);
    }

    this.handleBlur = handleBlur.bind(this);
    this.handleSelection = handleSelection.bind(this);
    this.handleMenuKey = handleMenuKey.bind(this);

    // "With focus on the drop-down menu, the Up and Down Arrow
    // keys move focus within the menu items, "wrapping" at the top and bottom."
    // "Typing a letter (printable character) key moves focus to the next
    // instance of a visible node whose title begins with that printable letter."
    //
    // All of the above is handled by focus-group.
    this.focusGroup = createFocusGroup(focusGroupOptions);

    // These component references are added when the relevant components mount
    this.button = null;
    this.menu = null;

    // State trackers
    this.isOpen = false;
  },

  focusItem: function(index) {
    this.focusGroup.focusNodeAtIndex(index);
  },

  addItem: function(item) {
    this.focusGroup.addMember(item);
  },

  clearItems: function() {
    this.focusGroup.clearMembers()
  },

  handleButtonNonArrowKey: function(event) {
    this.focusGroup._handleNonArrowKey(event);
  },

  destroy: function() {
    this.button = null;
    this.menu = null;
    this.focusGroup.deactivate();
    clearTimeout(this.blurTimer)
    clearTimeout(this.moveFocusTimer)
  },

  update: function() {
    this.menu.setState({ isOpen: this.isOpen });
    this.button.setState({ menuOpen: this.isOpen });
  },

  openMenu: function(openOptions) {
    if (this.isOpen) return;
    openOptions = openOptions || {};
    this.isOpen = true;
    this.update();
    this.focusGroup.activate();
    if (openOptions.focusMenu) {
      var self = this;
      this.moveFocusTimer = setTimeout(function() {
        self.focusItem(0)
      }, 0);
    }
  },

  closeMenu: function(closeOptions) {
    if (!this.isOpen) return;
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
}

function handleBlur() {
  var self = this;
  self.blurTimer = setTimeout(function() {
    var activeEl = document.activeElement;
    var buttonNode = ReactDOM.findDOMNode(self.button);
    var menuNode = ReactDOM.findDOMNode(self.menu);
    if (buttonNode && activeEl === buttonNode) return;
    if (menuNode && menuNode.contains(activeEl)) return;
    if (self.isOpen) self.closeMenu({ focusButton: false });
  }, 0);
}

function handleSelection(value, event) {
  if (this.options.closeOnSelection) this.closeMenu({ focusButton: true });
  this.options.onSelection(value, event);
}

function handleMenuKey(event) {
  // "With focus on the drop-down menu, pressing Escape closes
  // the menu and returns focus to the button.
  if (this.isOpen && event.key === 'Escape') {
    event.preventDefault();
    this.closeMenu({ focusButton: true });
  }
}

module.exports = function(options) {
  var newManager = Object.create(protoManager);
  newManager.init(options);
  return newManager;
};
