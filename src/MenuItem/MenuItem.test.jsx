import React from "react";
import ReactDOMServer from "react-dom/server";
import { render, screen, fireEvent } from "@testing-library/react";
import ManagerContext from "../ManagerContext";
import MenuItem from "./MenuItem";
import MockWrapper from "../test-utils/MockWrapper";
import createMockManager from "../test-utils/createMockManager";

function renderWithManager(ui, manager) {
  return render(
    <ManagerContext.Provider value={manager}>{ui}</ManagerContext.Provider>
  );
}

describe("<MenuItem>", function() {
  let ambManager;

  beforeEach(function() {
    ambManager = createMockManager();
  });

  it("DOM with only required props", function() {
    renderWithManager(<MenuItem>foo</MenuItem>, ambManager);

    const menuItem = screen.getByRole("menuitem");
    expect(menuItem).toHaveAttribute("tabindex", "-1");
    expect(menuItem.tagName.toLowerCase()).toBe("div");
    expect(menuItem).toHaveTextContent("foo");
  });

  it("DOM with all possible props and element child", function() {
    renderWithManager(
      <MenuItem
        className="foobar"
        id="hogwash"
        tag="li"
        style={{ right: "1em" }}
        text="horse"
        value="lamb"
        data-something-something="seven"
      >
        <a href="#">foo</a>
      </MenuItem>,
      ambManager
    );

    const menuItem = screen.getByRole("menuitem");
    expect(menuItem).toHaveAttribute("id", "hogwash");
    expect(menuItem).toHaveClass("foobar");
    expect(menuItem).toHaveStyle({ right: "1em" });
    expect(menuItem.tagName.toLowerCase()).toBe("li");
    expect(menuItem).toHaveAttribute("data-something-something", "seven");
    expect(menuItem).toHaveTextContent("foo");
  });

  it("click without specified value prop", function() {
    renderWithManager(<MenuItem>foo</MenuItem>, ambManager);

    const menuItem = screen.getByRole("menuitem");
    fireEvent.click(menuItem);

    expect(ambManager.handleSelection).toHaveBeenCalledTimes(1);
    // First argument is the value (children when no value prop)
    expect(ambManager.handleSelection.mock.calls[0][0]).toBe("foo");
  });

  it("click with specified value prop", function() {
    renderWithManager(<MenuItem value="bar">foo</MenuItem>, ambManager);

    const menuItem = screen.getByRole("menuitem");
    fireEvent.click(menuItem);

    expect(ambManager.handleSelection).toHaveBeenCalledTimes(1);
    expect(ambManager.handleSelection.mock.calls[0][0]).toBe("bar");
  });

  it("keyboard selection with Enter and Space keys", function() {
    renderWithManager(<MenuItem>foo</MenuItem>, ambManager);

    const menuItem = screen.getByRole("menuitem");

    fireEvent.keyDown(menuItem, { key: "Enter" });
    fireEvent.keyDown(menuItem, { key: " " });
    fireEvent.keyDown(menuItem, { key: "Escape" });

    // Only Enter and Space should trigger selection, not Escape
    expect(ambManager.handleSelection).toHaveBeenCalledTimes(2);
    expect(ambManager.handleSelection.mock.calls[0][0]).toBe("foo");
    expect(ambManager.handleSelection.mock.calls[1][0]).toBe("foo");
  });
});

describe("<MenuItem> rendered via renderToString", function() {
  it("does not throw", function() {
    const output = ReactDOMServer.renderToString(
      <MockWrapper mockManager={createMockManager()}>
        <MenuItem>foo</MenuItem>
      </MockWrapper>
    );
    expect(output).toContain('role="menuitem"');
    expect(output).toContain("foo");
  });
});
