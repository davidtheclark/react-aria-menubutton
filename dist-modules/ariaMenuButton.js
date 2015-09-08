'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Manager = require('./Manager');

var _Manager2 = _interopRequireDefault(_Manager);

var _Button = require('./Button');

var _Button2 = _interopRequireDefault(_Button);

var _Menu = require('./Menu');

var _Menu2 = _interopRequireDefault(_Menu);

var _MenuItem = require('./MenuItem');

var _MenuItem2 = _interopRequireDefault(_MenuItem);

// Create a new Manager and use it in wrappers for
// a Button, Menu, and MenuItem components that will
// be tied together

exports['default'] = function (options) {
  var manager = new _Manager2['default'](options);
  return {
    Button: (function (_React$Component) {
      _inherits(ButtonWrapper, _React$Component);

      function ButtonWrapper() {
        _classCallCheck(this, ButtonWrapper);

        _React$Component.apply(this, arguments);
      }

      ButtonWrapper.prototype.render = function render() {
        return _react2['default'].createElement(_Button2['default'], _extends({ manager: manager }, this.props));
      };

      return ButtonWrapper;
    })(_react2['default'].Component),
    Menu: (function (_React$Component2) {
      _inherits(MenuWrapper, _React$Component2);

      function MenuWrapper() {
        _classCallCheck(this, MenuWrapper);

        _React$Component2.apply(this, arguments);
      }

      MenuWrapper.prototype.render = function render() {
        return _react2['default'].createElement(_Menu2['default'], _extends({ manager: manager }, this.props));
      };

      return MenuWrapper;
    })(_react2['default'].Component),
    MenuItem: (function (_React$Component3) {
      _inherits(MenuItemWrapper, _React$Component3);

      function MenuItemWrapper() {
        _classCallCheck(this, MenuItemWrapper);

        _React$Component3.apply(this, arguments);
      }

      MenuItemWrapper.prototype.render = function render() {
        return _react2['default'].createElement(_MenuItem2['default'], _extends({ manager: manager }, this.props));
      };

      return MenuItemWrapper;
    })(_react2['default'].Component)
  };
};

module.exports = exports['default'];