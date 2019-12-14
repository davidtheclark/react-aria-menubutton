const React = require('react');
const PropTypes = require('prop-types');
const ManagerContext = require('./ManagerContext');
const { refType } = require("./propTypes");
const specialAssign = require('./specialAssign');

const checkedProps = {
  ambManager: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  forwardedRef: refType,
  tag: PropTypes.string,
  text: PropTypes.string,
  value: PropTypes.any
};

class AriaMenuButtonMenuItem extends React.Component {
  static propTypes = checkedProps;
  static defaultProps = { tag: 'div' };

  ref = React.createRef();

  componentDidMount() {
    this.props.ambManager.addItem({
      node: this.ref.current,
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

  setRef = instance => {
    this.ref.current = instance;
    if (typeof this.props.forwardedRef === "function") {
      this.props.forwardedRef(instance);
    } else if (this.props.forwardedRef) {
      this.props.forwardedRef.current = instance;
    }
  };

  render() {
    const menuItemProps = {
      onClick: this.selectItem,
      onKeyDown: this.handleKeyDown,
      role: 'menuitem',
      tabIndex: '-1',
      ref: this.setRef
    };

    specialAssign(menuItemProps, this.props, checkedProps);

    return React.createElement(
      this.props.tag,
      menuItemProps,
      this.props.children
    );
  }
}

module.exports = React.forwardRef((props, ref) => React.createElement(
  ManagerContext.Consumer,
  null,
  (ambManager) => {
    const buttonProps = { ambManager, forwardedRef: ref };
    specialAssign(buttonProps, props, {
      ambManager: checkedProps.ambManager,
      children: checkedProps.children,
      forwardedRef: checkedProps.forwardedRef
    });
    return React.createElement(AriaMenuButtonMenuItem, buttonProps, props.children);
  }
));
