import { useState } from "react";
import { createRoot } from "react-dom/client";
import { Wrapper, Button, Menu, MenuItem } from "react-aria-menubutton";

const words = [
  "pectinate",
  "borborygmus",
  "anisodactylous",
  "barbar",
  "pilcrow",
  "destroy",
];

function DemoOne() {
  const [selected, setSelected] = useState("");
  const [noMenu, setNoMenu] = useState(false);

  const handleSelection = (value: unknown) => {
    if (value === "destroy") {
      setNoMenu(true);
    } else {
      setSelected(value as string);
    }
  };

  if (noMenu) {
    return (
      <div>
        [You decided to &quot;destroy this menu,&quot; so the menu has been
        destroyed, according to your wishes. Refresh the page to see it again.]
      </div>
    );
  }

  const menuItemElements = words.map((word, i) => {
    let itemClass = "AriaMenuButton-menuItem";
    if (selected === word) {
      itemClass += " is-selected";
    }
    const display = word === "destroy" ? "destroy this menu" : word;
    return (
      <li
        className="AriaMenuButton-menuItemWrapper"
        key={i}
        role="presentation"
      >
        <MenuItem className={itemClass} value={word} text={word}>
          {display}
        </MenuItem>
      </li>
    );
  });

  return (
    <div>
      <Wrapper className="AriaMenuButton" onSelection={handleSelection}>
        <Button tag="button" className="AriaMenuButton-trigger">
          Select a word
        </Button>
        <Menu>
          <ul className="AriaMenuButton-menu">{menuItemElements}</ul>
        </Menu>
      </Wrapper>
      <span style={{ marginLeft: "1em" }}>
        Your last selection was: <strong>{selected}</strong>
      </span>
    </div>
  );
}

const container = document.getElementById("demo-one");
if (container) {
  const root = createRoot(container);
  root.render(<DemoOne />);
}
