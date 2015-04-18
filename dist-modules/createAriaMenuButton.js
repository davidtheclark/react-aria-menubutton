'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.__esModule = true;
exports['default'] = createAriaMenuButton;

var _React$Component$PropTypes = require('react');

var _React$Component$PropTypes2 = _interopRequireWildcard(_React$Component$PropTypes);

var _import = require('./keys');

var keys = _interopRequireWildcard(_import);

var _Menu = require('./Menu');

var _Menu2 = _interopRequireWildcard(_Menu);

var _focusManager = require('./focusManager');

var _focusManager2 = _interopRequireWildcard(_focusManager);

var _cssClassnamer = require('./cssClassnamer');

var _cssClassnamer2 = _interopRequireWildcard(_cssClassnamer);

function createAriaMenuButton() {
  var opts = arguments[0] === undefined ? {} : arguments[0];

  _cssClassnamer2['default'].init(opts.componentName, opts.namespace);

  var TransitionGroup = false;
  if (opts.transition) {
    if (opts.transition.displayName !== 'ReactCSSTransitionGroup') {
      throw new Error('createAriaMenuButtons `transition` option expects a ReactCSSTransitionGroup');
    }
    TransitionGroup = opts.transition;
  }

  var MenuButton = (function (_Component) {
    function MenuButton(props) {
      _classCallCheck(this, MenuButton);

      _Component.call(this, props);
      this.state = { isOpen: !!props.startOpen };
      this.focusManager = _focusManager2['default']();
    }

    _inherits(MenuButton, _Component);

    MenuButton.prototype.shouldComponentUpdate = function shouldComponentUpdate(newProps, newState) {
      return this.state.isOpen !== newState.isOpen || this.props.selectedValue !== newProps.selectedValue;
    };

    MenuButton.prototype.componentDidMount = function componentDidMount() {
      this.focusManager.trigger = _React$Component$PropTypes2['default'].findDOMNode(this.refs.trigger);
    };

    MenuButton.prototype.openMenu = function openMenu() {
      var innerFocus = arguments[0] === undefined ? false : arguments[0];

      this.setState({ isOpen: true, innerFocus: innerFocus });
    };

    MenuButton.prototype.closeMenu = function closeMenu() {
      var _this = this;

      var focusTrigger = arguments[0] === undefined ? true : arguments[0];

      this.setState({ isOpen: false, innerFocus: false }, function () {
        if (focusTrigger) _this.focusManager.focusTrigger();
        _this.focusManager.currentFocus = -1;
      });
    };

    MenuButton.prototype.toggleMenu = function toggleMenu() {
      if (this.state.isOpen) this.closeMenu();else this.openMenu();
    };

    MenuButton.prototype.handleAnywhereKey = function handleAnywhereKey(e) {
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

    MenuButton.prototype.handleTriggerKey = function handleTriggerKey(e) {
      var key = e.key;
      if (key !== keys.ENTER && key !== keys.SPACE) {
        return;
      }e.preventDefault();
      this.toggleMenu();
    };

    MenuButton.prototype.handleMenuKey = function handleMenuKey(e) {
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

    MenuButton.prototype.checkLetterKeys = function checkLetterKeys(kc) {
      // "Typing a letter (printable character) key moves focus to the next
      // instance of a visible node whose title begins with that printable letter."
      this.focusManager.moveToLetter(String.fromCharCode(kc));
    };

    MenuButton.prototype.handleBlur = function handleBlur() {
      var _this2 = this;

      setTimeout(function () {
        var activeEl = document.activeElement;
        if (activeEl === _this2.focusManager.trigger) return;
        if (_this2.focusManager.focusables.some(function (f) {
          return f.node === activeEl;
        })) return;
        if (_this2.state.isOpen) _this2.closeMenu(false);
      }, 0);
    };

    MenuButton.prototype.handleSelection = function handleSelection(v) {
      if (this.props.closeOnSelection) this.closeMenu();
      this.props.handleSelection(v);
    };

    MenuButton.prototype.handleOverlayClick = function handleOverlayClick() {
      this.closeMenu(false);
    };

    MenuButton.prototype.render = function render() {
      var props = this.props;
      var isOpen = this.state.isOpen;

      var triggerId = props.id ? '' + props.id + '-trigger' : undefined;
      var outsideId = props.id ? '' + props.id + '-outside' : undefined;
      var triggerClasses = [_cssClassnamer2['default'].componentPart('trigger')];
      if (isOpen) triggerClasses.push(_cssClassnamer2['default'].applyNamespace('is-open'));

      var menu = isOpen ? _React$Component$PropTypes2['default'].createElement(_Menu2['default'], _extends({}, props, {
        handleSelection: this.handleSelection.bind(this),
        receiveFocus: this.state.innerFocus,
        focusManager: this.focusManager })) : false;

      var menuWrapper = TransitionGroup ? _React$Component$PropTypes2['default'].createElement(
        TransitionGroup,
        { transitionName: _cssClassnamer2['default'].applyNamespace('is'),
          component: 'div',
          className: [_cssClassnamer2['default'].componentPart('menuWrapper'), _cssClassnamer2['default'].componentPart('menuWrapper--transition')].join(' '),
          onKeyDown: this.handleMenuKey.bind(this) },
        menu
      ) : _React$Component$PropTypes2['default'].createElement(
        'div',
        { className: _cssClassnamer2['default'].componentPart('menuWrapper'),
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

      var outsideOverlay = !isOpen ? false : _React$Component$PropTypes2['default'].createElement('div', { id: outsideId,
        onClick: this.handleOverlayClick.bind(this),
        ref: 'overlay',
        style: {
          cursor: 'pointer',
          position: 'fixed',
          top: 0, bottom: 0, left: 0, right: 0,
          zIndex: '99',
          WebkitTapHighlightColor: 'rgba(0,0,0,0)'
        } });

      return _React$Component$PropTypes2['default'].createElement(
        'div',
        { id: props.id,
          className: _cssClassnamer2['default'].componentPart(),
          onKeyDown: this.handleAnywhereKey.bind(this),
          onBlur: this.handleBlur.bind(this) },
        outsideOverlay,
        _React$Component$PropTypes2['default'].createElement(
          'div',
          { style: innerStyle },
          _React$Component$PropTypes2['default'].createElement(
            'div',
            { id: triggerId,
              className: triggerClasses.join(' '),
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

    return MenuButton;
  })(_React$Component$PropTypes.Component);

  MenuButton.propTypes = {
    handleSelection: _React$Component$PropTypes.PropTypes.func.isRequired,
    items: _React$Component$PropTypes.PropTypes.arrayOf(_React$Component$PropTypes.PropTypes.object).isRequired,
    triggerContent: _React$Component$PropTypes.PropTypes.oneOfType([_React$Component$PropTypes.PropTypes.string, _React$Component$PropTypes.PropTypes.element]).isRequired,
    closeOnSelection: _React$Component$PropTypes.PropTypes.bool,
    flushRight: _React$Component$PropTypes.PropTypes.bool,
    id: _React$Component$PropTypes.PropTypes.string,
    startOpen: _React$Component$PropTypes.PropTypes.bool,
    selectedValue: _React$Component$PropTypes.PropTypes.oneOfType([_React$Component$PropTypes.PropTypes.string, _React$Component$PropTypes.PropTypes.number, _React$Component$PropTypes.PropTypes.bool])
  };

  return MenuButton;
}

function isLetterKeyEvent(e) {
  return e.keyCode >= keys.LOWEST_LETTER_CODE && e.keyCode <= keys.HIGHEST_LETTER_CODE;
}
module.exports = exports['default'];