import React from 'react';
import ariaMenuButton from '../../src/ariaMenuButton';

const words = ['pectinate', 'borborygmus', 'anisodactylous', 'barbar', 'pilcrow', 'destroy'];
class DemoOne extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selected: '', noMenu: false };
    this.ariaMenuButton = ariaMenuButton({
      onSelection: this.handleSelection.bind(this),
    });
  }

  handleSelection(value) {
    if (value === 'destroy') {
      this.setState({ noMenu: true });
    } else {
      this.setState({ selected: value });
    }
  }

  render() {
    const { selected, noMenu } = this.state;

    if (noMenu) {
      return (
        <div>
          [You decided to "destroy this menu," so the menu has been destroyed,
          according to your wishes.
          Refresh the page to see it again.]
        </div>
      );
    }

    const { Button, Menu, MenuItem } = this.ariaMenuButton;

    const menuItemElements = words.map((word, i) => {
      let itemClass = 'AriaMenuButton-menuItem';
      if (selected === word) {
        itemClass += ' is-selected';
      }
      const display = (word === 'destroy') ? 'destroy this menu' : word;
      return (
        <li className='AriaMenuButton-menuItemWrapper' key={i}>
          <MenuItem
            className={itemClass}
            value={word}
            text={word}
          >
            {display}
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
