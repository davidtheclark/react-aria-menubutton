import React from 'react';
import keys from './keys';
import isLetterKeyCode from './isLetterKeyCode';

export default class Manager {
  constructor(options={}) {
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

  update() {
    this.menu.setState({ isOpen: this.isOpen });
    this.button.setState({ menuOpen: this.isOpen });
  }

  openMenu({ focusMenu=false }={}) {
    this.isOpen = true;
    this.update();
    if (focusMenu) {
      setTimeout(() => this.moveFocus(0), 0);
    } else {
      this.currentFocus = -1;
    }
  }

  closeMenu({ focusButton=true }={}) {
    this.isOpen = false;
    this.update();
    if (focusButton) {
      React.findDOMNode(this.button).focus();
    }
  }

  toggleMenu() {
    if (this.isOpen) this.closeMenu();
    else this.openMenu();
  }

  moveFocus(itemIndex) {
    this.menuItems[itemIndex].node.focus();
    this.currentFocus = itemIndex;
  }

  moveFocusUp() {
    const { menuItems, currentFocus } = this;
    const next = (currentFocus === -1 || currentFocus === 0)
      ? menuItems.length - 1
      : currentFocus - 1;
    this.moveFocus(next);
  }

  moveFocusDown() {
    const { menuItems, currentFocus } = this;
    const next = (currentFocus === -1 || currentFocus === menuItems.length - 1)
      ? 0
      : currentFocus + 1;
    this.moveFocus(next);
  }

  moveToLetter(letter) {
    const { menuItems, currentFocus } = this;

    // An array of the menuItems starting with this one
    // and looping through the end back around
    const ouroborosItems = menuItems.slice(currentFocus + 1)
      .concat(menuItems.slice(0, currentFocus + 1));

    for (let i = 0, l = ouroborosItems.length; i < l; i++) {
      const item = ouroborosItems[i];
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
}

function handleBlur() {
  setTimeout(() => {
    const activeEl = document.activeElement;
    if (activeEl === React.findDOMNode(this.button)) return;
    if (this.menuItems.some(menuItem => menuItem.node === activeEl)) return;
    if (this.isOpen) this.closeMenu({ focusButton: false });
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
    case keys.ESCAPE:
      event.preventDefault();
      this.closeMenu();
      break;
    // "With focus on the drop-down menu, the Up and Down Arrow
    // keys move focus within the menu items, "wrapping" at the top and bottom."
    case keys.UP:
      event.preventDefault();
      this.moveFocusUp();
      break;
    case keys.DOWN:
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
