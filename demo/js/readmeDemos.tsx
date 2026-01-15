// Simple TypeScript Example
import { createRoot } from "react-dom/client";
import {
  Wrapper,
  Button,
  Menu,
  MenuItem,
  type MenuChildrenState,
} from "react-aria-menubutton";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const menuItemWords = ["foo", "bar", "baz"];

function MyMenuButton() {
  const menuItems = menuItemWords.map((word, i) => {
    return (
      <li key={i}>
        <MenuItem className="MyMenuButton-menuItem">{word}</MenuItem>
      </li>
    );
  });

  return (
    <Wrapper className="MyMenuButton" onSelection={handleSelection}>
      <Button className="MyMenuButton-button">click me</Button>
      <Menu className="MyMenuButton-menu">
        <ul>{menuItems}</ul>
      </Menu>
    </Wrapper>
  );
}

// Slightly more complex example:
// - MenuItems have hidden values that are passed
//   to the selection handler
// - User can navigate the MenuItems by typing the
//   first letter of a person's name, even though
//   each MenuItem's child is not simple text
// - Menu has a function for a child
// - React's TransitionGroup is used for open-close animation

interface Person {
  name: string;
  id: number;
}

const people: Person[] = [
  {
    name: "Charles Choo-Choo",
    id: 1242,
  },
  {
    name: "Mina Meowmers",
    id: 8372,
  },
  {
    name: "Susan Sailor",
    id: 2435,
  },
];

function MyMenuButton2() {
  const peopleMenuItems = people.map((person, i) => (
    <MenuItem
      key={i}
      tag="li"
      value={person.id}
      text={person.name}
      className="PeopleMenu-person"
    >
      <div className="PeopleMenu-personPhoto">
        <img
          src={`/people/pictures/${String(person.id)}.jpg`}
          alt={person.name}
        />
      </div>
      <div className="PeopleMenu-personName">{person.name}</div>
    </MenuItem>
  ));

  const peopleMenuInnards = (menuState: MenuChildrenState) => {
    return (
      <TransitionGroup>
        {menuState.isOpen && (
          <CSSTransition classNames="people" timeout={300}>
            <div className="PeopleMenu-menu" key="menu">
              {peopleMenuItems}
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    );
  };

  return (
    <Wrapper
      className="PeopleMenu"
      onSelection={handleSelection}
      style={{ marginTop: 20 }}
    >
      <Button className="PeopleMenu-trigger">
        <span className="PeopleMenu-triggerText">Select a person</span>
        <span className="PeopleMenu-triggerIcon" />
      </Button>
      <Menu>{peopleMenuInnards}</Menu>
    </Wrapper>
  );
}

// Getting it working
function handleSelection(value: unknown, event: React.SyntheticEvent) {
  console.log(value, event);
}

const container = document.body;
const root = createRoot(container);
root.render(
  <div>
    <MyMenuButton />
    <MyMenuButton2 />
  </div>
);

// Add styles dynamically
const style = document.createElement("style");
const css = `.PeopleMenu-menu {
  transform: scale(1);
  transition: transform 0.3s linear;
}
.people-enter {
  transform: scale(0);
}
.people-enter-active {
  transform: scale(1);
}
.people-exit {
  transform: scale(1);
}
.people-exit-active {
  transform: scale(0);
}
`;
style.appendChild(document.createTextNode(css));
document.head.appendChild(style);
