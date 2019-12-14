const React = require('react');
const PropTypes = require('prop-types');
const createTapListener = require('teeny-tap');
const ManagerContext = require('./ManagerContext');
const { refType } = require("./propTypes");
const specialAssign = require('./specialAssign');

const checkedProps = {
  ambManager: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
  forwardedRef: refType,
  tag: PropTypes.string
};

class AriaMenuButtonMenu extends React.Component {
  static propTypes = checkedProps;
  static defaultProps = { tag: 'div' };

  ref = React.createRef();

  componentDidMount() {
    this.props.ambManager.menu = this;
  }

  componentDidUpdate() {
    const ambManager = this.props.ambManager;
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
    this.props.ambManager.destroy();
  }

  addTapListener = () => {
    const el = this.ref.current;
    if (!el) return;
    const doc = el.ownerDocument;
    if (!doc) return;
    this.tapListener = createTapListener(doc.documentElement, this.handleTap);
  };

  handleTap = event => {
    if (this.ref.current.contains(event.target)) return;
    if (
      this.props.ambManager.button.ref.current.contains(
        event.target
      )
    )
      return;
    this.props.ambManager.closeMenu();
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
    const props = this.props;
    const ambManager = this.props.ambManager;

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
    specialAssign(menuProps, { ref: this.setRef });

    return React.createElement(props.tag, menuProps, childrenToRender);
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
    return React.createElement(AriaMenuButtonMenu, buttonProps, props.children);
  }
));
