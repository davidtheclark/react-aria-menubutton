const React = require('react');
const PropTypes = require('prop-types');
const specialAssign = require('./specialAssign');
const withManagerContext = require('./withManagerContext');

const checkedProps = {
  ambManager: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  tag: PropTypes.string,
  text: PropTypes.string,
  value: PropTypes.any
};

class AriaMenuButtonMenuItem extends React.Component {
  static propTypes = checkedProps;
  static defaultProps = { tag: 'div' };

  componentDidMount() {
    this.props.ambManager.addItem({
      node: this.node,
      text: this.props.text
    });
  }

  handleKeyDown = event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    if (this.props.tag === 'a' && this.props.href) return;
    event.preventDefault();
    this.selectItem(event);
  };

  selectItem = event => {
    // If there's no value, we'll send the child
    const value = typeof this.props.value !== 'undefined'
      ? this.props.value
      : this.props.children;
    this.props.ambManager.handleSelection(value, event);
  };

  registerNode = node => {
    this.node = node;
  };

  render() {
    const menuItemProps = {
      onClick: this.selectItem,
      onKeyDown: this.handleKeyDown,
      role: 'menuitem',
      tabIndex: '-1',
      ref: this.registerNode
    };

    specialAssign(menuItemProps, this.props, checkedProps);

    return React.createElement(
      this.props.tag,
      menuItemProps,
      this.props.children
    );
  }
}

module.exports = withManagerContext(AriaMenuButtonMenuItem);
