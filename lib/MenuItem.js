var React = require('react');
var specialAssign = require('./specialAssign');

var checkedProps = {
  children: React.PropTypes.node.isRequired,
  tag: React.PropTypes.string,
  text: React.PropTypes.string,
  value: React.PropTypes.any,
};

module.exports = React.createClass({
  displayName: 'AriaMenuButton-MenuItem',

  propTypes: checkedProps,

  getDefaultProps: function() {
    return { tag: 'div' };
  },

  contextTypes: {
    ambManager: React.PropTypes.object.isRequired,
  },

  componentDidMount: function() {
    this.context.ambManager.addItem({
      node: this.node,
      text: this.props.text,
    });
  },

  handleKeyDown: function(event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    this.selectItem(event);
  },

  selectItem: function(event) {
    // If there's no value, we'll send the child
    var value = (typeof this.props.value !== 'undefined')
      ? this.props.value
      : this.props.children;
    this.context.ambManager.handleSelection(value, event);
  },

  registerNode: function(node) {
    this.node = node;
  },

  render: function() {
    var props = this.props;

    var menuItemProps = {
      onClick: this.selectItem,
      onKeyDown: this.handleKeyDown,
      role: 'menuitem',
      tabIndex: '-1',
      ref: this.registerNode,
    };

    specialAssign(menuItemProps, props, checkedProps);

    return React.createElement(props.tag, menuItemProps, props.children);
  },
});
