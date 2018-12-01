const React = require('react');
const PropTypes = require('prop-types');
const createManager = require('./createManager');
const specialAssign = require('./specialAssign');

const checkedProps = {
  children: PropTypes.node.isRequired,
  onMenuToggle: PropTypes.func,
  onSelection: PropTypes.func,
  closeOnSelection: PropTypes.bool,
  closeOnBlur: PropTypes.bool,
  tag: PropTypes.string
};

class AriaMenuButtonWrapper extends React.Component {
  static propTypes = checkedProps;
  static defaultProps = { tag: 'div' };

  static childContextTypes = {
    ambManager: PropTypes.object
  };

  getChildContext() {
    return {
      ambManager: this.manager
    };
  }

  componentWillMount() {
    this.manager = createManager({
      onMenuToggle: this.props.onMenuToggle,
      onSelection: this.props.onSelection,
      closeOnSelection: this.props.closeOnSelection,
      closeOnBlur: this.props.closeOnBlur,
      id: this.props.id
    });
  }

  render() {
    const wrapperProps = {};
    specialAssign(wrapperProps, this.props, checkedProps);
    return React.createElement(
      this.props.tag,
      wrapperProps,
      this.props.children
    );
  }
}

module.exports = AriaMenuButtonWrapper;
