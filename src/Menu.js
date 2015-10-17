import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Tap from 'tap.js';

export default class Menu extends React.Component {
  componentWillMount() {
    this.context.ambManager.menu = this;

    this.isListeningForTap = false;
    this.tapHandler = (e) => {
      if (ReactDOM.findDOMNode(this).contains(e.target)) return;
      if (ReactDOM.findDOMNode(this.context.ambManager.button).contains(e.target)) return;
      this.context.ambManager.closeMenu();
    }
  }

  componentWillUpdate() {
    const { ambManager } = this.context;
    if (ambManager.isOpen && !this.isListeningForTap) {
      this.addTapListeners();
    } else if (!ambManager.isOpen && this.isListeningForTap) {
      this.removeTapListeners();
    }

    if (!ambManager.isOpen) {
      // Clear the ambManager's items, so they
      // can be reloaded next time this menu opens
      ambManager.menuItems = [];
    }
  }

  componentWillUnmount() {
    this.removeTapListeners();
    this.context.ambManager.destroy();
  }

  addTapListeners() {
    if (!global.document) return;
    this.bodyTap = new Tap(document.body);
    document.body.addEventListener('tap', this.tapHandler, true);
    this.isListeningForTap = true;
  }

  removeTapListeners() {
    if (!global.document) return;
    if (!this.isListeningForTap) return;
    document.body.removeEventListener('tap', this.tapHandler, true);
    this.bodyTap.destroy();
    this.isListeningForTap = false;
  }

  render() {
    const { children, tag, className, id, style } = this.props;
    const { ambManager } = this.context;

    const childrenToRender = (() => {
      if (typeof children === 'function') {
        return children({ isOpen: ambManager.isOpen });
      }
      if (ambManager.isOpen) return children;
      return false;
    })();

    if (!childrenToRender) return false;

    return React.createElement(tag, {
      className,
      id,
      style,
      onKeyDown: ambManager.handleMenuKey,
      role: 'menu',
      onBlur: ambManager.handleBlur,
    }, childrenToRender);
  }
}

Menu.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  tag: PropTypes.string,
};

Menu.defaultProps = {
  tag: 'div',
};

Menu.contextTypes = {
  ambManager: PropTypes.object.isRequired,
};
