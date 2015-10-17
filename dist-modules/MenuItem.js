'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _keys = require('./keys');

var _keys2 = _interopRequireDefault(_keys);

var MenuItem = (function (_React$Component) {
  _inherits(MenuItem, _React$Component);

  function MenuItem() {
    _classCallCheck(this, MenuItem);

    _React$Component.apply(this, arguments);
  }

  MenuItem.prototype.componentDidMount = function componentDidMount() {
    this.managedIndex = this.context.ambManager.menuItems.push({
      node: _reactDom2['default'].findDOMNode(this),
      content: this.props.children,
      text: this.props.text
    }) - 1;
  };

  MenuItem.prototype.handleKeyDown = function handleKeyDown(event) {
    if (event.key !== _keys2['default'].ENTER && event.key !== _keys2['default'].SPACE) return;
    event.preventDefault();
    this.selectItem(event);
  };

  MenuItem.prototype.selectItem = function selectItem(event) {
    // If there's no value, we'll send the child
    var value = typeof this.props.value !== 'undefined' ? this.props.value : this.props.children;
    this.context.ambManager.handleSelection(value, event);
    this.context.ambManager.currentFocus = this.managedIndex;
  };

  MenuItem.prototype.render = function render() {
    var _props = this.props;
    var tag = _props.tag;
    var children = _props.children;
    var className = _props.className;
    var id = _props.id;
    var style = _props.style;

    return _react2['default'].createElement(tag, {
      className: className,
      id: id,
      style: style,
      onClick: this.selectItem.bind(this),
      onKeyDown: this.handleKeyDown.bind(this),
      role: 'menuitem',
      tabIndex: '-1'
    }, children);
  };

  return MenuItem;
})(_react2['default'].Component);

exports['default'] = MenuItem;

MenuItem.propTypes = {
  children: _react.PropTypes.node.isRequired,
  className: _react.PropTypes.string,
  id: _react.PropTypes.string,
  style: _react.PropTypes.object,
  tag: _react.PropTypes.string,
  text: _react.PropTypes.string,
  value: _react.PropTypes.any
};

MenuItem.defaultProps = {
  tag: 'div'
};

MenuItem.contextTypes = {
  ambManager: _react.PropTypes.object.isRequired
};
module.exports = exports['default'];