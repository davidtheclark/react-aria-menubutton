import React from 'react';
import ReactDOM from 'react-dom';
import {
  Wrapper,
  Button,
  Menu,
  MenuItem,
  openMenu,
  closeMenu
} from '../../src';

const fancyStuff = ['bowling', 'science', 'scooting'];

class Fancy extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selected: '' };
  }

  handleSelection(data) {
    this.setState({ selected: data.activity });
  }

  render() {
    const fancyMenuItems = fancyStuff.map((activity, i) => (
      <MenuItem
        value={{
          activity,
          somethingArbitrary: 'arbitrary'
        }}
        text={activity}
        key={i}
        className="FancyMB-menuItem"
      >
        <img src={`svg/${activity}.svg`} className="FancyMB-svg" />
        <span className="FancyMB-text">
          I enjoy
          <span className="FancyMB-keyword">{activity}</span>
        </span>
      </MenuItem>
    ));

    const menuInnards = menuState => {
      if (!menuState.isOpen) return null;
      return (
        <div className="FancyMB-menu" key="menu">
          {fancyMenuItems}
        </div>
      );
    };

    return (
      <div>
        <div style={{ marginBottom: 20 }}>
          <button onClick={() => openMenu('foo')}>open menu below</button>
          <button onClick={() => openMenu('foo', { focusMenu: false })}>
            open menu below without focus
          </button>
          <button onClick={() => closeMenu('foo')}>close menu below</button>
        </div>
        <div>
          <Wrapper
            onSelection={this.handleSelection.bind(this)}
            className="FancyMB"
            id="foo"
          >
            <Button className="FancyMB-trigger">
              <span className="FancyMB-triggerInnards">
                <img
                  src="svg/profile-female.svg"
                  className="FancyMB-triggerIcon "
                />
                <span className="FancyMB-triggerText">
                  What do you enjoy?<br />
                  <span className="FancyMB-triggerSmallText">
                    (select an enjoyable activity)
                  </span>
                </span>
              </span>
            </Button>
            <Menu>{menuInnards}</Menu>
          </Wrapper>
          <span className="FancyMB-selectedText" style={{ marginLeft: '1em' }}>
            You said you enjoy: <strong>{this.state.selected}</strong>
          </span>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Fancy />, document.getElementById('demo-fancy'));

// Pre-load the initially hidden SVGs
fancyStuff.forEach(t => {
  const x = new Image();
  x.src = `svg/${t}.svg`;
});
