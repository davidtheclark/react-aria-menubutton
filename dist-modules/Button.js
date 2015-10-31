'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _keys = require('./keys');

var _keys2 = _interopRequireDefault(_keys);

var Button = (function (_React$Component) {
  _inherits(Button, _React$Component);

  function Button() {
    _classCallCheck(this, Button);

    _React$Component.apply(this, arguments);
  }

  Button.prototype.componentWillMount = function componentWillMount() {
    this.context.ambManager.button = this;
  };

  Button.prototype.componentWillUnmount = function componentWillUnmount() {
    this.context.ambManager.destroy();
  };

  Button.prototype.handleKeyDown = function handleKeyDown(event) {
    if (this.props.disabled) return;
    var ambManager = this.context.ambManager;
    var key = event.key;

    if (key === _keys2['default'].DOWN) {
      event.preventDefault();
      if (!ambManager.isOpen) {
        ambManager.openMenu({ focusMenu: true });
      } else {
        ambManager.moveFocusDown();
      }
      return;
    }

    if (key === _keys2['default'].ENTER || key === _keys2['default'].SPACE) {
      event.preventDefault();
      ambManager.toggleMenu();
      return;
    }

    ambManager.handleMenuKey(event);
  };

  Button.prototype.handleClick = function handleClick() {
    if (this.props.disabled) return;
    this.context.ambManager.toggleMenu();
  };

  Button.prototype.render = function render() {
    var _props = this.props;
    var children = _props.children;
    var tag = _props.tag;
    var className = _props.className;
    var id = _props.id;
    var style = _props.style;
    var ambManager = this.context.ambManager;

    return _react2['default'].createElement(tag, {
      className: className,
      id: id,
      style: style,
      // "The menu button itself has a role of button."
      role: 'button',
      tabIndex: this.props.disabled ? '' : '0',
      // "The menu button has an aria-haspopup property, set to true."
      'aria-haspopup': true,
      'aria-expanded': ambManager.isOpen,
      'aria-disabled': this.props.disabled,
      onKeyDown: this.handleKeyDown.bind(this),
      onClick: this.handleClick.bind(this),
      onBlur: ambManager.handleBlur
    }, children);
  };

  return Button;
})(_react2['default'].Component);

exports['default'] = Button;

Button.propTypes = {
  children: _react.PropTypes.node.isRequired,
  className: _react.PropTypes.string,
  disabled: _react.PropTypes.bool,
  id: _react.PropTypes.string,
  style: _react.PropTypes.object,
  tag: _react.PropTypes.string
};

Button.defaultProps = {
  tag: 'span'
};

Button.contextTypes = {
  ambManager: _react.PropTypes.object.isRequired
};
module.exports = exports['default'];