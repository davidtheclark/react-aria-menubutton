import React, { PropTypes } from 'react';
import keys from './keys';

export default class Button extends React.Component {
  constructor(props) {
    super(props);
    props.manager.button = this;
  }

  handleKeyDown(event) {
    const { manager } = this.props;
    const { key } = event;

    if (key === keys.DOWN) {
      event.preventDefault();

      // "With focus on the button and no drop-down menu displayed,
      // pressing Down Arrow will open the drop-down menu and move focus
      // into the menu and onto the first menu item."
      if (!manager.isOpen) manager.openMenu({ focusMenu: true });

      // "With focus on the button and the drop-down menu open,
      // pressing Down Arrow will move focus into the menu onto
      // the first menu item. [...]"
      else manager.moveFocusDown();
      return;
    }

    // "With focus on the button pressing Space or Enter will toggle
    // the display of the drop-down menu. Focus remains on the button."
    if (key === keys.ENTER || key === keys.SPACE) {
      event.preventDefault();
      manager.toggleMenu();
      return;
    }

    manager.handleMenuKey(event);
  }

  handleClick() {
    this.props.manager.toggleMenu();
  }

  render() {
    const { manager, children, tag, className } = this.props;

    return React.createElement(tag, {
      className,
      // "The menu button itself has a role of button."
      role: 'button',
      tabIndex: '0',
      // "The menu button has an aria-haspopup property, set to true."
      'aria-haspopup': true,
      'aria-expanded': manager.isOpen,
      onKeyDown: this.handleKeyDown.bind(this),
      onClick: this.handleClick.bind(this),
      onBlur: manager.handleBlur,
    }, children);
  }
}

Button.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  manager: PropTypes.object.isRequired,
  className: PropTypes.string,
  tag: PropTypes.string,
};

Button.defaultProps = {
  tag: 'span',
};
