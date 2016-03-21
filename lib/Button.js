var React = require('react');
var specialAssign = require('./specialAssign');

var checkedProps = {
  children: React.PropTypes.node.isRequired,
  disabled: React.PropTypes.bool,
  tag: React.PropTypes.string,
};

module.exports = React.createClass({
  displayName: 'AriaMenuButton-Button',

  propTypes: checkedProps,

  contextTypes: {
    ambManager: React.PropTypes.object.isRequired,
  },

  getDefaultProps: function() {
    return { tag: 'span' };
  },

  componentWillMount: function() {
    this.context.ambManager.button = this;
  },

  componentWillUnmount: function() {
    this.context.ambManager.destroy();
  },

  handleKeyDown: function(event) {
    if (this.props.disabled) return;

    var ambManager = this.context.ambManager;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!ambManager.isOpen) {
          ambManager.openMenu({ focusMenu: true });
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
  },

  handleClick: function() {
    if (this.props.disabled) return;
    this.context.ambManager.toggleMenu();
  },

  render: function() {
    var props = this.props;

    var buttonProps = {
      // "The menu button itself has a role of button."
      role: 'button',
      tabIndex: (props.disabled) ? '' : '0',
      // "The menu button has an aria-haspopup property, set to true."
      'aria-haspopup': true,
      'aria-expanded': this.context.ambManager.isOpen,
      'aria-disabled': props.disabled,
      onKeyDown: this.handleKeyDown,
      onClick: this.handleClick,
      onBlur: this.context.ambManager.handleBlur,
    };

    specialAssign(buttonProps, props, checkedProps);

    return React.createElement(props.tag, buttonProps, props.children);
  },
});
