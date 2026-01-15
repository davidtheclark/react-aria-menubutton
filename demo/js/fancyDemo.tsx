import { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Wrapper,
  Button,
  Menu,
  MenuItem,
  openMenu,
  closeMenu,
  type MenuChildrenState,
} from "react-aria-menubutton";

const fancyStuff = ["bowling", "science", "scooting"];

interface SelectionData {
  activity: string;
  somethingArbitrary: string;
}

function Fancy() {
  const [selected, setSelected] = useState("");

  const handleSelection = (data: unknown) => {
    setSelected((data as SelectionData).activity);
  };

  const fancyMenuItems = fancyStuff.map((activity, i) => (
    <MenuItem
      value={{
        activity,
        somethingArbitrary: "arbitrary",
      }}
      text={activity}
      key={i}
      className="FancyMB-menuItem"
    >
      <img src={`svg/${activity}.svg`} className="FancyMB-svg" alt={activity} />
      <span className="FancyMB-text">
        I enjoy
        <span className="FancyMB-keyword">{activity}</span>
      </span>
    </MenuItem>
  ));

  const menuInnards = (menuState: MenuChildrenState) => {
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
        <button
          onClick={() => {
            openMenu("foo");
          }}
        >
          open menu below
        </button>
        <button
          onClick={() => {
            openMenu("foo", { focusMenu: false });
          }}
        >
          open menu below without focus
        </button>
        <button
          onClick={() => {
            closeMenu("foo");
          }}
        >
          close menu below
        </button>
      </div>
      <div>
        <Wrapper onSelection={handleSelection} className="FancyMB" id="foo">
          <Button className="FancyMB-trigger">
            <span className="FancyMB-triggerInnards">
              <img
                src="svg/profile-female.svg"
                className="FancyMB-triggerIcon"
                alt="Profile"
              />
              <span className="FancyMB-triggerText">
                What do you enjoy?
                <br />
                <span className="FancyMB-triggerSmallText">
                  (select an enjoyable activity)
                </span>
              </span>
            </span>
          </Button>
          <Menu>{menuInnards}</Menu>
        </Wrapper>
        <span className="FancyMB-selectedText" style={{ marginLeft: "1em" }}>
          You said you enjoy: <strong>{selected}</strong>
        </span>
      </div>
    </div>
  );
}

const container = document.getElementById("demo-fancy");
if (container) {
  const root = createRoot(container);
  root.render(<Fancy />);
}

// Pre-load the initially hidden SVGs
fancyStuff.forEach((t) => {
  const x = new Image();
  x.src = `svg/${t}.svg`;
});
