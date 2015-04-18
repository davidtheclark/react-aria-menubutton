'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.__esModule = true;

var _React$Component$PropTypes = require('react');

var _React$Component$PropTypes2 = _interopRequireWildcard(_React$Component$PropTypes);

var _MenuItem = require('./MenuItem');

var _MenuItem2 = _interopRequireWildcard(_MenuItem);

var _cssClassnamer = require('./cssClassnamer');

var _cssClassnamer2 = _interopRequireWildcard(_cssClassnamer);

var Menu = (function (_Component) {
  function Menu() {
    _classCallCheck(this, Menu);

    if (_Component != null) {
      _Component.apply(this, arguments);
    }
  }

  _inherits(Menu, _Component);

  Menu.prototype.shouldComponentUpdate = function shouldComponentUpdate(newProps) {
    return this.props.selectedValue !== newProps.selectedValue;
  };

  Menu.prototype.componentWillMount = function componentWillMount() {
    this.props.focusManager.focusables = [];
  };

  Menu.prototype.componentDidMount = function componentDidMount() {
    if (this.props.receiveFocus) this.props.focusManager.move(0);
  };

  Menu.prototype.render = function render() {
    var props = this.props;
    var selectedValue = props.selectedValue;

    var items = props.items.map(function (item, i) {
      return _React$Component$PropTypes2['default'].createElement(
        'li',
        { key: i,
          className: _cssClassnamer2['default'].componentPart('menuItemWrapper'),
          role: 'presentation' },
        _React$Component$PropTypes2['default'].createElement(_MenuItem2['default'], _extends({}, item, {
          focusManager: props.focusManager,
          handleSelection: props.handleSelection,
          isSelected: item.value === selectedValue }))
      );
    });

    var menuClasses = [_cssClassnamer2['default'].componentPart('menu')];
    if (props.flushRight) menuClasses.push(_cssClassnamer2['default'].componentPart('menu--flushRight'));

    return _React$Component$PropTypes2['default'].createElement(
      'ol',
      { className: menuClasses.join(' '),
        role: 'menu' },
      items
    );
  };

  return Menu;
})(_React$Component$PropTypes.Component);

exports['default'] = Menu;

Menu.propTypes = {
  focusManager: _React$Component$PropTypes.PropTypes.object.isRequired,
  items: _React$Component$PropTypes.PropTypes.arrayOf(_React$Component$PropTypes.PropTypes.object).isRequired,
  flushRight: _React$Component$PropTypes.PropTypes.bool,
  handleSelection: _React$Component$PropTypes.PropTypes.func,
  receiveFocus: _React$Component$PropTypes.PropTypes.bool,
  selectedValue: _React$Component$PropTypes.PropTypes.oneOfType([_React$Component$PropTypes.PropTypes.string, _React$Component$PropTypes.PropTypes.number, _React$Component$PropTypes.PropTypes.bool])
};
module.exports = exports['default'];