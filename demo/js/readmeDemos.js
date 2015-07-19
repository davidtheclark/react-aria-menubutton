// Simple ES6 Example
import React from 'react';
import ariaMenuButton from '../../src/ariaMenuButton';

const menuItemWords = ['foo', 'bar', 'baz'];

class MyMenuButton extends React.Component {
  componentWillMount() {
    this.amb = ariaMenuButton({
      onSelection: handleSelection,
    });
  }
  render() {
    const { Button, Menu, MenuItem } = this.amb;

    const menuItems = menuItemWords.map((word, i) => {
      return (
        <li key={i}>
          <MenuItem className='MyMenuButton-menuItem'>
            {word}
          </MenuItem>
        </li>
      );
    });

    return (
      <div className='MyMenuButton'>
        <Button className='MyMenuButton-button'>
          click me
        </Button>
        <Menu className='MyMenuButton-menu'>
          <ul>{menuItems}</ul>
        </Menu>
      </div>
    );
  }
}

// Complex ES5 Example
var CSSTransitionGroup = React.addons.CSSTransitionGroup;

var people = [{
  name: 'Charles Choo-Choo',
  id: 1242,
}, {
  name: 'Mina Meowmers',
  id: 8372,
}, {
  name: 'Susan Sailor',
  id: 2435,
}];

var MyMenuButton2 = React.createClass({
  componentWillMount: function() {
    this.amb = ariaMenuButton({
      onSelection: handleSelection,
    });
  },

  render: function() {
    var MyButton = this.amb.Button;
    var MyMenu = this.amb.Menu;
    var MyMenuItem = this.amb.MenuItem;

    var peopleMenuItems = people.map(function(person, i) {
      return (
        <MyMenuItem
          key={i}
          tag='li'
          value={person.id}
          text={person.name}
          className='PeopleMenu-person'
        >
          <div className='PeopleMenu-personPhoto'>
            <img src={'/people/pictures/' + person.id + '.jpg'}/ >
          </div>
          <div className='PeopleMenu-personName'>
            {person.name}
          </div>
        </MyMenuItem>
      );
    });

    var peopleMenuInnards = function(menuState) {
      var menu = (!menuState.isOpen) ? false : (
        <div
          className='PeopleMenu-menu'
          key='menu'
        >
          {peopleMenuItems}
        </div>
      );
      return (
        <CSSTransitionGroup transitionName='people'>
          {menu}
        </CSSTransitionGroup>
      );
    };

    return (
      <div className='PeopleMenu'>
        <MyButton className='PeopleMenu-trigger'>
          <span className='PeopleMenu-triggerText'>
            Select a person
          </span>
          <span className='PeopleMenu-triggerIcon' />
        </MyButton>
        <MyMenu>
          {peopleMenuInnards}
        </MyMenu>
      </div>
    );
  },
});

// Getting it working
function handleSelection(value, event) {
  console.log(value, event);
}

React.render(
  <div>
    <MyMenuButton />
    <MyMenuButton2 />
  </div>,
  document.body
);

var style = document.createElement('style');
var css = (
`.PeopleMenu-menu {
  transform: scale(1);
  transition: transform 0.3s linear;
}
.PeopleMenu-menu.people-enter,
.PeopleMenu-menu.people-leave.people-leave-active {
  transform: scale(0);
}
.PeopleMenu-menu.people-leave,
.PeopleMenu-menu.people-enter.people-enter-active {
  transform: scale(1);
}
`);
style.appendChild(document.createTextNode(css));
document.head.appendChild(style);
