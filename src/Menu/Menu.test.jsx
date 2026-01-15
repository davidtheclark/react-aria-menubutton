import React from "react";
import ReactDOMServer from "react-dom/server";
import { render, screen, fireEvent } from "@testing-library/react";
import ManagerContext from "../ManagerContext";
import Menu from "./Menu";
import MockWrapper from "../test-utils/MockWrapper";
import createMockManager from "../test-utils/createMockManager";
import createManager from "../createManager";

function renderWithManager(ui, manager) {
  return render(
    <ManagerContext.Provider value={manager}>{ui}</ManagerContext.Provider>
  );
}

describe("<Menu>", function() {
  let ambManager;

  beforeEach(function() {
    ambManager = createMockManager();
  });

  test("closed Menu does not render children (non-function children)", function() {
    const { container } = renderWithManager(
      <Menu>
        <div>foo</div>
      </Menu>,
      ambManager
    );
    // When closed with element children, nothing is rendered
    expect(container.firstChild).toBeNull();
  });

  test("no onBlur behavior when closeOnBlur is false", function() {
    const manager = createManager({ closeOnBlur: false });
    manager.isOpen = true;
    const handleBlur = vi.fn();
    manager.handleBlur = handleBlur;

    renderWithManager(
      <Menu>
        <div>foo</div>
      </Menu>,
      manager
    );
    const menu = screen.getByRole("menu");

    fireEvent.blur(menu);
    expect(handleBlur).not.toHaveBeenCalled();
  });

  test("open Menu DOM with only required props and element child", function() {
    ambManager.isOpen = true;
    renderWithManager(
      <Menu>
        <div>
          <div>foo</div>
        </div>
      </Menu>,
      ambManager
    );

    const menu = screen.getByRole("menu");
    expect(menu).toHaveAttribute("tabindex", "-1");
    expect(menu.tagName.toLowerCase()).toBe("div");
    expect(menu).toHaveTextContent("foo");
  });

  test("closed menu DOM with all possible props and function child", function() {
    const childFunction = vi.fn().mockImplementation(function(menuState) {
      return "isOpen = " + menuState.isOpen;
    });

    renderWithManager(
      <Menu
        id="foo"
        className="bar"
        style={{ bottom: 1 }}
        tag="ul"
        data-something-something="seven"
      >
        {childFunction}
      </Menu>,
      ambManager
    );

    // With function children, menu always renders
    const menu = screen.getByRole("menu");
    expect(menu).toHaveAttribute("id", "foo");
    expect(menu).toHaveClass("bar");
    expect(menu).toHaveStyle({ bottom: "1px" });
    expect(menu.tagName.toLowerCase()).toBe("ul");
    expect(menu).toHaveAttribute("data-something-something", "seven");
    expect(menu).toHaveTextContent("isOpen = false");

    expect(childFunction).toHaveBeenCalledTimes(1);
    expect(childFunction.mock.calls[0]).toEqual([{ isOpen: false }]);
  });

  test("open menu DOM with all possible props and function child", function() {
    ambManager.isOpen = true;
    const childFunction = vi.fn().mockImplementation(function(menuState) {
      return "isOpen = " + menuState.isOpen;
    });

    renderWithManager(
      <Menu id="bar" className="foo" style={{ left: 1 }} tag="section">
        {childFunction}
      </Menu>,
      ambManager
    );

    const menu = screen.getByRole("menu");
    expect(menu).toHaveAttribute("id", "bar");
    expect(menu).toHaveClass("foo");
    expect(menu).toHaveStyle({ left: "1px" });
    expect(menu.tagName.toLowerCase()).toBe("section");
    expect(menu).toHaveTextContent("isOpen = true");

    expect(childFunction).toHaveBeenCalledTimes(1);
    expect(childFunction.mock.calls[0]).toEqual([{ isOpen: true }]);
  });

  test("menu updating clears items when closed", function() {
    ambManager.menuItems = [1, 2];
    const childFunction = vi.fn().mockReturnValue("menu content");

    function LittleApp() {
      const [, setToggle] = React.useState(false);

      React.useEffect(() => {
        // Trigger an update after mount
        setToggle(true);
      }, []);

      return (
        <MockWrapper mockManager={ambManager}>
          <Menu>{childFunction}</Menu>
        </MockWrapper>
      );
    }

    render(<LittleApp />);

    // The clearItems should be called during componentDidUpdate when menu is closed
    expect(ambManager.clearItems).toHaveBeenCalled();
  });
});

describe("<Menu> rendered via renderToString", function() {
  test("does not throw", function() {
    const output = ReactDOMServer.renderToString(
      <MockWrapper mockManager={createMockManager()}>
        <Menu>
          <div>foo</div>
        </Menu>
      </MockWrapper>
    );
    // Menu is closed, so content should be empty
    expect(output).toContain("div");
  });
});
