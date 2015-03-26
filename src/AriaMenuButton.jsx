import React, { PropTypes } from 'react/addons';
import classNames from 'classnames';
import * as keys from './keys';
import Menu from './Menu';
import focusManager from './focusManager';

const CSSTransitionGroup = React.addons.CSSTransitionGroup;

export default class AriaMenuButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = { isOpen: !!props.isOpen };
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
      this.closeMenu(false);
    }, 0);
  }

  handleSelection(v) {
    if (this.props.closeOnSelection) this.closeMenu();
    this.props.handleSelection(v);
  }

  render() {
    const props = this.props;
    const isOpen = this.state.isOpen;

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

    const triggerClasses = classNames({
      'AriaMenuButton-trigger': true,
      'is-open': isOpen
    });

    return (
      <div id={props.id}
       className='AriaMenuButton'
       onKeyDown={this.handleAnywhereKey.bind(this)}
       onBlur={this.handleBlur.bind(this)}>

        <div id={`${props.id}-trigger`}
         className={triggerClasses}
         onClick={this.toggleMenu.bind(this)}
         onKeyDown={this.handleTriggerKey.bind(this)}
         ref='trigger'
         aria-haspopup={true}
         aria-expanded={isOpen}
         role='button'
         tabIndex='0'>
          {props.triggerLabel}
        </div>

        {menuWrapper}

      </div>
    );
  }
}

AriaMenuButton.propTypes = {
  id: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  triggerLabel: PropTypes.string.isRequired,
  closeOnSelection: PropTypes.bool,
  flushRight: PropTypes.bool,
  handleSelection: PropTypes.func,
  isOpen: PropTypes.bool,
  selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  transition: PropTypes.bool
};

function isLetterKeyEvent(e) {
  return e.keyCode >= keys.LOWEST_LETTER_CODE && e.keyCode <= keys.HIGHEST_LETTER_CODE;
}
