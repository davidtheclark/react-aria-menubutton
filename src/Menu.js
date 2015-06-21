import React, { PropTypes } from 'react';
import keys from './keys';

export default class AriaMenu extends React.Component {
  componentDidMount() {
    if (this.props.receiveFocus) this.props.manager.moveFocus(0);
  }

  componentWillUnmount() {
    // Clear the manager's items, so they
    // can be reloaded next time this menu opens
    this.props.manager.items = [];
  }

  handleMenuKey(event) {
    const { manager, close } = this.props;

    switch (event.key) {
      // "With focus on the drop-down menu, pressing Escape closes
      // the menu and returns focus to the button.
      case keys.ESCAPE:
        event.preventDefault();
        close();
        break;
      // "With focus on the drop-down menu, the Up and Down Arrow
      // keys move focus within the menu items, "wrapping" at the top and bottom."
      case keys.UP:
        event.preventDefault();
        manager.moveFocusUp();
        break;
      case keys.DOWN:
        event.preventDefault();
        manager.moveFocusDown();
        break;
      default:
        if (!isLetterKeyEvent(event)) return;
        // "Typing a letter (printable character) key moves focus to the next
        // instance of a visible node whose title begins with that printable letter."
        manager.moveToLetter(String.fromCharCode(event.keyCode));
    }
  }

  render() {
    return React.createElement('div', {
      onKeyDown: this.handleMenuKey.bind(this),
      // "A menu is a container of options. The container may have a role of
      // menu or menubar depending on your implementation."
      role: 'menu',
    }, this.props.children);
  }
}

AriaMenu.propTypes = {
  children: PropTypes.element.isRequired,
  close: PropTypes.func.isRequired,
  manager: PropTypes.object.isRequired,
  receiveFocus: PropTypes.bool,
};

function isLetterKeyEvent(e) {
  return e.keyCode >= keys.LOWEST_LETTER_CODE && e.keyCode <= keys.HIGHEST_LETTER_CODE;
}
