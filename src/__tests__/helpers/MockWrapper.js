const React = require('react');
const PropTypes = require('prop-types');

class MockWrapper extends React.Component {
  static propTypes: {
    mockManager: PropTypes.object.isRequired,
  };

  static childContextTypes = {
    ambManager: PropTypes.object.isRequired,
  };

  getChildContext() {
    this.manager = this.props.mockManager;
    return {
      ambManager: this.props.mockManager,
    };
  }

  render() {
    return React.createElement('div', null, this.props.children);
  }
}

module.exports = MockWrapper;
