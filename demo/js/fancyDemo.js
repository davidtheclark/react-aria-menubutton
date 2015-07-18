import React from 'react/addons';
import ariaMenuButton from '../../src/ariaMenuButton';

const fancyStuff = ['bowling', 'science', 'scooting'];
const CSSTransitionGroup = React.addons.CSSTransitionGroup;

class Fancy extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selected: '' };
    this.ariaMenuButton = ariaMenuButton({
      onSelection: this.handleSelection.bind(this),
    });
  }

  handleSelection(value) {
    this.setState({ selected: value });
  }

  render() {
    const { Button, Menu, MenuItem } = this.ariaMenuButton;

    const fancyMenuItems = fancyStuff.map((activity, i) => (
      <MenuItem
        value={activity}
        text={activity}
        key={i}
        className='FancyMB-menuItem'
      >
        <img src={`svg/${activity}.svg`} className='FancyMB-svg' />
        <span className='FancyMB-text'>
          I enjoy
          <span className='FancyMB-keyword'>
            {activity}
          </span>
        </span>
      </MenuItem>
    ));

    const menuInnards = menuState => {
      const menu = (!menuState.isOpen) ? false : (
        <div className='FancyMB-menu' key='menu'>
          {fancyMenuItems}
        </div>
      );
      return (
        <CSSTransitionGroup transitionName='is'>
          {menu}
        </CSSTransitionGroup>
      );
    };

    return (
      <div>
        <div className='FancyMB'>
          <Button className='FancyMB-trigger'>
            <span className='FancyMB-triggerInnards'>
              <img src='svg/profile-female.svg' className='FancyMB-triggerIcon '/>
              <span className='FancyMB-triggerText'>
                What do you enjoy?<br />
                <span className='FancyMB-triggerSmallText'>
                  (select an enjoyable activity)
                </span>
              </span>
            </span>
          </Button>
          <Menu>
            {menuInnards}
          </Menu>
        </div>
        <span className='FancyMB-selectedText' style={{ marginLeft: '1em' }}>
          You said you enjoy: <strong>{this.state.selected}</strong>
        </span>
      </div>
    );
  }
}

React.render(
  <Fancy />,
  document.getElementById('demo-fancy')
);

// Pre-load the initially hidden SVGs
fancyStuff.forEach(t => {
  const x = new Image();
  x.src = `svg/${t}.svg`;
});
