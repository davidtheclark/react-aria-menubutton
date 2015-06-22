import React, { PropTypes } from 'react';
import Trigger from './Trigger';
import Menu from './Menu';

export default class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showingMenu: false,
      openingMenuReceivesFocus: false,
    };
    props.manager.selectionHandler = this.handleSelection.bind(this);
  }

  openMenu(openingMenuReceivesFocus=false) {
    this.setState({ showingMenu: true, openingMenuReceivesFocus });
  }

  closeMenu(focusTrigger=true) {
    const { manager } = this.props;
    this.setState({ showingMenu: false, openingMenuReceivesFocus: false }, () => {
      if (focusTrigger) manager.focusTrigger();
      manager.currentFocus = -1;
    });
  }

  toggleMenu() {
    if (this.state.showingMenu) this.closeMenu();
    else this.openMenu();
  }

  handleBlur() {
    const { manager } = this.props;
    setTimeout(() => {
      const activeEl = document.activeElement;
      if (activeEl === manager.trigger) return;
      if (manager.items.some(item => item.node === activeEl)) return;
      if (this.state.showingMenu) this.closeMenu(false);
    }, 0);
  }

  handleSelection(value) {
    if (this.props.closeOnSelection) this.closeMenu();
    this.props.handleSelection(value);
  }

  render() {
    const props = this.props;
    const { showingMenu } = this.state;
    const menu = (!showingMenu) ? false
      : React.createElement(Menu, {
          close: this.closeMenu.bind(this),
          manager: props.manager,
          receiveFocus: this.state.openingMenuReceivesFocus,
        }, props.menu);

    const trigger = React.createElement(Trigger, {
      manager: props.manager,
      menuIsOpen: showingMenu,
      openMenu: this.openMenu.bind(this),
      toggleMenu: this.toggleMenu.bind(this),
    }, props.children || props.trigger);

    return React.createElement(props.tag, {
      onBlur: this.handleBlur.bind(this),
    }, trigger, menu);
  }
}

Container.propTypes = {
  handleSelection: PropTypes.func.isRequired,
  manager: PropTypes.object.isRequired,
  menu: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
  ]),
  closeOnSelection: PropTypes.bool,
  tag: PropTypes.string,
};

Container.defaultProps = {
  tag: 'div',
};
