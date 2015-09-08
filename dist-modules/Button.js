'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _keys = require('./keys');

var _keys2 = _interopRequireDefault(_keys);

var Button = (function (_React$Component) {
  _inherits(Button, _React$Component);

  function Button(props) {
    _classCallCheck(this, Button);

    _React$Component.call(this, props);
    props.manager.button = this;
  }

  Button.prototype.handleKeyDown = function handleKeyDown(event) {
    var manager = this.props.manager;
    var key = event.key;

    if (key === _keys2['default'].DOWN) {
      event.preventDefault();
      if (!manager.isOpen) manager.openMenu({ focusMenu: true });else manager.moveFocusDown();
      return;
    }

    if (key === _keys2['default'].ENTER || key === _keys2['default'].SPACE) {
      event.preventDefault();
      manager.toggleMenu();
      return;
    }

    manager.handleMenuKey(event);
  };

  Button.prototype.handleClick = function handleClick() {
    this.props.manager.toggleMenu();
  };

  Button.prototype.render = function render() {
    var _props = this.props;
    var manager = _props.manager;
    var children = _props.children;
    var tag = _props.tag;
    var className = _props.className;
    var id = _props.id;

    return _react2['default'].createElement(tag, {
      className: className,
      id: id,
      // "The menu button itself has a role of button."
      role: 'button',
      tabIndex: '0',
      // "The menu button has an aria-haspopup property, set to true."
      'aria-haspopup': true,
      'aria-expanded': manager.isOpen,
      onKeyDown: this.handleKeyDown.bind(this),
      onClick: this.handleClick.bind(this),
      onBlur: manager.handleBlur
    }, children);
  };

  return Button;
})(_react2['default'].Component);

exports['default'] = Button;

Button.propTypes = {
  children: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.element]).isRequired,
  manager: _react.PropTypes.object.isRequired,
  className: _react.PropTypes.string,
  id: _react.PropTypes.string,
  tag: _react.PropTypes.string
};

Button.defaultProps = {
  tag: 'span'
};
module.exports = exports['default'];