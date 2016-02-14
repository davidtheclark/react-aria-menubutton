var React = require('react');

module.exports = React.createClass({
  displayName: 'AriaMenuButton-MenuItem',

  propTypes: {
    children: React.PropTypes.node.isRequired,
    className: React.PropTypes.string,
    id: React.PropTypes.string,
    style: React.PropTypes.object,
    tag: React.PropTypes.string,
    text: React.PropTypes.string,
    value: React.PropTypes.any,
  },

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
    return React.createElement(props.tag, {
      className: props.className,
      id: props.id,
      style: props.style,
      onClick: this.selectItem,
      onKeyDown: this.handleKeyDown,
      role: 'menuitem',
      tabIndex: '-1',
      ref: this.registerNode,
    }, props.children);
  },
});
