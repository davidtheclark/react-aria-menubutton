var React = require('react');
var ReactDOM = require('react-dom');
var createTapListener = require('teeny-tap');
var specialAssign = require('./specialAssign');

var checkedProps = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.func,
    React.PropTypes.node,
  ]).isRequired,
  tag: React.PropTypes.string,
};

module.exports = React.createClass({
  displayName: 'AriaMenuButton-Menu',

  propTypes: checkedProps,

  getDefaultProps: function() {
    return { tag: 'div' };
  },

  contextTypes: {
    ambManager: React.PropTypes.object.isRequired,
  },

  componentWillMount: function() {
    this.context.ambManager.menu = this;
  },

  componentWillUpdate: function() {
    var ambManager = this.context.ambManager;
    if (ambManager.isOpen && !this.tapListener) {
      this.addTapListener();
    } else if (!ambManager.isOpen && this.tapListener) {
      this.tapListener.remove()
      delete this.tapListener;
    }

    if (!ambManager.isOpen) {
      // Clear the ambManager's items, so they
      // can be reloaded next time this menu opens
      ambManager.clearItems();
    }
  },

  componentWillUnmount: function() {
    if (this.tapListener) this.tapListener.remove();
    this.context.ambManager.destroy();
  },

  addTapListener: function() {
    if (!window || !window.document) return;
    this.tapListener = createTapListener(document.documentElement, this.handleTap);
  },

  handleTap: function(event) {
    if (ReactDOM.findDOMNode(this).contains(event.target)) return;
    if (ReactDOM.findDOMNode(this.context.ambManager.button).contains(event.target)) return;
    this.context.ambManager.closeMenu();
  },

  render: function() {
    var props = this.props;
    var ambManager = this.context.ambManager;

    var childrenToRender = (function() {
      if (typeof props.children === 'function') {
        return props.children({ isOpen: ambManager.isOpen });
      }
      if (ambManager.isOpen) return props.children;
      return false;
    }());

    if (!childrenToRender) return false;

    var menuProps = {
      onKeyDown: ambManager.handleMenuKey,
      role: 'menu',
      onBlur: ambManager.handleBlur,
    };

    specialAssign(menuProps, props, checkedProps);

    return React.createElement(props.tag, menuProps, childrenToRender);
  },
});
