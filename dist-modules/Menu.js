'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var Menu = (function (_React$Component) {
  _inherits(Menu, _React$Component);

  function Menu(props) {
    _classCallCheck(this, Menu);

    _React$Component.call(this, props);
    props.manager.menu = this;
  }

  Menu.prototype.componentWillUpdate = function componentWillUpdate() {
    var manager = this.props.manager;

    if (!manager.isOpen) {
      // Clear the manager's items, so they
      // can be reloaded next time this menu opens
      manager.menuItems = [];
    }
  };

  Menu.prototype.render = function render() {
    var _props = this.props;
    var manager = _props.manager;
    var children = _props.children;
    var tag = _props.tag;
    var className = _props.className;
    var id = _props.id;
    var noOverlay = _props.noOverlay;

    var childrenToRender = (function () {
      if (typeof children === 'function') {
        return children({ isOpen: manager.isOpen });
      }
      if (manager.isOpen) return children;
      return [];
    })();

    var menuEl = _react2['default'].createElement(tag, {
      className: className,
      id: id,
      onKeyDown: manager.handleMenuKey,
      role: 'menu',
      onBlur: manager.handleBlur,
      style: noOverlay ? undefined : { position: 'relative', zIndex: 100 }
    }, childrenToRender);

    if (noOverlay) return menuEl;

    var overlay = !manager.isOpen ? false : _react2['default'].createElement('div', {
      style: {
        cursor: 'pointer',
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        WebkitTapHighlightColor: 'rgba(0,0,0,0)',
        zIndex: 99
      },
      onClick: manager.closeMenu
    });

    return _react2['default'].createElement('div', {}, menuEl, overlay);
  };

  return Menu;
})(_react2['default'].Component);

exports['default'] = Menu;

Menu.propTypes = {
  children: _react.PropTypes.oneOfType([_react.PropTypes.func, _react.PropTypes.element]).isRequired,
  manager: _react.PropTypes.object.isRequired,
  id: _react.PropTypes.string,
  className: _react.PropTypes.string,
  noOverlay: _react.PropTypes.bool,
  tag: _react.PropTypes.string
};

Menu.defaultProps = {
  tag: 'div'
};
module.exports = exports['default'];