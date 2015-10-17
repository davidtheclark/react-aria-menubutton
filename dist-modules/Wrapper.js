'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Manager = require('./Manager');

var _Manager2 = _interopRequireDefault(_Manager);

var Wrapper = (function (_React$Component) {
  _inherits(Wrapper, _React$Component);

  function Wrapper() {
    _classCallCheck(this, Wrapper);

    _React$Component.apply(this, arguments);
  }

  Wrapper.prototype.componentWillMount = function componentWillMount() {
    this.manager = new _Manager2['default']({
      onSelection: this.props.onSelection,
      closeOnSelection: this.props.closeOnSelection
    });
  };

  Wrapper.prototype.getChildContext = function getChildContext() {
    return {
      ambManager: this.manager
    };
  };

  Wrapper.prototype.render = function render() {
    var _props = this.props;
    var tag = _props.tag;
    var id = _props.id;
    var className = _props.className;
    var style = _props.style;

    return _react2['default'].createElement(tag, {
      id: id,
      className: className,
      style: style
    }, this.props.children);
  };

  return Wrapper;
})(_react2['default'].Component);

exports['default'] = Wrapper;

Wrapper.childContextTypes = {
  ambManager: _react.PropTypes.object.isRequired
};

Wrapper.propTypes = {
  children: _react.PropTypes.node.isRequired,
  onSelection: _react.PropTypes.func.isRequired,
  closeOnSelection: _react.PropTypes.bool,
  id: _react.PropTypes.string,
  className: _react.PropTypes.string,
  style: _react.PropTypes.object,
  tag: _react.PropTypes.string
};

Wrapper.defaultProps = {
  tag: 'div'
};
module.exports = exports['default'];