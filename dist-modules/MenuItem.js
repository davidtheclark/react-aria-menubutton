'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _keys = require('./keys');

var _cssClassnamer = require('./cssClassnamer');

var _cssClassnamer2 = _interopRequireDefault(_cssClassnamer);

var MenuItem = (function (_Component) {
  function MenuItem() {
    _classCallCheck(this, MenuItem);

    _Component.apply(this, arguments);
  }

  _inherits(MenuItem, _Component);

  MenuItem.prototype.shouldComponentUpdate = function shouldComponentUpdate(newProps) {
    return this.props.isSelected !== newProps.isSelected;
  };

  MenuItem.prototype.componentDidMount = function componentDidMount() {
    this.props.focusManager.focusables.push({
      content: this.props.content,
      text: this.props.text,
      node: _react2['default'].findDOMNode(this)
    });
  };

  MenuItem.prototype.handleClick = function handleClick(e) {
    var props = this.props;
    if (props.isSelected) return;
    // If there's no value, we'll send the label
    var v = typeof props.value !== 'undefined' ? props.value : props.content;
    props.handleSelection(v, e);
  };

  MenuItem.prototype.handleKey = function handleKey(e) {
    if (e.key !== _keys.ENTER && e.key !== _keys.SPACE) return;
    e.preventDefault();
    this.handleClick(e);
  };

  MenuItem.prototype.render = function render() {
    var props = this.props;
    var itemClasses = [_cssClassnamer2['default'].componentPart('menuItem')];
    if (props.isSelected) itemClasses.push(_cssClassnamer2['default'].applyNamespace('is-selected'));

    // tabindex -1 because: "With focus on the button pressing
    // the Tab key will take the user to the next tab focusable item on the page.
    // With focus on the drop-down menu, pressing the Tab key will take the user
    // to the next tab focusable item on the page."
    // "A menuitem within a menu or menubar may appear in the tab order
    // only if it is not within a popup menu."
    // ... so not in tab order, but programatically focusable
    return _react2['default'].createElement(
      'div',
      { id: props.id,
        className: itemClasses.join(' '),
        onClick: this.handleClick.bind(this),
        onKeyDown: this.handleKey.bind(this),
        role: 'menuitem',
        tabIndex: '-1',
        'data-value': props.value },
      props.content
    );
  };

  return MenuItem;
})(_react.Component);

exports['default'] = MenuItem;

MenuItem.propTypes = {
  focusManager: _react.PropTypes.object.isRequired,
  handleSelection: _react.PropTypes.func.isRequired,
  content: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.element]).isRequired,
  id: _react.PropTypes.string,
  isSelected: _react.PropTypes.bool,
  text: _react.PropTypes.string,
  value: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number, _react.PropTypes.bool])
};
module.exports = exports['default'];