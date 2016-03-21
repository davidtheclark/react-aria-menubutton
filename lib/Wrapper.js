var React = require('react');
var createManager = require('./createManager');
var specialAssign = require('./specialAssign');

var checkedProps = {
  children: React.PropTypes.node.isRequired,
  onSelection: React.PropTypes.func.isRequired,
  closeOnSelection: React.PropTypes.bool,
  tag: React.PropTypes.string,
};

module.exports = React.createClass({
  displayName: 'AriaMenuButton-Wrapper',

  propTypes: checkedProps,

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
      id: this.props.id,
    });
  },

  render: function() {
    var props = this.props;
    var wrapperProps = {};
    specialAssign(wrapperProps, props, checkedProps);
    return React.createElement(props.tag, wrapperProps, props.children);
  },
});
