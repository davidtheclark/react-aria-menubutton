const ReactDOM = require('react-dom');
const createFocusGroup = require('focus-group');
const externalStateControl = require('./externalStateControl');

const focusGroupOptions = {
  wrap: true,
  stringSearch: true
};

const protoManager = {
  init(options) {
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
    this.focusGroup = this.options.focusGroupOptions
      ? createFocusGroup(this.options.focusGroupOptions)
      : createFocusGroup(focusGroupOptions);

    // These component references are added when the relevant components mount
    this.button = null;
    this.menu = null;

    // State trackers
    this.isOpen = false;
  },

  focusItem(index) {
    this.focusGroup.focusNodeAtIndex(index);
  },

  addItem(item) {
    this.focusGroup.addMember(item);
  },

  clearItems() {
    this.focusGroup.clearMembers();
  },

  handleButtonNonArrowKey(event) {
    this.focusGroup._handleUnboundKey(event);
  },

  destroy() {
    this.button = null;
    this.menu = null;
    this.focusGroup.deactivate();
    clearTimeout(this.blurTimer);
    clearTimeout(this.moveFocusTimer);
  },

  update() {
    this.menu.setState({ isOpen: this.isOpen });
    this.button.setState({ menuOpen: this.isOpen });
    this.options.onMenuToggle &&
      this.options.onMenuToggle({ isOpen: this.isOpen });
  },

  openMenu(openOptions) {
    if (this.isOpen) return;
    openOptions = openOptions || {};
    this.isOpen = true;
    this.update();
    this.focusGroup.activate();
    if (openOptions.focusMenu) {
      const self = this;
      this.moveFocusTimer = setTimeout(function() {
        self.focusItem(0);
      }, 0);
    }
  },

  closeMenu(closeOptions) {
    if (!this.isOpen) return;
    closeOptions = closeOptions || {};
    this.isOpen = false;
    this.update();
    if (closeOptions.focusButton) {
      ReactDOM.findDOMNode(this.button).focus();
    }
  },

  toggleMenu() {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }
};

function handleBlur() {
  const self = this;
  self.blurTimer = setTimeout(function() {
    const buttonNode = ReactDOM.findDOMNode(self.button);
    const menuNode = ReactDOM.findDOMNode(self.menu);
    const activeEl = buttonNode.ownerDocument.activeElement;
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
  const newManager = Object.create(protoManager);
  newManager.init(options);
  return newManager;
};
