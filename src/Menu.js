import React, { PropTypes } from 'react';
import Tap from 'tap.js';

export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    props.manager.menu = this;

    this.isListeningForTap = false;
    this.tapHandler = (e) => {
      if (React.findDOMNode(this).contains(e.target)) return;
      props.manager.closeMenu();
    }
  }

  componentWillMount() {
    new Tap(document.body);
  }

  componentWillUpdate() {
    const { manager } = this.props;
    if (manager.isOpen && !this.isListeningForTap) {
      this.addTapListeners();
    } else if (!manager.isOpen && this.isListeningForTap) {
      this.removeTapListeners();
    }

    if (!manager.isOpen) {
      // Clear the manager's items, so they
      // can be reloaded next time this menu opens
      manager.menuItems = [];
    }
  }

  addTapListeners() {
    document.body.addEventListener('tap', this.tapHandler, true);
    this.isListeningForTap = true;
  }

  removeTapListeners() {
    document.body.removeEventListener('tap', this.tapHandler, true);
    this.isListeningForTap = false;
  }

  render() {
    const { manager, children, tag, className, id } = this.props;

    const childrenToRender = (() => {
      if (typeof children === 'function') {
        return children({ isOpen: manager.isOpen });
      }
      if (manager.isOpen) return children;
      return false;
    })();

    if (!childrenToRender) return false;

    return React.createElement(tag, {
      className,
      id,
      onKeyDown: manager.handleMenuKey,
      role: 'menu',
      onBlur: manager.handleBlur,
    }, childrenToRender);
  }
}

Menu.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.element]).isRequired,
  manager: PropTypes.object.isRequired,
  id: PropTypes.string,
  className: PropTypes.string,
  tag: PropTypes.string,
};

Menu.defaultProps = {
  tag: 'div',
};
