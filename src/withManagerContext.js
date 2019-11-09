const React = require('react');
const getDisplayName = require('react-display-name').default;
const ManagerContext = require('./ManagerContext');
const specialAssign = require('./specialAssign');

function withManagerContext(WrappedComponent) {
  return class extends React.Component {
    static displayName = `withManagerContext(${getDisplayName(WrappedComponent)})`;

    render() {
      return React.createElement(
        ManagerContext.Consumer,
        null,
        (ambManager) => {
          const wrappedProps = {};
          specialAssign(wrappedProps, this.props);
          specialAssign(wrappedProps, { ambManager });
          return React.createElement(
            WrappedComponent,
            wrappedProps,
            this.props.children
          );
        }
      );
    }
  }
}

module.exports = withManagerContext;
