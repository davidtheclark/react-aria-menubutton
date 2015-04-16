'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.__esModule = true;
exports['default'] = createMenu;

var _createMenuItem = require('./createMenuItem');

var _createMenuItem2 = _interopRequireWildcard(_createMenuItem);

function createMenu(React) {

  var MenuItem = _createMenuItem2['default'](React);

  var Menu = (function (_React$Component) {
    function Menu() {
      _classCallCheck(this, Menu);

      if (_React$Component != null) {
        _React$Component.apply(this, arguments);
      }
    }

    _inherits(Menu, _React$Component);

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
        return React.createElement(
          'li',
          { key: i,
            className: 'AriaMenuButton-li',
            role: 'presentation' },
          React.createElement(MenuItem, _extends({}, item, {
            focusManager: props.focusManager,
            handleSelection: props.handleSelection,
            isSelected: item.value === selectedValue }))
        );
      });

      var menuClasses = 'AriaMenuButton-menu';
      if (props.flushRight) menuClasses += ' AriaMenuButton-menu--flushRight';

      return React.createElement(
        'ol',
        { className: menuClasses,
          role: 'menu' },
        items
      );
    };

    return Menu;
  })(React.Component);

  var pt = React.PropTypes;
  Menu.propTypes = {
    focusManager: pt.object.isRequired,
    items: pt.arrayOf(pt.object).isRequired,
    flushRight: pt.bool,
    handleSelection: pt.func,
    receiveFocus: pt.bool,
    selectedValue: pt.any
  };

  return Menu;
}

module.exports = exports['default'];