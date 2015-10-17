import React from 'react';
import ReactDOM from 'react-dom';
import AriaMenuButton from '../../src';

const words = ['pectinate', 'borborygmus', 'anisodactylous', 'barbar', 'pilcrow', 'destroy'];
class DemoOne extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selected: '', noMenu: false };
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

    const menuItemElements = words.map((word, i) => {
      let itemClass = 'AriaMenuButton-menuItem';
      if (selected === word) {
        itemClass += ' is-selected';
      }
      const display = (word === 'destroy') ? 'destroy this menu' : word;
      return (
        <li className='AriaMenuButton-menuItemWrapper' key={i}>
          <AriaMenuButton.MenuItem
            className={itemClass}
            value={word}
            text={word}
          >
            {display}
          </AriaMenuButton.MenuItem>
        </li>
      );
    });

    return (
      <div>
        <AriaMenuButton.Wrapper
          className='AriaMenuButton'
          onSelection={this.handleSelection.bind(this)}
        >
          <AriaMenuButton.Button className='AriaMenuButton-trigger'>
            Select a word
          </AriaMenuButton.Button>
          <AriaMenuButton.Menu>
            <ul className='AriaMenuButton-menu'>
              {menuItemElements}
            </ul>
          </AriaMenuButton.Menu>
        </AriaMenuButton.Wrapper>
        <span style={{ marginLeft: '1em' }}>
          Your last selection was: <strong>{selected}</strong>
        </span>
      </div>
    );
  }
}

ReactDOM.render(
  <DemoOne />,
  document.getElementById('demo-one')
);
