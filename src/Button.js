const React = require('react');
const PropTypes = require('prop-types');
const specialAssign = require('./specialAssign');

const checkedProps = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  tag: PropTypes.string
};

class AriaMenuButtonButton extends React.Component {
  static propTypes = checkedProps;

  static contextTypes = {
    ambManager: PropTypes.object.isRequired
  };

  static defaultProps = { tag: 'span' };

  componentWillMount() {
    this.context.ambManager.button = this;
  }

  componentWillUnmount() {
    this.context.ambManager.destroy();
  }

  handleKeyDown = event => {
    if (this.props.disabled) return;

    const ambManager = this.context.ambManager;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!ambManager.isOpen) {
          ambManager.openMenu();
        } else {
          ambManager.focusItem(0);
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        ambManager.toggleMenu();
        break;
      case 'Escape':
        ambManager.handleMenuKey(event);
        break;
      default:
        // (Potential) letter keys
        ambManager.handleButtonNonArrowKey(event);
    }
  };

  handleClick = () => {
    if (this.props.disabled) return;
    this.context.ambManager.toggleMenu({}, { focusMenu: false });
  };

  render() {
    const props = this.props;

    const buttonProps = {
      // "The menu button itself has a role of button."
      role: 'button',
      tabIndex: props.disabled ? '' : '0',
      // "The menu button has an aria-haspopup property, set to true."
      'aria-haspopup': true,
      'aria-expanded': this.context.ambManager.isOpen,
      'aria-disabled': props.disabled,
      onKeyDown: this.handleKeyDown,
      onClick: this.handleClick,
      onBlur: this.context.ambManager.handleBlur
    };

    specialAssign(buttonProps, props, checkedProps);

    return React.createElement(props.tag, buttonProps, props.children);
  }
}

module.exports = AriaMenuButtonButton;
