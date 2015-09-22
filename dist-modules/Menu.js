'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

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

    this.props.manager.menu = this;

    this.initTap();
    this.isListeningForTap = false;
    this.tapHandler = function (e) {
      if (_react2['default'].findDOMNode(_this).contains(e.target)) return;
      if (_react2['default'].findDOMNode(_this.props.manager.button).contains(e.target)) return;
      _this.props.manager.closeMenu();
    };
  };

  Menu.prototype.componentWillUpdate = function componentWillUpdate() {
    var manager = this.props.manager;

    if (manager.isOpen && !this.isListeningForTap) {
      this.addTapListeners();
    } else if (!manager.isOpen && this.isListeningForTap) {
      this.removeTapListeners();
    }

    if (!manager.isOpen) {
      // Clear the manager's items, so they
      // can be reloaded next time this menu opens
      manager.menuItems = [];
    }
  };

  Menu.prototype.componentWillUnmount = function componentWillUnmount() {
    this.removeTapListeners();
    this.props.manager.powerDown();
  };

  Menu.prototype.initTap = function initTap() {
    if (!document) return;

    new _tapJs2['default'](document.body);
  };

  Menu.prototype.addTapListeners = function addTapListeners() {
    if (!document) return;

    document.body.addEventListener('tap', this.tapHandler, true);
    this.isListeningForTap = true;
  };

  Menu.prototype.removeTapListeners = function removeTapListeners() {
    if (!document) return;

    document.body.removeEventListener('tap', this.tapHandler, true);
    this.isListeningForTap = false;
  };

  Menu.prototype.render = function render() {
    var _props = this.props;
    var manager = _props.manager;
    var children = _props.children;
    var tag = _props.tag;
    var className = _props.className;
    var id = _props.id;

    var childrenToRender = (function () {
      if (typeof children === 'function') {
        return children({ isOpen: manager.isOpen });
      }
      if (manager.isOpen) return children;
      return false;
    })();

    if (!childrenToRender) return false;

    return _react2['default'].createElement(tag, {
      className: className,
      id: id,
      onKeyDown: manager.handleMenuKey,
      role: 'menu',
      onBlur: manager.handleBlur
    }, childrenToRender);
  };

  return Menu;
})(_react2['default'].Component);

exports['default'] = Menu;

Menu.propTypes = {
  children: _react.PropTypes.oneOfType([_react.PropTypes.func, _react.PropTypes.element]).isRequired,
  manager: _react.PropTypes.object.isRequired,
  id: _react.PropTypes.string,
  className: _react.PropTypes.string,
  tag: _react.PropTypes.string
};

Menu.defaultProps = {
  tag: 'div'
};
module.exports = exports['default'];