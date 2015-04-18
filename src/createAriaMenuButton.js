import React, { Component, PropTypes } from 'react';
import * as keys from './keys';
import Menu from './Menu';
import focusManager from './focusManager';
import cssClassnamer from './cssClassnamer';

export default function createAriaMenuButton(opts={}) {

  cssClassnamer.init(opts.componentName, opts.namespace);

  let TransitionGroup = false;
  if (opts.transition) {
    if (opts.transition.displayName !== 'ReactCSSTransitionGroup') {
      throw new Error(
        'createAriaMenuButton\s `transition` option expects a ReactCSSTransitionGroup'
      );
    }
    TransitionGroup = opts.transition;
  }

  class MenuButton extends Component {

    constructor(props) {
      super(props);
      this.state = { isOpen: !!props.startOpen };
      this.focusManager = focusManager();
    }

    shouldComponentUpdate(newProps, newState) {
      return (
        this.state.isOpen !== newState.isOpen
        || this.props.selectedValue !== newProps.selectedValue
      );
    }

    componentDidMount() {
      this.focusManager.trigger = React.findDOMNode(this.refs.trigger);
    }

    openMenu(innerFocus=false) {
      this.setState({ isOpen: true, innerFocus: innerFocus });
    }

    closeMenu(focusTrigger=true) {
      this.setState({ isOpen: false, innerFocus: false }, () => {
        if (focusTrigger) this.focusManager.focusTrigger();
        this.focusManager.currentFocus = -1;
      });
    }

    toggleMenu() {
      if (this.state.isOpen) this.closeMenu();
      else this.openMenu();
    }

    handleAnywhereKey(e) {
      const key = e.key;
      const isLetterKey = isLetterKeyEvent(e);

      if (key !== keys.DOWN && !isLetterKey) return;
      e.preventDefault();

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
      }

      else if (isLetterKey && this.state.isOpen) this.checkLetterKeys(e.keyCode);
    }

    // "With focus on the button pressing Space or Enter will toggle
    // the display of the drop-down menu. Focus remains on the button."
    handleTriggerKey(e) {
      const key = e.key;
      if (key !== keys.ENTER && key !== keys.SPACE) return;
      e.preventDefault();
      this.toggleMenu();
    }

    handleMenuKey(e) {
      // "With focus on the drop-down menu, pressing Escape closes
      // the menu and returns focus to the button.
      if (e.key === keys.ESCAPE) this.closeMenu();

      // "With focus on the drop-down menu, the Up and Down Arrow
      // keys move focus within the menu items, "wrapping" at the top and bottom."
      else if (e.key === keys.UP && this.state.isOpen) {
        e.preventDefault();
        this.focusManager.moveUp();
      }
    }

    checkLetterKeys(kc) {
      // "Typing a letter (printable character) key moves focus to the next
      // instance of a visible node whose title begins with that printable letter."
      this.focusManager.moveToLetter(String.fromCharCode(kc));
    }

    handleBlur() {
      setTimeout(() => {
        const activeEl = document.activeElement;
        if (activeEl === this.focusManager.trigger) return;
        if (this.focusManager.focusables.some(f => f.node === activeEl)) return;
        if (this.state.isOpen) this.closeMenu(false);
      }, 0);
    }

    handleSelection(v) {
      if (this.props.closeOnSelection) this.closeMenu();
      this.props.handleSelection(v);
    }

    handleOverlayClick() {
      this.closeMenu(false);
    }

    render() {
      const props = this.props;
      const isOpen = this.state.isOpen;

      const triggerId = (props.id) ? `${props.id}-trigger` : undefined;
      const outsideId = (props.id) ? `${props.id}-outside` : undefined;
      const triggerClasses = [cssClassnamer.componentPart('trigger')];
      if (isOpen) triggerClasses.push(cssClassnamer.applyNamespace('is-open'));

      const menu = (isOpen) ? (
        <Menu {...props}
         handleSelection={this.handleSelection.bind(this)}
         receiveFocus={this.state.innerFocus}
         focusManager={this.focusManager} />
      ) : false;

      const menuWrapper = (TransitionGroup) ? (
        <TransitionGroup transitionName={cssClassnamer.applyNamespace('is')}
         component='div'
         className={[
           cssClassnamer.componentPart('menuWrapper'),
           cssClassnamer.componentPart('menuWrapper--transition')
         ].join(' ')}
         onKeyDown={this.handleMenuKey.bind(this)}>
          {menu}
        </TransitionGroup>
      ) : (
        <div className={cssClassnamer.componentPart('menuWrapper')}
         onKeyDown={this.handleMenuKey.bind(this)}>
          {menu}
        </div>
      );

      // The outsideOverlay and its accompanying innerStyle are here
      // to make the menu close when there is a click outside it
      // (mobile browsers will not fire the onBlur handler).
      // They are styled inline here because they should be the same
      // in every situation.

      const innerStyle = (!isOpen) ? {} : {
        display: 'inline-block',
        position: 'relative',
        zIndex: '100'
      };

      const outsideOverlay = (!isOpen) ? false : (
        <div id={outsideId}
         onClick={this.handleOverlayClick.bind(this)}
         ref='overlay'
         style={{
           cursor: 'pointer',
           position: 'fixed',
           top: 0, bottom: 0, left: 0, right: 0,
           zIndex: '99',
           WebkitTapHighlightColor: 'rgba(0,0,0,0)'
         }} />
      );

      return (
        <div id={props.id}
         className={cssClassnamer.componentPart()}
         onKeyDown={this.handleAnywhereKey.bind(this)}
         onBlur={this.handleBlur.bind(this)}>

          {outsideOverlay}

          <div style={innerStyle}>

            <div id={triggerId}
             className={triggerClasses.join(' ')}
             onClick={this.toggleMenu.bind(this)}
             onKeyDown={this.handleTriggerKey.bind(this)}
             ref='trigger'
             aria-haspopup={true}
             aria-expanded={isOpen}
             role='button'
             tabIndex='0'>
              {props.triggerContent}
            </div>

            {menuWrapper}

          </div>

        </div>
      );
    }
  }

  MenuButton.propTypes = {
    handleSelection: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    triggerContent: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    closeOnSelection: PropTypes.bool,
    flushRight: PropTypes.bool,
    id: PropTypes.string,
    startOpen: PropTypes.bool,
    selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool])
  };

  return MenuButton;
}

function isLetterKeyEvent(e) {
  return e.keyCode >= keys.LOWEST_LETTER_CODE && e.keyCode <= keys.HIGHEST_LETTER_CODE;
}
