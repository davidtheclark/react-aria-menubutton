var React = require('react');

module.exports = React.createClass({
  displayName: 'MockWrapper',

  proptypes: {
    mockManager: React.PropTypes.object.isRequired,
  },

  childContextTypes: {
    ambManager: React.PropTypes.object.isRequired,
  },

  getChildContext: function() {
    this.manager = this.props.mockManager;
    return {
      ambManager: this.props.mockManager,
    };
  },

  render: function() {
    return React.DOM.div(null, this.props.children);
  },
});
