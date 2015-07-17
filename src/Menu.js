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
    const { manager, children, tag, className } = this.props;

    const childrenToRender = (() => {
      if (typeof children === 'function') return children(manager.isOpen);
      if (manager.isOpen) return children;
      return [];
    })();

    return React.createElement(tag, {
      className,
      onKeyDown: manager.handleMenuKey,
      // "A menu is a container of options. The container may have a role of
      // menu or menubar depending on your implementation."
      role: 'menu',
      onBlur: manager.handleBlur,
    }, childrenToRender);
  }
}

Menu.propTypes = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.element]).isRequired,
  manager: PropTypes.object.isRequired,
  className: PropTypes.string,
  tag: PropTypes.string,
};

Menu.defaultProps = {
  tag: 'div',
};
