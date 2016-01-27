var React = require('react');
var ReactDOM = require('react-dom');

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
    this.managedIndex = this.context.ambManager.menuItems.push({
      node: ReactDOM.findDOMNode(this),
      content: this.props.children,
      text: this.props.text,
    }) - 1;
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
    this.context.ambManager.currentFocus = this.managedIndex;
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
    }, props.children);
  },
});
