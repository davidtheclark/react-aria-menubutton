import React, { PropTypes } from 'react';
import keys from './keys';

export default class Button extends React.Component {
  componentWillMount() {
    this.props.manager.button = this;
  }

  componentWillUnmount() {
    this.props.manager.powerDown();
  }

  handleKeyDown(event) {
    const { manager } = this.props;
    const { key } = event;

    if (key === keys.DOWN) {
      event.preventDefault();
      if (!manager.isOpen) manager.openMenu({ focusMenu: true });
      else manager.moveFocusDown();
      return;
    }

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
    const { manager, children, tag, className, id } = this.props;

    return React.createElement(tag, {
      className,
      id,
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
  id: PropTypes.string,
  tag: PropTypes.string,
};

Button.defaultProps = {
  tag: 'span',
};
