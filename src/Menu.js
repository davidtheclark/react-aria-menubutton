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
    const { manager, children, tag, className, id } = this.props;

    const childrenToRender = (() => {
      if (typeof children === 'function') {
        return children({ isOpen: manager.isOpen });
      }
      if (manager.isOpen) return children;
      return [];
    })();

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
