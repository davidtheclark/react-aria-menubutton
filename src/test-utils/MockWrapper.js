import React from "react";
import PropTypes from "prop-types";
import ManagerContext from "../ManagerContext";

class MockWrapper extends React.Component {
  static propTypes = {
    mockManager: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.manager = this.props.mockManager;
  }

  render() {
    return React.createElement(
      ManagerContext.Provider,
      { value: this.props.mockManager },
      React.createElement("div", null, this.props.children)
    );
  }
}

export default MockWrapper;
