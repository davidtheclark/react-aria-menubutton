const React = require('react');
const PropTypes = require('prop-types');
const createManager = require('./createManager');
const specialAssign = require('./specialAssign');

const checkedProps = {
  children: PropTypes.node.isRequired,
  onMenuToggle: PropTypes.func,
  onSelection: PropTypes.func.isRequired,
  closeOnSelection: PropTypes.bool,
  tag: PropTypes.string,
  focusGroupOptions: PropTypes.shape({
    members: PropTypes.array,
    keybindings: PropTypes.string,
    wrap: PropTypes.bool,
    stringSearch: PropTypes.bool,
    stringSearchDelay: PropTypes.number
  })
};

class AriaMenuButtonWrapper extends React.Component {
  static propTypes = checkedProps;
  static defaultProps = {
    tag: 'div',
    focusGroupOptions: {
      wrap: true,
      stringSearch: true
    }
   };

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
      focusGroupOptions: this.props.focusGroupOptions,
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
