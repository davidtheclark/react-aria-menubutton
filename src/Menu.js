import React, { PropTypes } from 'react';

export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    props.manager.menu = this;
  }

  componentWillUpdate() {
    const { manager } = this.props;
    if (!manager.isOpen) {
      // Clear the manager's items, so they
      // can be reloaded next time this menu opens
      manager.menuItems = [];
    }
  }

  render() {
    const { manager, children, tag, className, id, noOverlay } = this.props;

    const childrenToRender = (() => {
      if (typeof children === 'function') {
        return children({ isOpen: manager.isOpen });
      }
      if (manager.isOpen) return children;
      return [];
    })();

    const menuEl = React.createElement(tag, {
      className,
      id,
      onKeyDown: manager.handleMenuKey,
      role: 'menu',
      onBlur: manager.handleBlur,
      style: (noOverlay) ? undefined : { position: 'relative', zIndex: 100 },
    }, childrenToRender);

    if (noOverlay) return menuEl;

    const overlay = (!manager.isOpen) ? false : React.createElement('div', {
      style: {
        cursor: 'pointer',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        WebkitTapHighlightColor: 'rgba(0,0,0,0)',
        zIndex: 99,
      },
      onClick: manager.closeMenu,
    });

    return React.createElement('div', {},
      menuEl,
      overlay
    );
  }
}

Menu.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.element]).isRequired,
  manager: PropTypes.object.isRequired,
  id: PropTypes.string,
  className: PropTypes.string,
  noOverlay: PropTypes.bool,
  tag: PropTypes.string,
};

Menu.defaultProps = {
  tag: 'div',
};
