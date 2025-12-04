// Simple ES6 Example
import React from 'react';
import ReactDOM from 'react-dom';
import AriaMenuButton from '../../src';

const menuItemWords = ['foo', 'bar', 'baz'];

class MyMenuButton extends React.Component {
  render() {
    const menuItems = menuItemWords.map((word, i) => {
      return (
        <li key={i}>
          <AriaMenuButton.MenuItem className="MyMenuButton-menuItem">
            {word}
          </AriaMenuButton.MenuItem>
        </li>
      );
    });

    return (
      <AriaMenuButton.Wrapper
        className="MyMenuButton"
        onSelection={handleSelection}
      >
        <AriaMenuButton.Button className="MyMenuButton-button">
          click me
        </AriaMenuButton.Button>
        <AriaMenuButton.Menu className="MyMenuButton-menu">
          <ul>{menuItems}</ul>
        </AriaMenuButton.Menu>
      </AriaMenuButton.Wrapper>
    );
  }
}

// Slightly more complex, ES5 example:
// - MenuItems have hidden values that are passed
//   to the selection handler
// - User can navigate the MenuItems by typing the
//   first letter of a person's name, even though
//   each MenuItem's child is not simple text
// - Menu has a function for a child
// - React's CSSTransitionGroup is used for open-close animation

var CSSTransitionGroup = require('react-transition-group/CSSTransitionGroup');
var AmbWrapper = AriaMenuButton.Wrapper;
var AmbButton = AriaMenuButton.Button;
var AmbMenu = AriaMenuButton.Menu;
var AmbMenuItem = AriaMenuButton.MenuItem;

var people = [
  {
    name: 'Charles Choo-Choo',
    id: 1242
  },
  {
    name: 'Mina Meowmers',
    id: 8372
  },
  {
    name: 'Susan Sailor',
    id: 2435
  }
];

class MyMenuButton2 extends React.Component {
  render() {
    var peopleMenuItems = people.map(function(person, i) {
      return (
        <AmbMenuItem
          key={i}
          tag="li"
          value={person.id}
          text={person.name}
          className="PeopleMenu-person"
        >
          <div className="PeopleMenu-personPhoto">
            <img src={'/people/pictures/' + person.id + '.jpg'} />
          </div>
          <div className="PeopleMenu-personName">{person.name}</div>
        </AmbMenuItem>
      );
    });

    var peopleMenuInnards = function(menuState) {
      var menu = !menuState.isOpen ? (
        false
      ) : (
        <div className="PeopleMenu-menu" key="menu">
          {peopleMenuItems}
        </div>
      );
      return (
        <CSSTransitionGroup transitionName="people">{menu}</CSSTransitionGroup>
      );
    };

    return (
      <AmbWrapper
        className="PeopleMenu"
        onSelection={handleSelection}
        style={{ marginTop: 20 }}
      >
        <AmbButton className="PeopleMenu-trigger">
          <span className="PeopleMenu-triggerText">Select a person</span>
          <span className="PeopleMenu-triggerIcon" />
        </AmbButton>
        <AmbMenu>{peopleMenuInnards}</AmbMenu>
      </AmbWrapper>
    );
  }
}

// Getting it working
function handleSelection(value, event) {
  console.log(value, event);
}

ReactDOM.render(
  <div>
    <MyMenuButton />
    <MyMenuButton2 />
  </div>,
  document.body
);

var style = document.createElement('style');
var css = `.PeopleMenu-menu {
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
`;
style.appendChild(document.createTextNode(css));
document.head.appendChild(style);
