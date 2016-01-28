var React = require('react');

module.exports = React.createClass({
  displayName: 'AriaMenuButton-Button',

  propTypes: {
    children: React.PropTypes.node.isRequired,
    className: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    id: React.PropTypes.string,
    style: React.PropTypes.object,
    tag: React.PropTypes.string,
  },

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
          ambManager.arrowOrder.focusNodeAtIndex(0);
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        ambManager.toggleMenu();
        break;
      default:
        ambManager.handleMenuKey(event);
    }
  },

  handleClick: function() {
    if (this.props.disabled) return;
    this.context.ambManager.toggleMenu();
  },

  render: function() {
    var props = this.props;

    return React.createElement(props.tag, {
      className: props.className,
      id: props.id,
      style: props.style,
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
    }, props.children);
  },
});
