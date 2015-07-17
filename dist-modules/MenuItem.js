'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _keys = require('./keys');

var _keys2 = _interopRequireDefault(_keys);

var MenuItem = (function (_React$Component) {
  _inherits(MenuItem, _React$Component);

  function MenuItem() {
    _classCallCheck(this, MenuItem);

    _React$Component.apply(this, arguments);
  }

  MenuItem.prototype.componentDidMount = function componentDidMount() {
    var props = this.props;
    this.managedIndex = props.manager.menuItems.push({
      node: _react2['default'].findDOMNode(this),
      content: props.children,
      text: props.text
    }) - 1;
  };

  MenuItem.prototype.handleKeyDown = function handleKeyDown(event) {
    if (event.key !== _keys2['default'].ENTER && event.key !== _keys2['default'].SPACE) return;
    event.preventDefault();
    this.selectItem(event);
  };

  MenuItem.prototype.selectItem = function selectItem(event) {
    var props = this.props;
    // If there's no value, we'll send the child
    var value = typeof props.value !== 'undefined' ? props.value : props.children;
    props.manager.handleSelection(value, event);
    props.manager.currentFocus = this.managedIndex;
  };

  MenuItem.prototype.render = function render() {
    var _props = this.props;
    var tag = _props.tag;
    var children = _props.children;
    var className = _props.className;
    var id = _props.id;

    return _react2['default'].createElement(tag, {
      className: className,
      id: id,
      onClick: this.selectItem.bind(this),
      onKeyDown: this.handleKeyDown.bind(this),
      // "The menu contains elements with roles: menuitem,
      // menuitemcheckbox, or menuitemradio depending on your implementation."
      role: 'menuitem',
      // "With focus on the button pressing the Tab key will
      // take the user to the next tab focusable item
      // on the page."
      //
      // "With focus on the drop-down menu, pressing the Tab
      // key will take the user to the next tab focusable
      // item on the page."
      //
      // "Menu focus is managed by the menu using tabindex
      // or aria-activedescendant."
      tabIndex: '-1'
    }, children);
  };

  return MenuItem;
})(_react2['default'].Component);

exports['default'] = MenuItem;

MenuItem.propTypes = {
  children: _react.PropTypes.oneOfType([_react.PropTypes.element, _react.PropTypes.string]).isRequired,
  manager: _react.PropTypes.object.isRequired,
  className: _react.PropTypes.string,
  id: _react.PropTypes.string,
  tag: _react.PropTypes.string,
  text: _react.PropTypes.string,
  value: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.number, _react.PropTypes.string])
};

MenuItem.defaultProps = {
  tag: 'div'
};
module.exports = exports['default'];