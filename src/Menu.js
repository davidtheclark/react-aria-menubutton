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

  getDocumentElement() {
    const el = ReactDOM.findDOMNode(this);
    if (!el) return;
    const doc = el.ownerDocument;
    if (!doc) return;
    return doc.documentElement;
  }

  componentWillMount() {
    this.context.ambManager.menu = this;
  }

  componentDidUpdate() {
    const ambManager = this.context.ambManager;
    // Keep a ref to the document to clean up
    // listeners attached to it when the menu is closed
    if (ambManager.isOpen && !this.document) {
      this.document = this.getDocumentElement();
    }
    if (ambManager.isOpen && !this.tapListener) {
      this.addTapListener();
      this.addTapStartListener();
    } else if (!ambManager.isOpen && this.tapListener) {
      this.tapListener.remove();
      delete this.tapListener;
      this.removeTapStartListener();
    }

    if (!ambManager.isOpen) {
      // Clear the ambManager's items, so they
      // can be reloaded next time this menu opens
      ambManager.clearItems();
    }
  }

  componentWillUnmount() {
    if (this.tapListener) this.tapListener.remove();
    this.removeTapStartListener();
    this.context.ambManager.destroy();
  }

  removeTapStartListener() {
    if (this.document) {
      this.document.removeEventListener('mousedown', this.handleTapStart);
      this.document.removeEventListener('touchstart', this.handleTapStart);
    }
  }

  addTapListener = () => {
    if (this.document) {
      this.tapListener = createTapListener(this.document, this.handleTap);
    }
  }

  addTapStartListener = () => {
    if (this.document) {
      this.document.addEventListener('mousedown', this.handleTapStart);
      this.document.addEventListener('touchstart', this.handleTapStart);
    }
  }

  handleTap = event => {
    if (ReactDOM.findDOMNode(this).contains(event.target)) return;
    if (
      ReactDOM.findDOMNode(this.context.ambManager.button).contains(
        event.target
      )
    )
      return;
    this.context.ambManager.closeMenu();
  }

  handleTapStart = event => {
    var inMenu = ReactDOM.findDOMNode(this).contains(event.target);
    this.context.ambManager.tapStartInMenu = inMenu;
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
      onBlur: ambManager.handleBlur
    };

    specialAssign(menuProps, props, checkedProps);

    return React.createElement(props.tag, menuProps, childrenToRender);
  }
};
