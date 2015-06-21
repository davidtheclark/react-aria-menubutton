import React, { PropTypes } from 'react';
import keys from './keys';

export default class Trigger extends React.Component {

  componentDidMount() {
    this.props.manager.trigger = React.findDOMNode(this);
  }

  handleTriggerKey(event) {
    const props = this.props;
    const key = event.key;

    if (key === keys.DOWN) {
      event.preventDefault();

      // "With focus on the button and no drop-down menu displayed,
      // pressing Down Arrow will open the drop-down menu and move focus
      // into the menu and onto the first menu item."
      if (!props.menuIsOpen) props.openMenu(true);

      // "With focus on the button and the drop-down menu open,
      // pressing Down Arrow will move focus into the menu onto
      // the first menu item. [...]"
      else props.manager.moveFocusDown();
    }

    // "With focus on the button pressing Space or Enter will toggle
    // the display of the drop-down menu. Focus remains on the button."
    if (key === keys.ENTER || key === keys.SPACE) {
      event.preventDefault();
      props.toggleMenu();
    }
  }

  handleClick() {
    this.props.toggleMenu();
  }

  render() {
    const props = this.props;

    return React.createElement('span', {
      // "The menu button itself has a role of button."
      role: 'button',
      tabIndex: '0',
      // "The menu button has an aria-haspopup property, set to true."
      'aria-haspopup': true,
      'aria-expanded': props.menuIsOpen,
      onKeyDown: this.handleTriggerKey.bind(this),
      onClick: this.handleClick.bind(this),
    }, props.children);
  }
}

Trigger.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  manager: PropTypes.object.isRequired,
  openMenu: PropTypes.func.isRequired,
  toggleMenu: PropTypes.func.isRequired,
  menuIsOpen: PropTypes.bool,
};
