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
          <MenuItem value={word} text={word}>
            <div className={itemClass}>
              {word}
            </div>
          </MenuItem>
        </li>
      );
    });

    return (
      <div>
        <div className='AriaMenuButton'>
          <Button>
            <span className='AriaMenuButton-trigger'>
              Select a word
            </span>
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
