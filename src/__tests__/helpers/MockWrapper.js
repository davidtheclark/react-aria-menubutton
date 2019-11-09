const React = require('react');
const PropTypes = require('prop-types');
const ManagerContext = require('../../ManagerContext');

class MockWrapper extends React.Component {
  static propTypes = {
    mockManager: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.manager = this.props.mockManager;
  }

  render() {
    return React.createElement(
      ManagerContext.Provider,
      { value: this.props.mockManager },
      React.createElement('div', null, this.props.children)
    );
  }
}

module.exports = MockWrapper;
