import React from 'react/addons';
import ariaMenuButton from '../../src/ariaMenuButton';

const fancyStuff = ['bowling', 'science', 'scooting'];
const CSSTransitionGroup = React.addons.CSSTransitionGroup;

class Fancy extends React.Component {
  constructor(props) {
    super(props);
    this.state = { lastSelected: '' };
    this.ambSet = ariaMenuButton();
  }

  handleSelection(value) {
    this.setState({ lastSelected: value });
  }

  render() {
    const { Button, Menu, MenuItem } = this.ambSet;

    const fancyMenuItems = fancyStuff.map((activity, i) => (
      <MenuItem
        value={activity}
        text={activity}
        key={i}
      >
        <div className='AriaMenuButton-menuItem Fancy-item'>
          <img src={`svg/${activity}.svg`} className='Fancy-svg' />
          <span className='Fancy-text'>
            Humans enjoy
            <span className='Fancy-keyword'>
              {activity}
            </span>
          </span>
        </div>
      </MenuItem>
    ));

    const menuInnards = menuIsOpen => {
      const menu = (!menuIsOpen) ? false : (
        <div className='AriaMenuButton-menu' key='menu'>
          {fancyMenuItems}
        </div>
      );
      return (
        <CSSTransitionGroup transitionName='is'>
          {menu}
        </CSSTransitionGroup>
      )
    }

    return (
      <div>
        <Button>
          <div className='AriaMenuButton'>
            <div className='AriaMenuButton-trigger' key='trigger'>
              <div className='Fancy-triggerInnards'>
                <img src='svg/profile-female.svg' className='Fancy-triggerIcon '/>
                <div className='Fancy-triggerText'>
                  Humans enjoy fancy things<br />
                  <span className='Fancy-triggerSmallText'>
                    (click to select a fancy thing)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Button>
        <Menu>
          {menuInnards}
        </Menu>
        <div className='Fancy-selectedText'>
          Last selection: {this.state.lastSelected}
        </div>
      </div>
    );
  }
}

React.render(
  <Fancy />,
  document.getElementById('fancy-container')
);

// Pre-load the initially hidden SVGs
fancyStuff.forEach(t => {
  const x = new Image();
  x.src = `svg/${t}.svg`;
});
