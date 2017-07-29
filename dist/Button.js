'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var PropTypes = require('prop-types');
var specialAssign = require('./specialAssign');

var checkedProps = {
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  tag: PropTypes.string
};

var AriaMenuButtonButton = function (_React$Component) {
  _inherits(AriaMenuButtonButton, _React$Component);

  function AriaMenuButtonButton() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, AriaMenuButtonButton);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = AriaMenuButtonButton.__proto__ || Object.getPrototypeOf(AriaMenuButtonButton)).call.apply(_ref, [this].concat(args))), _this), _this.handleKeyDown = function (event) {
      if (_this.props.disabled) return;

      var ambManager = _this.context.ambManager;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          if (!ambManager.isOpen) {
            ambManager.openMenu();
          } else {
            ambManager.focusItem(0);
          }
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          ambManager.toggleMenu();
          break;
        case 'Escape':
          ambManager.handleMenuKey(event);
          break;
        default:
          // (Potential) letter keys
          ambManager.handleButtonNonArrowKey(event);
      }
    }, _this.handleClick = function () {
      if (_this.props.disabled) return;
      _this.context.ambManager.toggleMenu({}, { focusMenu: false });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(AriaMenuButtonButton, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.context.ambManager.button = this;
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.context.ambManager.destroy();
    }
  }, {
    key: 'render',
    value: function render() {
      var props = this.props;

      var buttonProps = {
        // "The menu button itself has a role of button."
        role: 'button',
        tabIndex: props.disabled ? '' : '0',
        // "The menu button has an aria-haspopup property, set to true."
        'aria-haspopup': true,
        'aria-expanded': this.context.ambManager.isOpen,
        'aria-disabled': props.disabled,
        onKeyDown: this.handleKeyDown,
        onClick: this.handleClick,
        onBlur: this.context.ambManager.handleBlur
      };

      specialAssign(buttonProps, props, checkedProps);

      return React.createElement(props.tag, buttonProps, props.children);
    }
  }]);

  return AriaMenuButtonButton;
}(React.Component);

AriaMenuButtonButton.propTypes = checkedProps;
AriaMenuButtonButton.contextTypes = {
  ambManager: PropTypes.object.isRequired
};
AriaMenuButtonButton.defaultProps = { tag: 'span' };


module.exports = AriaMenuButtonButton;