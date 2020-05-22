const React = require('react');
const PropTypes = require('prop-types');
const ManagerContext = require('./ManagerContext');
const { refType } = require("./propTypes");
const specialAssign = require('./specialAssign');

const checkedProps = {
  ambManager: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  forwardedRef: refType,
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

  static defaultProps = { tag: 'span' };

  ref = React.createRef();

  componentDidMount() {
    this.props.ambManager.button = this;
  }

  componentWillUnmount() {
    this.props.ambManager.destroy();
  }

  handleKeyDown = event => {
    if (this.props.disabled) return;

    const ambManager = this.props.ambManager;

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
    this.props.ambManager.toggleMenu({}, { focusMenu: false });
  };

  setRef = instance => {
    this.ref.current = instance;
    if (typeof this.props.forwardedRef === "function") {
      this.props.forwardedRef(instance);
    } else if (this.props.forwardedRef) {
      this.props.forwardedRef.current = instance;
    }
  };

  render() {
    const props = this.props;
    const ambManager = this.props.ambManager;

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
    specialAssign(buttonProps, { ref: this.setRef });

    return React.createElement(props.tag, buttonProps, props.children);
  }
}

module.exports = React.forwardRef((props, ref) => React.createElement(
  ManagerContext.Consumer,
  null,
  (ambManager) => {
    const buttonProps = { ambManager, forwardedRef: ref };
    specialAssign(buttonProps, props, {
      ambManager: checkedProps.ambManager,
      children: checkedProps.children,
      forwardedRef: checkedProps.forwardedRef
    });
    return React.createElement(AriaMenuButtonButton, buttonProps, props.children);
  }
));
