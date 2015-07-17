import React from 'react';
import ariaMenuButton from '../../src/ariaMenuButton';

const words = ['pectinate', 'borborygmus', 'anisodactylous', 'barbar', 'pilcrow'];
class DemoOne extends React.Component {
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
    const { selected } = this.state;
    const { Button, Menu, MenuItem } = this.ariaMenuButton;

    const menuItemElements = words.map((word, i) => {
      let itemClass = 'AriaMenuButton-menuItem';
      if (selected === word) {
        itemClass += ' is-selected';
      }
      return (
        <li className='AriaMenuButton-menuItemWrapper' key={i}>
          <MenuItem
            className={itemClass}
            value={word}
            text={word}
          >
            {word}
          </MenuItem>
        </li>
      );
    });

    return (
      <div>
        <div className='AriaMenuButton'>
          <Button className='AriaMenuButton-trigger'>
            Select a word
          </Button>
          <Menu>
            <ul className='AriaMenuButton-menu'>
              {menuItemElements}
            </ul>
          </Menu>
        </div>
        <span style={{ marginLeft: '1em' }}>
          Your last selection was: <strong>{selected}</strong>
        </span>
      </div>
    );
  }
}

React.render(
  <DemoOne />,
  document.getElementById('demo-one')
);
