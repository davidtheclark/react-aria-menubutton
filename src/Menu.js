const React = require('react');
const ReactDOM = require('react-dom');
const PropTypes = require('prop-types');
const createTapListener = require('teeny-tap');
const specialAssign = require('./specialAssign');

const checkedProps = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
  tag: PropTypes.string
};

module.exports = class extends React.Component {
  static propTypes = checkedProps;
  static defaultProps = { tag: 'div' };

  static contextTypes = {
    ambManager: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.context.ambManager.menu = this;
  }

  componentDidUpdate() {
    const ambManager = this.context.ambManager;
    if (!ambManager.options.closeOnBlur) return;
    if (ambManager.isOpen && !this.tapListener) {
      this.addTapListener();
    } else if (!ambManager.isOpen && this.tapListener) {
      this.tapListener.remove();
      delete this.tapListener;
    }

    if (!ambManager.isOpen) {
      // Clear the ambManager's items, so they
      // can be reloaded next time this menu opens
      ambManager.clearItems();
    }
  }

  componentWillUnmount() {
    if (this.tapListener) this.tapListener.remove();
    this.context.ambManager.destroy();
  }

  addTapListener = () => {
    const el = ReactDOM.findDOMNode(this);
    if (!el) return;
    const doc = el.ownerDocument;
    if (!doc) return;
    this.tapListener = createTapListener(doc.documentElement, this.handleTap);
  };

  handleTap = event => {
    if (ReactDOM.findDOMNode(this).contains(event.target)) return;
    if (
      ReactDOM.findDOMNode(this.context.ambManager.button).contains(
        event.target
      )
    )
      return;
    this.context.ambManager.closeMenu();
  };

  render() {
    const props = this.props;
    const ambManager = this.context.ambManager;

    const childrenToRender = (function() {
      if (typeof props.children === 'function') {
        return props.children({ isOpen: ambManager.isOpen });
      }
      if (ambManager.isOpen) return props.children;
      return false;
    })();

    if (!childrenToRender) return false;

    const menuProps = {
      onKeyDown: ambManager.handleMenuKey,
      role: 'menu',
      tabIndex: -1
    };

    if (ambManager.options.closeOnBlur) {
      menuProps.onBlur = ambManager.handleBlur;
    }

    specialAssign(menuProps, props, checkedProps);

    return React.createElement(props.tag, menuProps, childrenToRender);
  }
};
