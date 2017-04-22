'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');
var PropTypes = require('prop-types');
var createManager = require('./createManager');
var specialAssign = require('./specialAssign');

var checkedProps = {
  children: PropTypes.node.isRequired,
  onMenuToggle: PropTypes.func,
  onSelection: PropTypes.func.isRequired,
  closeOnSelection: PropTypes.bool,
  tag: PropTypes.string
};

var AriaMenuButtonWrapper = function (_React$Component) {
  _inherits(AriaMenuButtonWrapper, _React$Component);

  function AriaMenuButtonWrapper() {
    _classCallCheck(this, AriaMenuButtonWrapper);

    return _possibleConstructorReturn(this, (AriaMenuButtonWrapper.__proto__ || Object.getPrototypeOf(AriaMenuButtonWrapper)).apply(this, arguments));
  }

  _createClass(AriaMenuButtonWrapper, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        ambManager: this.manager
      };
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.manager = createManager({
        onMenuToggle: this.props.onMenuToggle,
        onSelection: this.props.onSelection,
        closeOnSelection: this.props.closeOnSelection,
        id: this.props.id
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var wrapperProps = {};
      specialAssign(wrapperProps, this.props, checkedProps);
      return React.createElement(this.props.tag, wrapperProps, this.props.children);
    }
  }]);

  return AriaMenuButtonWrapper;
}(React.Component);

AriaMenuButtonWrapper.propTypes = checkedProps;
AriaMenuButtonWrapper.defaultProps = { tag: 'div' };
AriaMenuButtonWrapper.childContextTypes = {
  ambManager: PropTypes.object
};


module.exports = AriaMenuButtonWrapper;