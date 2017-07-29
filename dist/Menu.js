'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp2;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var ReactDOM = require('react-dom');
var PropTypes = require('prop-types');
var createTapListener = require('teeny-tap');
var specialAssign = require('./specialAssign');

var checkedProps = {
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
  tag: PropTypes.string
};

module.exports = (_temp2 = _class = function (_React$Component) {
  _inherits(_class, _React$Component);

  function _class() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, _class);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = _class.__proto__ || Object.getPrototypeOf(_class)).call.apply(_ref, [this].concat(args))), _this), _this.addTapListener = function () {
      var el = ReactDOM.findDOMNode(_this);
      if (!el) return;
      var doc = el.ownerDocument;
      if (!doc) return;
      _this.tapListener = createTapListener(doc.documentElement, _this.handleTap);
    }, _this.handleTap = function (event) {
      if (ReactDOM.findDOMNode(_this).contains(event.target)) return;
      if (ReactDOM.findDOMNode(_this.context.ambManager.button).contains(event.target)) return;
      _this.context.ambManager.closeMenu();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(_class, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.context.ambManager.menu = this;
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var ambManager = this.context.ambManager;
      if (ambManager.isOpen && !this.tapListener) {
        this.addTapListener();
      } else if (!ambManager.isOpen && this.tapListener) {
        this.tapListener.remove();
        delete this.tapListener;
      }

      if (!ambManager.isOpen) {
        // Clear the ambManager's items, so they
        // can be reloaded next time this menu opens
        ambManager.clearItems();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.tapListener) this.tapListener.remove();
      this.context.ambManager.destroy();
    }
  }, {
    key: 'render',
    value: function render() {
      var props = this.props;
      var ambManager = this.context.ambManager;

      var childrenToRender = function () {
        if (typeof props.children === 'function') {
          return props.children({ isOpen: ambManager.isOpen });
        }
        if (ambManager.isOpen) return props.children;
        return false;
      }();

      if (!childrenToRender) return false;

      var menuProps = {
        onKeyDown: ambManager.handleMenuKey,
        role: 'menu',
        onBlur: ambManager.handleBlur,
        tabIndex: -1
      };

      specialAssign(menuProps, props, checkedProps);

      return React.createElement(props.tag, menuProps, childrenToRender);
    }
  }]);

  return _class;
}(React.Component), _class.propTypes = checkedProps, _class.defaultProps = { tag: 'div' }, _class.contextTypes = {
  ambManager: PropTypes.object.isRequired
}, _temp2);