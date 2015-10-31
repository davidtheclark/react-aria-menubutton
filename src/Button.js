import React, { PropTypes } from 'react';
import keys from './keys';

export default class Button extends React.Component {
  componentWillMount() {
    this.context.ambManager.button = this;
  }

  componentWillUnmount() {
    this.context.ambManager.destroy();
  }

  handleKeyDown(event) {
    if (this.props.disabled) return;
    const { ambManager } = this.context;
    const { key } = event;

    if (key === keys.DOWN) {
      event.preventDefault();
      if (!ambManager.isOpen) {
        ambManager.openMenu({ focusMenu: true });
      } else {
        ambManager.moveFocusDown();
      }
      return;
    }

    if (key === keys.ENTER || key === keys.SPACE) {
      event.preventDefault();
      ambManager.toggleMenu();
      return;
    }

    ambManager.handleMenuKey(event);
  }

  handleClick() {
    if (this.props.disabled) return;
    this.context.ambManager.toggleMenu();
  }

  render() {
    const { children, tag, className, id, style } = this.props;
    const { ambManager } = this.context;

    return React.createElement(tag, {
      className,
      id,
      style,
      // "The menu button itself has a role of button."
      role: 'button',
      tabIndex: (this.props.disabled) ? '' : '0',
      // "The menu button has an aria-haspopup property, set to true."
      'aria-haspopup': true,
      'aria-expanded': ambManager.isOpen,
      'aria-disabled': this.props.disabled,
      onKeyDown: this.handleKeyDown.bind(this),
      onClick: this.handleClick.bind(this),
      onBlur: ambManager.handleBlur,
    }, children);
  }
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  style: PropTypes.object,
  tag: PropTypes.string,
};

Button.defaultProps = {
  tag: 'span',
};

Button.contextTypes = {
  ambManager: PropTypes.object.isRequired,
};
