var React = require('react');
var createManager = require('./createManager');
var specialAssign = require('./specialAssign');

module.exports = React.createClass({
  displayName: 'AriaMenuButton-Wrapper',

  propTypes: {
    children: React.PropTypes.node.isRequired,
    onSelection: React.PropTypes.func.isRequired,
    closeOnSelection: React.PropTypes.bool,
    id: React.PropTypes.string,
    className: React.PropTypes.string,
    style: React.PropTypes.object,
    tag: React.PropTypes.string,
  },

  getDefaultProps: function() {
    return { tag: 'div' };
  },

  childContextTypes: {
    ambManager: React.PropTypes.object,
  },

  getChildContext: function() {
    return {
      ambManager: this.manager,
    };
  },

  componentWillMount: function() {
    this.manager = createManager({
      onSelection: this.props.onSelection,
      closeOnSelection: this.props.closeOnSelection,
    });
  },

  render: function() {
    var props = this.props;
    var wrapperProps = {};
    specialAssign(wrapperProps, props, [
      'tag', 'children',
      'closeOnSelection', 'onSelection',
    ]);
    return React.createElement(props.tag, wrapperProps, props.children);
  },
});
