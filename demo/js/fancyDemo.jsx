import React from 'react/addons';
import ariaMenuButton from '../../src/ariaMenuButton';

const fancyStuff = ['bowling', 'science', 'scooting'];
const { CSSTransitionGroup } = React.addons;

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
    const { Container, MenuItem } = this.ambSet;

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

    const FancyMenu = (
      <div className='AriaMenuButton-menu' key='menu'>
        {fancyMenuItems}
      </div>
    );

    return (
      <div>
        <div className='AriaMenuButton'>
            <Container
              closeOnSelection={true}
              menu={FancyMenu}
              handleSelection={this.handleSelection.bind(this)}
              tag={CSSTransitionGroup}
            >
              <CSSTransitionGroup transitionName='is'>
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
              </CSSTransitionGroup>
            </Container>
        </div>
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
