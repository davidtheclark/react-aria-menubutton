'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.__esModule = true;
exports['default'] = createAriaMenuButton;

var _React = require('react');

var _React2 = _interopRequireWildcard(_React);

var _import = require('./keys');

var keys = _interopRequireWildcard(_import);

var _Menu = require('./Menu');

var _Menu2 = _interopRequireWildcard(_Menu);

var _focusManager = require('./focusManager');

var _focusManager2 = _interopRequireWildcard(_focusManager);

function createAriaMenuButton() {
  var opts = arguments[0] === undefined ? {} : arguments[0];

  var CSSTransitionGroup = opts.reactAddons ? opts.reactAddons.CSSTransitionGroup : false;

  var AriaMenuButton = (function (_React$Component) {
    function AriaMenuButton(props) {
      _classCallCheck(this, AriaMenuButton);

      _React$Component.call(this, props);
      this.state = { isOpen: !!props.startOpen };
      this.focusManager = _focusManager2['default']();
    }

    _inherits(AriaMenuButton, _React$Component);

    AriaMenuButton.prototype.shouldComponentUpdate = function shouldComponentUpdate(newProps, newState) {
      return this.state.isOpen !== newState.isOpen || this.props.selectedValue !== newProps.selectedValue;
    };

    AriaMenuButton.prototype.componentWillMount = function componentWillMount() {
      if (this.props.transition && !CSSTransitionGroup) {
        throw new Error('If you want to use transitions with ariaMenuButton, you need to pass it ' + 'React with addons');
      }
    };

    AriaMenuButton.prototype.componentDidMount = function componentDidMount() {
      this.focusManager.trigger = _React2['default'].findDOMNode(this.refs.trigger);
    };

    AriaMenuButton.prototype.openMenu = function openMenu() {
      var innerFocus = arguments[0] === undefined ? false : arguments[0];

      this.setState({ isOpen: true, innerFocus: innerFocus });
    };

    AriaMenuButton.prototype.closeMenu = function closeMenu() {
      var _this = this;

      var focusTrigger = arguments[0] === undefined ? true : arguments[0];

      this.setState({ isOpen: false, innerFocus: false }, function () {
        if (focusTrigger) _this.focusManager.focusTrigger();
        _this.focusManager.currentFocus = -1;
      });
    };

    AriaMenuButton.prototype.toggleMenu = function toggleMenu() {
      if (this.state.isOpen) this.closeMenu();else this.openMenu();
    };

    AriaMenuButton.prototype.handleAnywhereKey = function handleAnywhereKey(e) {
      var key = e.key;
      var isLetterKey = isLetterKeyEvent(e);

      if (key !== keys.DOWN && !isLetterKey) {
        return;
      }e.preventDefault();

      if (key === keys.DOWN) {
        // "With focus on the button and the drop-down menu open,
        // pressing Down Arrow will move focus into the menu onto
        // the first menu item. [...]"
        // "With focus on the drop-down menu, the Up and Down Arrow
        // keys move focus within the menu items, "wrapping" at the top and bottom."
        if (this.state.isOpen) this.focusManager.moveDown();

        // "With focus on the button and no drop-down menu displayed,
        // pressing Down Arrow will open the drop-down menu and move focus
        // into the menu and onto the first menu item."
        else this.openMenu(true);
      } else if (isLetterKey && this.state.isOpen) this.checkLetterKeys(e.keyCode);
    };

    // "With focus on the button pressing Space or Enter will toggle
    // the display of the drop-down menu. Focus remains on the button."

    AriaMenuButton.prototype.handleTriggerKey = function handleTriggerKey(e) {
      var key = e.key;
      if (key !== keys.ENTER && key !== keys.SPACE) {
        return;
      }e.preventDefault();
      this.toggleMenu();
    };

    AriaMenuButton.prototype.handleMenuKey = function handleMenuKey(e) {
      // "With focus on the drop-down menu, pressing Escape closes
      // the menu and returns focus to the button.
      if (e.key === keys.ESCAPE) this.closeMenu();

      // "With focus on the drop-down menu, the Up and Down Arrow
      // keys move focus within the menu items, "wrapping" at the top and bottom."
      else if (e.key === keys.UP && this.state.isOpen) {
        e.preventDefault();
        this.focusManager.moveUp();
      }
    };

    AriaMenuButton.prototype.checkLetterKeys = function checkLetterKeys(kc) {
      // "Typing a letter (printable character) key moves focus to the next
      // instance of a visible node whose title begins with that printable letter."
      this.focusManager.moveToLetter(String.fromCharCode(kc));
    };

    AriaMenuButton.prototype.handleBlur = function handleBlur() {
      var _this2 = this;

      this.blurTimeout = setTimeout(function () {
        var activeEl = document.activeElement;
        if (activeEl === _this2.focusManager.trigger) return;
        if (_this2.focusManager.focusables.some(function (f) {
          return f.node === activeEl;
        })) return;
        if (_this2.state.isOpen) _this2.closeMenu(false);
      }, 0);
    };

    AriaMenuButton.prototype.handleSelection = function handleSelection(v) {
      if (this.props.closeOnSelection) this.closeMenu();
      this.props.handleSelection(v);
    };

    AriaMenuButton.prototype.handleOverlayClick = function handleOverlayClick() {
      console.log('overlay click triggered');
      this.closeMenu(false);
    };

    AriaMenuButton.prototype.render = function render() {
      var props = this.props;
      var isOpen = this.state.isOpen;

      var triggerId = props.id ? '' + props.id + '-trigger' : undefined;
      var outsideId = props.id ? '' + props.id + '-outside' : undefined;
      var triggerClasses = 'AriaMenuButton-trigger';
      if (isOpen) triggerClasses += ' is-open';

      var menu = isOpen ? _React2['default'].createElement(_Menu2['default'], _extends({}, props, {
        handleSelection: this.handleSelection.bind(this),
        receiveFocus: this.state.innerFocus,
        focusManager: this.focusManager })) : false;

      var menuWrapper = props.transition ? _React2['default'].createElement(
        CSSTransitionGroup,
        { transitionName: 'is',
          component: 'div',
          className: 'AriaMenuButton-menuWrapper AriaMenuButton-menuWrapper--trans',
          onKeyDown: this.handleMenuKey.bind(this) },
        menu
      ) : _React2['default'].createElement(
        'div',
        { className: 'AriaMenuButton-menuWrapper',
          onKeyDown: this.handleMenuKey.bind(this) },
        menu
      );

      // The outsideOverlay and its accompanying innerStyle are here
      // to make the menu close when there is a click outside it
      // (mobile browsers will not fire the onBlur handler).
      // They are styled inline here because they should be the same
      // in every situation.

      var innerStyle = !isOpen ? {} : {
        display: 'inline-block',
        position: 'relative',
        zIndex: '100'
      };

      var outsideOverlay = !isOpen ? false : _React2['default'].createElement('div', { id: outsideId,
        onClick: this.handleOverlayClick.bind(this),
        ref: 'overlay',
        style: {
          cursor: 'pointer',
          position: 'fixed',
          top: 0, bottom: 0, left: 0, right: 0,
          zIndex: '99',
          WebkitTapHighlightColor: 'rgba(0,0,0,0)'
        } });

      return _React2['default'].createElement(
        'div',
        { id: props.id,
          className: 'AriaMenuButton',
          onKeyDown: this.handleAnywhereKey.bind(this),
          onBlur: this.handleBlur.bind(this) },
        outsideOverlay,
        _React2['default'].createElement(
          'div',
          { style: innerStyle },
          _React2['default'].createElement(
            'div',
            { id: triggerId,
              className: triggerClasses,
              onClick: this.toggleMenu.bind(this),
              onKeyDown: this.handleTriggerKey.bind(this),
              ref: 'trigger',
              'aria-haspopup': true,
              'aria-expanded': isOpen,
              role: 'button',
              tabIndex: '0' },
            props.triggerContent
          ),
          menuWrapper
        )
      );
    };

    return AriaMenuButton;
  })(_React2['default'].Component);

  var pt = _React2['default'].PropTypes;

  AriaMenuButton.propTypes = {
    handleSelection: pt.func.isRequired,
    items: pt.arrayOf(pt.object).isRequired,
    triggerContent: pt.oneOfType([pt.string, pt.element]).isRequired,
    closeOnSelection: pt.bool,
    flushRight: pt.bool,
    id: pt.string,
    startOpen: pt.bool,
    selectedValue: pt.oneOfType([pt.string, pt.number, pt.bool]),
    transition: pt.bool
  };

  return AriaMenuButton;
}

function isLetterKeyEvent(e) {
  return e.keyCode >= keys.LOWEST_LETTER_CODE && e.keyCode <= keys.HIGHEST_LETTER_CODE;
}
module.exports = exports['default'];