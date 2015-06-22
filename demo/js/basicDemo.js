import React from 'react';
import ariaMenuButton from '../../src/ariaMenuButton';

const demoStyle = document.getElementById('demo-style');
const stylesheets = {
  bootstrap: require('css!../css/bootstrap.css'),
  foundation: require('css!../css/foundation.css'),
  github: require('css!../css/github.css'),
};

const firstSelected = 'github';
demoStyle.textContent = stylesheets[firstSelected];

const menuItems = [
  {
    value: 'github',
    display: 'Github',
  },
  {
    value: 'bootstrap',
    display: 'Bootstrap',
  },
  {
    value: 'foundation',
    display: 'Foundation',
  },
];

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selected: firstSelected };
    this.ambSet = ariaMenuButton();
  }

  handleSelection(value) {
    demoStyle.textContent = stylesheets[value];
    this.setState({ selected: value });
  }

  render() {
    const { selected } = this.state;
    const { Container, MenuItem } = this.ambSet;

    const menuItemElements = menuItems.map((item, i) => {
      const cl = ['AriaMenuButton-menuItem'];
      if (selected === item.value) {
        cl.push('is-selected');
      }
      return (
        <li className='AriaMenuButton-menuItemWrapper' key={i}>
          <MenuItem value={item.value} text={item.display}>
            <div className={cl.join(' ')}>
              {item.display}
            </div>
          </MenuItem>
        </li>
      );
    });

    const Menu = (
      <ul className='AriaMenuButton-menu'>
        {menuItemElements}
      </ul>
    );

    return (
      <div className='AriaMenuButton'>
        <Container
          menu={Menu}
          handleSelection={this.handleSelection.bind(this)}
        >
          <span className='AriaMenuButton-trigger'>
            Select a style
          </span>
        </Container>
      </div>
    );
  }
}

React.render(
  <Demo />,
  document.getElementById('style-select')
);
