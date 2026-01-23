import { useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import { render, screen, fireEvent, act } from "@testing-library/react";
import ManagerContext from "../ManagerContext";
import Menu from "./Menu";
import MockWrapper from "../test-utils/MockWrapper";
import createMockManager from "../test-utils/createMockManager";
import createManager from "../createManager";
import type { MenuButtonManager } from "../types";

function renderWithManager(
  ui: React.ReactElement,
  manager: MenuButtonManager | Partial<MenuButtonManager>
) {
  return render(
    <ManagerContext.Provider value={manager as MenuButtonManager}>
      {ui}
    </ManagerContext.Provider>
  );
}

describe("<Menu>", function () {
  let ambManager: ReturnType<typeof createMockManager>;

  beforeEach(function () {
    ambManager = createMockManager();
  });

  test("closed Menu does not render children (non-function children)", function () {
    const { container } = renderWithManager(
      <Menu>
        <div>foo</div>
      </Menu>,
      ambManager
    );
    // When closed with element children, nothing is rendered
    expect(container.firstChild).toBeNull();
  });

  test("no onBlur behavior when closeOnBlur is false", function () {
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

  test("open Menu DOM with only required props and element child", function () {
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

  test("closed menu DOM with all possible props and function child", function () {
    const childFunction = vi.fn().mockImplementation(function (menuState) {
      return "isOpen = " + String(menuState.isOpen);
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

  test("open menu DOM with all possible props and function child", function () {
    ambManager.isOpen = true;
    const childFunction = vi.fn().mockImplementation(function (menuState) {
      return "isOpen = " + String(menuState.isOpen);
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

  test("menu updating clears items when closed", function () {
    ambManager.menuItems = [1, 2];
    const childFunction = vi.fn().mockReturnValue("menu content");

    function LittleApp() {
      const [, setToggle] = useState(false);

      useEffect(() => {
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

describe("<Menu> rendered via renderToString", function () {
  test("does not throw", function () {
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

describe("<Menu> manager contract", function () {
  test("registers with manager on mount with ref and setState", function () {
    const manager = createManager();

    // Use function children so the menu renders even when closed
    renderWithManager(
      <Menu>
        {({ isOpen }) => <div>Menu is {isOpen ? "open" : "closed"}</div>}
      </Menu>,
      manager
    );

    // Menu should register itself with the manager
    expect(manager.menu).not.toBeNull();
    expect(manager.menu?.ref).toBeDefined();
    expect(manager.menu?.ref.current).toBeInstanceOf(HTMLElement);
    expect(typeof manager.menu?.setState).toBe("function");
  });

  test("setState triggers re-render and shows menu content", function () {
    const manager = createManager();

    const { container } = renderWithManager(
      <Menu>
        <div data-testid="menu-content">Menu Content</div>
      </Menu>,
      manager
    );

    // Initially closed - menu content should not be in DOM
    expect(container.querySelector('[data-testid="menu-content"]')).toBeNull();

    // Simulate what manager.update() does when opening menu
    act(() => {
      manager.isOpen = true;
      manager.menu?.setState?.({ isOpen: true });
    });

    // After setState, menu content should appear
    expect(screen.getByTestId("menu-content")).toBeInTheDocument();
  });

  test("setState with function children updates isOpen state", function () {
    const manager = createManager();

    renderWithManager(
      <Menu>
        {({ isOpen }) => (
          <div data-testid="status">{isOpen ? "OPEN" : "CLOSED"}</div>
        )}
      </Menu>,
      manager
    );

    // Initially closed
    expect(screen.getByTestId("status")).toHaveTextContent("CLOSED");

    // Open via setState
    act(() => {
      manager.isOpen = true;
      manager.menu?.setState?.({ isOpen: true });
    });

    expect(screen.getByTestId("status")).toHaveTextContent("OPEN");

    // Close via setState
    act(() => {
      manager.isOpen = false;
      manager.menu?.setState?.({ isOpen: false });
    });

    expect(screen.getByTestId("status")).toHaveTextContent("CLOSED");
  });

  test("unregisters from manager on unmount", function () {
    const manager = createManager();

    const { unmount } = renderWithManager(
      <Menu>
        {({ isOpen }) => <div>Menu is {isOpen ? "open" : "closed"}</div>}
      </Menu>,
      manager
    );

    expect(manager.menu).not.toBeNull();

    unmount();

    // After unmount, menu should be unregistered
    expect(manager.menu).toBeNull();
  });
});
