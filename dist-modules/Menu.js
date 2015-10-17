'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _tapJs = require('tap.js');

var _tapJs2 = _interopRequireDefault(_tapJs);

var Menu = (function (_React$Component) {
  _inherits(Menu, _React$Component);

  function Menu() {
    _classCallCheck(this, Menu);

    _React$Component.apply(this, arguments);
  }

  Menu.prototype.componentWillMount = function componentWillMount() {
    var _this = this;

    this.context.ambManager.menu = this;

    this.isListeningForTap = false;
    this.tapHandler = function (e) {
      if (_reactDom2['default'].findDOMNode(_this).contains(e.target)) return;
      if (_reactDom2['default'].findDOMNode(_this.context.ambManager.button).contains(e.target)) return;
      _this.context.ambManager.closeMenu();
    };
  };

  Menu.prototype.componentWillUpdate = function componentWillUpdate() {
    var ambManager = this.context.ambManager;

    if (ambManager.isOpen && !this.isListeningForTap) {
      this.addTapListeners();
    } else if (!ambManager.isOpen && this.isListeningForTap) {
      this.removeTapListeners();
    }

    if (!ambManager.isOpen) {
      // Clear the ambManager's items, so they
      // can be reloaded next time this menu opens
      ambManager.menuItems = [];
    }
  };

  Menu.prototype.componentWillUnmount = function componentWillUnmount() {
    this.removeTapListeners();
    this.context.ambManager.destroy();
  };

  Menu.prototype.addTapListeners = function addTapListeners() {
    if (!global.document) return;
    this.bodyTap = new _tapJs2['default'](document.body);
    document.body.addEventListener('tap', this.tapHandler, true);
    this.isListeningForTap = true;
  };

  Menu.prototype.removeTapListeners = function removeTapListeners() {
    if (!global.document) return;
    if (!this.isListeningForTap) return;
    document.body.removeEventListener('tap', this.tapHandler, true);
    this.bodyTap.destroy();
    this.isListeningForTap = false;
  };

  Menu.prototype.render = function render() {
    var _props = this.props;
    var children = _props.children;
    var tag = _props.tag;
    var className = _props.className;
    var id = _props.id;
    var style = _props.style;
    var ambManager = this.context.ambManager;

    var childrenToRender = (function () {
      if (typeof children === 'function') {
        return children({ isOpen: ambManager.isOpen });
      }
      if (ambManager.isOpen) return children;
      return false;
    })();

    if (!childrenToRender) return false;

    return _react2['default'].createElement(tag, {
      className: className,
      id: id,
      style: style,
      onKeyDown: ambManager.handleMenuKey,
      role: 'menu',
      onBlur: ambManager.handleBlur
    }, childrenToRender);
  };

  return Menu;
})(_react2['default'].Component);

exports['default'] = Menu;

Menu.propTypes = {
  children: _react.PropTypes.oneOfType([_react.PropTypes.func, _react.PropTypes.node]).isRequired,
  id: _react.PropTypes.string,
  className: _react.PropTypes.string,
  style: _react.PropTypes.object,
  tag: _react.PropTypes.string
};

Menu.defaultProps = {
  tag: 'div'
};

Menu.contextTypes = {
  ambManager: _react.PropTypes.object.isRequired
};
module.exports = exports['default'];