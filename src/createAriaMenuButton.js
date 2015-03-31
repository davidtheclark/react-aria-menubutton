import * as keys from './keys';
import createMenu from './createMenu';
import focusManager from './focusManager';

export default function createAriaMenuButton(React=global.React, classNames=global.classNames) {

  const Menu = createMenu(React, classNames);
  const CSSTransitionGroup = (React.addons) ? React.addons.CSSTransitionGroup : false;

  class AriaMenuButton extends React.Component {

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

    componentWillMount() {
      if (this.props.transition && !CSSTransitionGroup) {
        throw new Error(
          'If you want to use transitions with ariaMenuButton, you need to pass it ' +
          'React with addons'
        );
      }
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
      this.blurTimeout = setTimeout(() => {
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
      console.log('overlay click triggered');
      this.closeMenu(false);
    }

    render() {
      const props = this.props;
      const isOpen = this.state.isOpen;

      const triggerId = (props.id) ? `${props.id}-trigger` : undefined;
      const outsideId = (props.id) ? `${props.id}-outside` : undefined;
      const triggerClasses = classNames({
        'AriaMenuButton-trigger': true,
        'is-open': isOpen
      });

      const menu = (isOpen) ? (
        <Menu {...props}
         handleSelection={this.handleSelection.bind(this)}
         receiveFocus={this.state.innerFocus}
         focusManager={this.focusManager} />
      ) : false;

      const menuWrapper = (props.transition) ? (
        <CSSTransitionGroup transitionName='is'
         component='div'
         className='AriaMenuButton-menuWrapper AriaMenuButton-menuWrapper--trans'
         onKeyDown={this.handleMenuKey.bind(this)}>
          {menu}
        </CSSTransitionGroup>
      ) : (
        <div className='AriaMenuButton-menuWrapper'
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
         className='AriaMenuButton'
         onKeyDown={this.handleAnywhereKey.bind(this)}
         onBlur={this.handleBlur.bind(this)}>

          {outsideOverlay}

          <div style={innerStyle}>

            <div id={triggerId}
             className={triggerClasses}
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

  const pt = React.PropTypes;
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
