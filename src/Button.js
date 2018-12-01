const React = require('react');
const PropTypes = require('prop-types');
const specialAssign = require('./specialAssign');

const checkedProps = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  tag: PropTypes.string
};

// List retrieved from https://www.w3schools.com/tags/att_disabled.asp
const disabledSupportedTags = () => [
  'button',
  'fieldset',
  'input',
  'optgroup',
  'option',
  'select',
  'textarea'
];

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
    const ambManager = this.context.ambManager;

    const buttonProps = {
      // "The menu button itself has a role of button."
      role: 'button',
      tabIndex: props.disabled ? '' : '0',
      // "The menu button has an aria-haspopup property, set to true."
      'aria-haspopup': true,
      'aria-expanded': ambManager.isOpen,
      'aria-disabled': props.disabled,
      onKeyDown: this.handleKeyDown,
      onClick: this.handleClick
    };

    const reserved = {};
    specialAssign(reserved, checkedProps);
    // The disabled property should be passed down to the Button element
    // if the tag has support for disabled attribute. So it needs to be removed
    // from the reserved property object
    if (disabledSupportedTags().indexOf(props.tag) >= 0) {
      delete reserved.disabled;
    }
    if (ambManager.options.closeOnBlur) {
      buttonProps.onBlur = ambManager.handleBlur;
    }
    specialAssign(buttonProps, props, reserved);

    return React.createElement(props.tag, buttonProps, props.children);
  }
}

module.exports = AriaMenuButtonButton;
